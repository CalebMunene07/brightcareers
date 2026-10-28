import "server-only";
import { scrypt as scryptCb, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { collections, getDb } from "@/lib/db";

// Admin accounts and password hashing. Kept free of Next.js imports so scripts
// (like the database seed) can use it too.

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

/* ---------------- Passwords (format: scrypt$<salt b64>$<hash b64>) ---------------- */

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length);
  return timingSafeEqual(actual, expected);
}

/* ---------------- Admin accounts ---------------- */

export type AdminDoc = {
  email: string;
  name: string;
  passwordHash: string;
  active?: boolean;
  sessionVersion?: number;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function adminsCollection() {
  return (await getDb()).collection<AdminDoc>(collections.admins);
}
