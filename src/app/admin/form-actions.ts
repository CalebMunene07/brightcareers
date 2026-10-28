"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { customFormSlugTaken, deleteCustomForm, getCustomFormById, saveCustomForm, type CustomForm } from "@/lib/custom-forms-repo";
import { CUSTOM_KEY, customFieldTypes, getFormDef, type CustomField, type FormSettings } from "@/lib/forms";
import { saveFormSettings } from "@/lib/forms-repo";
import type { Fee, PaymentMethod, Pricing, RouteFees } from "@/lib/pricing";
import { savePricing } from "@/lib/pricing-repo";
import { slugify } from "@/lib/text";

const MAX_FIELDS = 40;

function json(formData: FormData, key: string): unknown {
  try {
    return JSON.parse(String(formData.get(key) ?? ""));
  } catch {
    return null;
  }
}

const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

/** Checks custom fields sent by the editor. Returns the cleaned list or an error message. */
function cleanFields(raw: unknown, sections: string[] | null): CustomField[] | string {
  if (!Array.isArray(raw)) return "Couldn't read the fields. Reload the page and try again.";
  if (raw.length > MAX_FIELDS) return `A form can have at most ${MAX_FIELDS} custom fields.`;
  const keys = new Set<string>();
  const fields: CustomField[] = [];
  for (const r of raw as Record<string, unknown>[]) {
    const key = str(r?.key, 40);
    const label = str(r?.label, 120);
    const type = customFieldTypes.find((t) => t.id === r?.type)?.id;
    if (!CUSTOM_KEY.test(key) || keys.has(key)) return "Couldn't read the fields. Reload the page and try again.";
    keys.add(key);
    if (!label) return "Every field needs a label.";
    if (!type) return `Choose a type for “${label}”.`;
    const options = Array.isArray(r.options) ? [...new Set(r.options.map((o) => str(o, 120)).filter(Boolean))] : [];
    if (type === "select" && options.length < 2) return `Give the dropdown “${label}” at least two choices.`;
    const section = str(r.section, 40);
    if (sections && !sections.includes(section)) return `Choose where “${label}” goes.`;
    fields.push({
      key,
      label,
      type,
      required: type !== "section" && r.required === true,
      options: type === "select" ? options : [],
      hint: str(r.hint, 200),
      section: sections ? section : "",
    });
  }
  return fields;
}

/* ---------------- Built-in forms ---------------- */

export async function saveFormSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const def = getFormDef(String(formData.get("form") ?? ""));
  if (!def) return { ok: false, message: "Unknown form." };

  const raw = json(formData, "settings") as { fields?: Record<string, { hidden?: unknown; required?: unknown }>; custom?: unknown } | null;
  if (!raw) return { ok: false, message: "Couldn't read the settings. Reload the page and try again." };

  // Only keep changes to known fields that differ from the default. Core fields can't be removed.
  const fields: FormSettings["fields"] = {};
  for (const f of def.fields) {
    const s = raw.fields?.[f.key];
    const hidden = !f.core && s?.hidden === true;
    const required = s?.required === true;
    if (hidden || required !== f.required) fields[f.key] = { ...(hidden ? { hidden } : {}), ...(required !== f.required ? { required } : {}) };
  }
  const custom = cleanFields(raw.custom, def.sections ? def.sections.map((s) => s.id) : null);
  if (typeof custom === "string") return { ok: false, message: custom };

  await saveFormSettings(def.id, { fields, custom }, session.email);
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved. The form on the site now uses these fields." };
}

/* ---------------- Forms created by admins ---------------- */

export async function saveCustomFormAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const raw = json(formData, "form") as Record<string, unknown> | null;
  if (!raw) return { ok: false, message: "Couldn't read the form. Reload the page and try again." };

  const id = str(raw.id, 40) || undefined;
  if (id && !(await getCustomFormById(id))) return { ok: false, message: "This form no longer exists." };
  const errors: Record<string, string> = {};
  const title = str(raw.title, 120);
  if (!title) errors.title = "Required.";
  const slug = slugify(str(raw.slug, 80)) || slugify(title);
  if (!slug) errors.slug = "Required.";
  else if (await customFormSlugTaken(slug, id)) errors.slug = "Another form already uses this address.";

  const fees = [];
  for (const f of Array.isArray(raw.fees) ? (raw.fees as Record<string, unknown>[]) : []) {
    const label = str(f?.label, 120);
    const amount = Number(f?.amount);
    if (!label && !String(f?.amount ?? "").trim()) continue; // empty row
    if (!label) {
      errors.fees = "Every fee needs a name.";
      break;
    }
    if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000) {
      errors.fees = `Enter an amount in USD for “${label}”.`;
      break;
    }
    fees.push({ label, amount: Math.round(amount * 100) / 100 });
  }

  const fields = cleanFields(raw.fields, null);
  if (typeof fields === "string") errors.fields = fields;
  if (Object.keys(errors).length > 0 || typeof fields === "string") {
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  const form: CustomForm = {
    id,
    slug,
    title,
    intro: str(raw.intro, 1000),
    published: raw.published === true,
    fields,
    nameRequired: raw.nameRequired !== false,
    emailRequired: raw.emailRequired !== false,
    fees,
    askPayment: raw.askPayment === true,
    paymentInstructions: str(raw.paymentInstructions, 2000),
    success: str(raw.success, 500),
    order: Number.isFinite(Number(raw.order)) ? Number(raw.order) : 0,
  };
  const savedId = await saveCustomForm(form, session.email);
  revalidatePath("/", "layout");
  if (!id) redirect(`/admin/forms/${savedId}?created=1`);
  return { ok: true, message: form.published ? "Saved. The form is live." : "Saved as a draft. Tick “Published” to put it on the site." };
}

/* ---------------- Pricing & payment ---------------- */

function amount(v: unknown) {
  const n = Number(v);
  return String(v ?? "").trim() !== "" && Number.isFinite(n) && n >= 0 && n <= 1_000_000 ? Math.round(n * 100) / 100 : null;
}

export async function savePricingAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const raw = json(formData, "pricing") as Record<string, unknown> | null;
  if (!raw) return { ok: false, message: "Couldn't read the prices. Reload the page and try again." };
  const errors: Record<string, string> = {};

  const visaFees: Fee[] = [];
  for (const f of Array.isArray(raw.visaFees) ? (raw.visaFees as Record<string, unknown>[]) : []) {
    const label = str(f?.label, 120);
    if (!label && !String(f?.amount ?? "").trim()) continue;
    const value = amount(f?.amount);
    if (!label || value === null) {
      errors.visaFees = "Every fee needs a name and an amount in USD.";
      break;
    }
    visaFees.push({ label, amount: value });
  }

  const r = (raw.routeFees ?? {}) as Record<string, unknown>;
  const tiers = { sameCountry: amount(r.sameCountry), sameContinent: amount(r.sameContinent), europeNorthAmerica: amount(r.europeNorthAmerica), other: amount(r.other) };
  if (Object.values(tiers).some((v) => v === null)) errors.routeFees = "Enter an amount in USD for every route type.";

  const cvDownloadFee = amount(raw.cvDownloadFee);
  if (cvDownloadFee === null) errors.cvDownloadFee = "Enter an amount in USD.";

  const paymentMethods: PaymentMethod[] = [];
  const ids = new Set<string>();
  for (const m of Array.isArray(raw.paymentMethods) ? (raw.paymentMethods as Record<string, unknown>[]) : []) {
    const label = str(m?.label, 60);
    if (!label) continue;
    // Keep the stored id so past submissions still match; new methods use their name.
    let id = str(m?.id, 60) || label;
    while (ids.has(id)) id += "-2";
    ids.add(id);
    paymentMethods.push({ id, label, note: str(m?.note, 60), mark: str(m?.mark, 30) });
  }
  if (paymentMethods.length === 0) errors.paymentMethods = "Keep at least one payment method.";

  if (Object.keys(errors).length > 0) return { ok: false, message: "Please fix the highlighted fields.", errors };

  const pricing: Pricing = {
    visaFees,
    routeFees: tiers as RouteFees,
    processingTime: str(raw.processingTime, 80),
    cvDownloadFee: cvDownloadFee!,
    paymentMethods,
    paymentInstructions: str(raw.paymentInstructions, 2000),
  };
  await savePricing(pricing, session.email);
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved. New prices show on the site straight away." };
}

export async function deleteCustomFormAction(id: string) {
  await requireAdmin();
  await deleteCustomForm(id);
  revalidatePath("/", "layout");
  redirect("/admin/forms");
}
