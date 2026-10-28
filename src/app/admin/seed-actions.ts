"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { seedStarterContent } from "@/lib/seed";

export async function seedStarterContentAction(): Promise<ActionState> {
  await requireAdmin();
  try {
    const report = await seedStarterContent();
    const added = Object.entries(report).filter(([, n]) => n > 0);
    revalidatePath("/", "layout");
    return {
      ok: true,
      message: added.length
        ? `Added ${added.map(([what, n]) => `${n} ${what}`).join(", ")}.`
        : "Everything was already there. Nothing was changed.",
    };
  } catch (error) {
    console.error("Seeding starter content failed", error);
    return { ok: false, message: "Couldn't load the starter content. Please try again." };
  }
}
