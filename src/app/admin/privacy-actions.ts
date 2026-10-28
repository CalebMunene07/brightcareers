"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { deleteByEmail, runRetention } from "@/lib/privacy";

export async function eraseEmailAction(email: string) {
  const session = await requireAdmin();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  const deleted = await deleteByEmail(email, session.email);
  revalidatePath("/admin", "layout");
  redirect(`/admin/privacy?erased=${deleted}`);
}

export async function runRetentionAction(): Promise<ActionState> {
  const session = await requireAdmin();
  const result = await runRetention(session.email);
  const total = Object.values(result).reduce((a, b) => a + b, 0);
  revalidatePath("/admin", "layout");
  const detail = Object.entries(result).map(([k, n]) => `${k}: ${n}`).join(", ");
  return { ok: true, message: total ? `Deleted ${total} old record(s) (${detail}).` : "Nothing was old enough to delete." };
}
