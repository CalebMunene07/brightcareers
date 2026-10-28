"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ActionState } from "@/app/admin/actions";
import { getPublishedArticles } from "@/lib/articles-repo";
import { requireAdmin } from "@/lib/auth";
import { collections, getDb } from "@/lib/db";
import { getPublishedIndustries } from "@/lib/industries-repo";
import { getPublishedJobs } from "@/lib/jobs-repo";
import { legalSlugs } from "@/lib/legal-repo";
import { getPublishedSolutions } from "@/lib/solutions-repo";
import { invalidateTranslations, translatePending, type TranslationDoc } from "@/lib/translate";
import { activeTranslator, type TargetLocale } from "@/lib/translators";

const targets: TargetLocale[] = ["fr", "pt", "sw"];
const isTarget = (l: string): l is TargetLocale => (targets as string[]).includes(l);

export async function saveTranslationAction(locale: string, hash: string, formData: FormData) {
  await requireAdmin();
  if (!isTarget(locale) || !/^[a-f0-9]{40}$/.test(hash)) return;
  const text = String(formData.get("text") ?? "").trim().slice(0, 10_000);
  await (await getDb())
    .collection<TranslationDoc>(collections.translations)
    .updateOne({ locale, hash }, { $set: { text, status: text ? "reviewed" : "pending", updatedAt: new Date() } });
  invalidateTranslations(locale);
  revalidatePath("/", "layout");
}

export async function approveAllMachineAction(locale: string) {
  await requireAdmin();
  if (!isTarget(locale)) return;
  await (await getDb())
    .collection<TranslationDoc>(collections.translations)
    .updateMany({ locale, status: "machine" }, { $set: { status: "reviewed", updatedAt: new Date() } });
  invalidateTranslations(locale);
  revalidatePath("/admin/translations");
}

export async function translatePendingAction(locale: string): Promise<ActionState> {
  await requireAdmin();
  if (!isTarget(locale)) return { ok: false, message: "Unknown language." };
  const translator = await activeTranslator();
  if (!translator) return { ok: false, message: "No translation service is configured. Translate entries by hand, or add a translator key." };
  try {
    const n = await translatePending(locale, 5000);
    revalidatePath("/", "layout");
    return { ok: true, message: n ? `Translated ${n} entr${n === 1 ? "y" : "ies"} with ${translator.name}.` : "Nothing was waiting to be translated." };
  } catch (error) {
    console.error("[i18n] translatePending failed", error);
    return { ok: false, message: `${translator.name} returned an error: ${error instanceof Error ? error.message.slice(0, 200) : "unknown"}` };
  }
}

/** Every public URL, so a scan can queue all of the site's text for translation. */
async function publicPaths() {
  const [jobs, solutions, industries, insights, resources] = await Promise.all([
    getPublishedJobs(),
    getPublishedSolutions(),
    getPublishedIndustries(),
    getPublishedArticles("jobseekers"),
    getPublishedArticles("employers"),
  ]);
  return [
    "/", "/jobs", "/working-with-bridge", "/jobs-for-refugees", "/cv-maker", "/cv-maker/builder", "/faq",
    "/employers", "/employers/how-we-work", "/employers/solutions", "/employers/industries", "/employers/who-we-are",
    "/employers/resources", "/employers/faq", "/employers/request-staff", "/contact-us", "/diversity-and-inclusion",
    ...legalSlugs.map((s) => `/${s}`),
    ...jobs.map((j) => `/jobs/${j.slug}`),
    ...solutions.map((s) => `/employers/solutions/${s.slug}`),
    ...industries.map((i) => `/employers/industries/${i.slug}`),
    ...insights.map((a) => `/insights/${a.slug}`),
    ...resources.map((a) => `/employers/resources/${a.slug}`),
  ];
}

export async function scanSiteAction(locale: string): Promise<ActionState> {
  await requireAdmin();
  if (!isTarget(locale)) return { ok: false, message: "Unknown language." };
  const h = await headers();
  const host = h.get("host");
  if (!host) return { ok: false, message: "Couldn't work out the site address." };
  const origin = `${h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")}://${host}`;

  const col = (await getDb()).collection(collections.translations);
  const before = await col.countDocuments({ locale });
  const paths = await publicPaths();
  let failed = 0;
  // Visiting each page in the target language queues any text that isn't translated yet.
  for (let i = 0; i < paths.length; i += 5) {
    const results = await Promise.allSettled(
      paths.slice(i, i + 5).map((p) => fetch(origin + p, { headers: { cookie: `locale=${locale}` }, cache: "no-store" })),
    );
    failed += results.filter((r) => r.status === "rejected" || !r.value.ok).length;
  }
  await new Promise((r) => setTimeout(r, 1500)); // let the queued writes finish
  const added = (await col.countDocuments({ locale })) - before;
  revalidatePath("/admin/translations");
  return {
    ok: failed === 0,
    message: `Scanned ${paths.length} pages${failed ? ` (${failed} failed)` : ""}. ${added} new text${added === 1 ? "" : "s"} queued.${
      (await activeTranslator()) ? " Machine translation runs in the background — refresh in a minute." : ""
    }`,
  };
}
