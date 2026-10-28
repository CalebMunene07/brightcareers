"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/app/admin/actions";
import { textToBody } from "@/lib/articles";
import { requireAdmin } from "@/lib/auth";
import { todayIso } from "@/lib/jobs";
import { legalSlugs, resetLegal, saveLegal } from "@/lib/legal-repo";

export async function saveLegalAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  if (!legalSlugs.includes(slug)) return { ok: false, message: "Unknown page." };

  const title = String(formData.get("title") ?? "").trim().slice(0, 200);
  const summary = String(formData.get("summary") ?? "").trim().slice(0, 500);
  const body = textToBody(String(formData.get("body") ?? "").slice(0, 100_000));

  const errors: Record<string, string> = {};
  if (!title) errors.title = "Required.";
  if (body.length === 0) errors.body = "The page can't be empty.";
  if (Object.keys(errors).length > 0) return { ok: false, message: "Please fix the highlighted fields.", errors };

  await saveLegal(slug, { title, summary, body, updated: todayIso(), reviewed: formData.get("reviewed") === "on" }, session.email);
  revalidatePath(`/${slug}`);
  return { ok: true, message: "Saved. The page has been updated." };
}

export async function resetLegalAction(slug: string) {
  await requireAdmin();
  if (!legalSlugs.includes(slug)) return;
  await resetLegal(slug);
  revalidatePath(`/${slug}`);
  redirect(`/admin/legal/${slug}?reset=1`);
}
