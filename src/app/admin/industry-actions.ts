"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { deleteIndustry, importDefaultIndustries, industrySlugTaken, saveIndustry } from "@/lib/industries-repo";
import { isAllowedImageSrc } from "@/lib/media";
import { lines, slugify } from "@/lib/text";

export async function saveIndustryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const get = (k: string) => String(formData.get(k) ?? "").trim().slice(0, 2000);
  const id = get("id") || undefined;
  const name = get("name");
  const slug = slugify(get("slug") || name);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Required.";
  if (!get("description")) errors.description = "Required.";
  if (!slug) errors.slug = "Required.";
  if (!(await isAllowedImageSrc(get("image")))) errors.image = "Choose an image.";
  if (slug && (await industrySlugTaken(slug, id))) errors.slug = "Another industry already uses this URL.";
  if (Object.keys(errors).length > 0) return { ok: false, message: "Please fix the highlighted fields.", errors };

  await saveIndustry({
    id,
    slug,
    name,
    image: get("image"),
    description: get("description"),
    roles: lines(formData.get("roles")),
    order: Number(get("order")) || 0,
    published: formData.get("published") === "on",
  });
  revalidatePath("/", "layout");
  redirect(`/admin/industries?saved=${encodeURIComponent(name)}`);
}

export async function deleteIndustryAction(id: string) {
  await requireAdmin();
  await deleteIndustry(id);
  revalidatePath("/", "layout");
  redirect("/admin/industries");
}

export async function importDefaultIndustriesAction() {
  await requireAdmin();
  const added = await importDefaultIndustries();
  revalidatePath("/", "layout");
  redirect(`/admin/industries?imported=${added}`);
}
