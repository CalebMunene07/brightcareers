"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/app/admin/actions";
import {
  adminsCollection,
  endSession,
  hashPassword,
  requireAdmin,
  startSession,
  verifyPassword,
} from "@/lib/auth";

// Admin account management. Every action re-checks the session.

const MIN_PASSWORD = 10;

export async function createAdminAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const errors: Record<string, string> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!name) errors.name = "Required.";
  if (password.length < MIN_PASSWORD) errors.password = `At least ${MIN_PASSWORD} characters.`;
  const admins = await adminsCollection();
  if (!errors.email && (await admins.countDocuments({ email }, { limit: 1 }))) {
    errors.email = "An admin with this email already exists.";
  }
  if (Object.keys(errors).length > 0) return { ok: false, message: "Please fix the highlighted fields.", errors };

  await admins.insertOne({
    email,
    name,
    passwordHash: await hashPassword(password),
    active: true,
    sessionVersion: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  revalidatePath("/admin/users");
  return { ok: true, message: `Created ${email}. Share the password with them securely.` };
}

export async function setAdminActiveAction(id: string, active: boolean) {
  const session = await requireAdmin();
  if (!ObjectId.isValid(id)) return;
  const admins = await adminsCollection();
  if (!active) {
    if (id === session.id) return; // can't deactivate yourself
    if ((await admins.countDocuments({ active: { $ne: false } })) <= 1) return; // keep one admin
  }
  // Bumping sessionVersion signs the account out everywhere.
  await admins.updateOne({ _id: new ObjectId(id) }, { $set: { active, updatedAt: new Date() }, $inc: { sessionVersion: 1 } });
  revalidatePath("/admin/users");
}

export async function resetAdminPasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!ObjectId.isValid(id)) return { ok: false, message: "Unknown admin." };
  if (password.length < MIN_PASSWORD) return { ok: false, message: `Password must be at least ${MIN_PASSWORD} characters.` };

  await (await adminsCollection()).updateOne(
    { _id: new ObjectId(id) },
    { $set: { passwordHash: await hashPassword(password), updatedAt: new Date() }, $inc: { sessionVersion: 1 } },
  );
  if (id === session.id) {
    await endSession();
    redirect("/admin/login");
  }
  revalidatePath("/admin/users");
  return { ok: true, message: "Password updated. They'll need to sign in again." };
}

export async function changeOwnPasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (next.length < MIN_PASSWORD) return { ok: false, message: `New password must be at least ${MIN_PASSWORD} characters.` };
  if (next !== confirm) return { ok: false, message: "The new passwords don't match." };

  const admins = await adminsCollection();
  const admin = await admins.findOne({ _id: new ObjectId(session.id) });
  if (!admin || !(await verifyPassword(current, admin.passwordHash))) {
    return { ok: false, message: "Your current password is incorrect." };
  }

  const v = (admin.sessionVersion ?? 0) + 1;
  await admins.updateOne(
    { _id: admin._id },
    { $set: { passwordHash: await hashPassword(next), sessionVersion: v, updatedAt: new Date() } },
  );
  // Other devices are signed out; this one gets a fresh session.
  await startSession({ id: session.id, email: admin.email, name: admin.name, v });
  return { ok: true, message: "Password changed. Other devices have been signed out." };
}

export async function renameAdminAction(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  if (!ObjectId.isValid(id) || !name) return;
  await (await adminsCollection()).updateOne({ _id: new ObjectId(id) }, { $set: { name, updatedAt: new Date() } });
  revalidatePath("/admin", "layout");
}
