"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { getDictionary, isLocale } from "@/lib/i18n";
import { chromeKeys, menus, saveNavOverrides, type NavOverrides } from "@/lib/nav-repo";

export async function saveNavAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const locale = String(formData.get("locale") ?? "");
  if (!isLocale(locale)) return { ok: false, message: "Unknown language." };

  // Only accept known fields; empty values fall back to the built-in label.
  const base = getDictionary(locale);
  const allowed = [
    ...chromeKeys.map((k) => `chrome:${k}`),
    ...menus.flatMap((m) => base[m].map((item) => `${m}:${item.href}`)),
  ];
  const value: NavOverrides = {};
  for (const field of allowed) {
    const v = String(formData.get(field) ?? "").trim().slice(0, 60);
    if (v) value[field] = v;
  }

  await saveNavOverrides(locale, value, session.email);
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved. Menus have been updated." };
}
