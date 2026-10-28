import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { ObjectId } from "mongodb";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { adminsCollection, verifyPassword } from "@/lib/admin-store";
import { collections, getDb } from "@/lib/db";

export { adminsCollection, hashPassword, verifyPassword, type AdminDoc } from "@/lib/admin-store";

export const SESSION_COOKIE = "bcg_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export type AdminSession = { id: string; email: string; name: string; v: number; exp: number };

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set to at least 32 characters");
  return s;
}

/* ---------------- Signed session token ---------------- */

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encode(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decode(token: string): AdminSession | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as AdminSession;
    return session.exp > Date.now() / 1000 ? session : null;
  } catch {
    return null;
  }
}

/* ---------------- Login rate limiting ---------------- */

const MAX_FAILURES = 5;
const WINDOW_MINUTES = 15;

type AttemptDoc = { key: string; createdAt: Date };

async function attemptsCollection() {
  const col = (await getDb()).collection<AttemptDoc>(collections.loginAttempts);
  // Old attempts expire automatically.
  await col.createIndex({ createdAt: 1 }, { expireAfterSeconds: WINDOW_MINUTES * 60 }).catch(() => {});
  return col;
}

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}

/** True when this email or IP has too many recent failed logins. */
export async function isLoginBlocked(email: string) {
  const col = await attemptsCollection();
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000);
  const keys = [`email:${email.trim().toLowerCase()}`, `ip:${await clientIp()}`];
  const counts = await Promise.all(keys.map((key) => col.countDocuments({ key, createdAt: { $gte: since } })));
  return counts.some((c) => c >= MAX_FAILURES);
}

async function recordFailure(email: string) {
  const col = await attemptsCollection();
  const now = new Date();
  await col.insertMany([
    { key: `email:${email.trim().toLowerCase()}`, createdAt: now },
    { key: `ip:${await clientIp()}`, createdAt: now },
  ]);
}

async function clearFailures(email: string) {
  await (await attemptsCollection()).deleteMany({ key: `email:${email.trim().toLowerCase()}` });
}

/* ---------------- Sessions ---------------- */

export async function authenticate(email: string, password: string) {
  const admins = await adminsCollection();
  const admin = await admins.findOne({ email: email.trim().toLowerCase(), active: { $ne: false } });
  // Always run a hash comparison so response time doesn't reveal whether the email exists.
  const ok = await verifyPassword(password, admin?.passwordHash ?? "scrypt$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(88));
  if (!admin || !ok) {
    await recordFailure(email);
    return null;
  }
  await clearFailures(email);
  await admins.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } });
  return { id: admin._id.toString(), email: admin.email, name: admin.name, v: admin.sessionVersion ?? 0 };
}

export async function startSession(admin: { id: string; email: string; name: string; v: number }) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  (await cookies()).set(SESSION_COOKIE, encode({ ...admin, exp }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/**
 * The signed-in admin, or null. Checked against the database on every request so that
 * deactivating an account or changing its password signs it out immediately.
 */
export const getSession = cache(async (): Promise<AdminSession | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = token ? decode(token) : null;
  if (!session || !ObjectId.isValid(session.id)) return null;
  const admin = await (await adminsCollection()).findOne(
    { _id: new ObjectId(session.id), active: { $ne: false } },
    { projection: { name: 1, email: 1, sessionVersion: 1 } },
  );
  if (!admin || (admin.sessionVersion ?? 0) !== (session.v ?? 0)) return null;
  return { ...session, name: admin.name, email: admin.email };
});

/** Use at the top of every admin page, server action and route handler. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
