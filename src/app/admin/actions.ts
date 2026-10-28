"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticate, endSession, isLoginBlocked, requireAdmin, startSession } from "@/lib/auth";
import { DatabaseNotConfiguredError, getDb } from "@/lib/db";
import { getInboxType, isStatus, storedFiles } from "@/lib/inbox";
import { formatLocation, jobSlug, jobTypes, type Job, type JobType } from "@/lib/jobs";
import { REMOTE } from "@/lib/locations";
import { findKnownCountry } from "@/lib/locations-repo";
import { deleteJob, getJobBySlug, importSampleJobs, saveJob, slugExists, uniqueSlug } from "@/lib/jobs-repo";
import { iconNames, type IconName } from "@/lib/content";
import { deleteCv } from "@/lib/cv-storage";
import { getAllIndustries } from "@/lib/industries-repo";
import { isSafeHref, lines, slugify } from "@/lib/text";
import { heroDefs, isHeroId, resetHero, saveHero, type Hero } from "@/lib/heroes";
import { deleteSolution, importDefaultSolutions, saveSolution, solutionSlugTaken } from "@/lib/solutions-repo";
import { isAudience, textToBody } from "@/lib/articles";
import { articleSlugTaken, deleteArticle, importDefaultArticles, saveArticle } from "@/lib/articles-repo";
import { deleteImage, IMAGE_TYPES, imageUsage, listLibraryImages, isAllowedImageSrc, MAX_IMAGE_BYTES, saveImage, StorageNotConfiguredError } from "@/lib/media";
import { emailConfigured, recipients, sendEmail } from "@/lib/notify";
import { isContentKey, resetContent, saveContent } from "@/lib/site-content";

export type ActionState = { ok: boolean; message: string; errors?: Record<string, string> };

/* ---------------- Auth ---------------- */

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "Enter your email and password." };

  let admin;
  try {
    if (await isLoginBlocked(email)) {
      return { ok: false, message: "Too many failed sign-in attempts. Please wait 15 minutes and try again." };
    }
    admin = await authenticate(email, password);
  } catch (error) {
    console.error("Login failed", error);
    return {
      ok: false,
      message:
        error instanceof DatabaseNotConfiguredError
          ? "The database isn't configured (MONGODB_URI)."
          : "Couldn't sign you in right now. Please try again.",
    };
  }
  if (!admin) return { ok: false, message: "Incorrect email or password." };

  await startSession(admin);
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/* ---------------- Jobs ---------------- */

export async function saveJobAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const originalSlug = get("originalSlug") || undefined;
  const title = get("title");
  const country = (await findKnownCountry(get("country"))) ?? "";
  const city = country === REMOTE ? "" : get("city");
  // A typed slug must be free; an empty one is generated from the title and location and numbered if taken.
  const typedSlug = slugify(get("slug"));
  const slug = typedSlug || (title ? await uniqueSlug(jobSlug(title, city, country), originalSlug) : "");

  const errors: Record<string, string> = {};
  for (const k of ["title", "company", "salary", "summary"]) {
    if (!get(k)) errors[k] = "Required.";
  }
  if (!slug) errors.slug = "Required.";
  if (!jobTypes.includes(get("type") as JobType)) errors.type = "Choose a job type.";
  if (!country) errors.country = "Choose a country.";
  if (!(await getAllIndustries()).some((i) => i.slug === get("industry"))) errors.industry = "Choose an industry.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(get("posted"))) errors.posted = "Use a valid date.";
  const closes = get("closes");
  if (closes && !/^\d{4}-\d{2}-\d{2}$/.test(closes)) errors.closes = "Use a valid date.";
  else if (closes && closes < get("posted")) errors.closes = "The closing date can't be before the posted date.";
  if (typedSlug && typedSlug !== originalSlug && (await slugExists(typedSlug))) {
    errors.slug = "Another job already uses this URL. Change it, or clear it to generate one from the title and location.";
  }
  if (Object.keys(errors).length > 0) return { ok: false, message: "Please fix the highlighted fields.", errors };

  const job: Job = {
    slug,
    title,
    company: get("company"),
    location: formatLocation(city, country),
    country,
    city: city || undefined,
    type: get("type") as JobType,
    industry: get("industry"),
    salary: get("salary"),
    posted: get("posted"),
    closes: closes || undefined,
    summary: get("summary"),
    responsibilities: lines(formData.get("responsibilities")),
    requirements: lines(formData.get("requirements")),
    published: formData.get("published") === "on",
  };

  await saveJob(job, originalSlug);
  revalidatePath("/", "layout");
  redirect(`/admin/jobs?saved=${encodeURIComponent(job.title)}`);
}

export async function toggleJobPublished(slug: string) {
  await requireAdmin();
  const job = await getJobBySlug(slug);
  if (!job) return;
  await saveJob({ ...job, published: !job.published });
  revalidatePath("/", "layout");
}

export async function deleteJobAction(slug: string) {
  await requireAdmin();
  await deleteJob(slug);
  revalidatePath("/", "layout");
  redirect("/admin/jobs");
}

export async function importSampleJobsAction() {
  await requireAdmin();
  const added = await importSampleJobs();
  revalidatePath("/", "layout");
  redirect(`/admin/jobs?imported=${added}`);
}

/* ---------------- Inbox ---------------- */

export async function updateSubmissionStatus(type: string, id: string, status: string) {
  await requireAdmin();
  const inbox = getInboxType(type);
  if (!inbox || !ObjectId.isValid(id) || !isStatus(status)) return;
  const db = await getDb();
  await db
    .collection(inbox.collection)
    .updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
  revalidatePath("/admin", "layout");
}

export async function deleteSubmission(type: string, id: string) {
  await requireAdmin();
  const inbox = getInboxType(type);
  if (!inbox || !ObjectId.isValid(id)) return;
  const db = await getDb();
  const doc = await db.collection(inbox.collection).findOneAndDelete({ _id: new ObjectId(id) });
  for (const file of storedFiles(inbox, doc)) await deleteCv(file);
  revalidatePath("/admin", "layout");
  redirect(`/admin/inbox/${type}`);
}

/* ---------------- Site content ---------------- */

export async function saveContentAction(key: string, value: unknown): Promise<ActionState> {
  const session = await requireAdmin();
  if (!isContentKey(key)) return { ok: false, message: "Unknown content section." };
  try {
    await saveContent(key, value, session.email);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Couldn't save." };
  }
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved. The website has been updated." };
}

export async function resetContentAction(key: string) {
  await requireAdmin();
  if (!isContentKey(key)) return;
  await resetContent(key);
  revalidatePath("/", "layout");
  redirect(`/admin/content/${key}?reset=1`);
}

/* ---------------- Articles ---------------- */

export async function saveArticleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const get = (k: string) => String(formData.get(k) ?? "").trim();

  const audience = get("audience");
  if (!isAudience(audience)) return { ok: false, message: "Unknown article type." };
  const id = get("id") || undefined;
  const title = get("title");
  const slug = slugify(get("slug") || title);

  const errors: Record<string, string> = {};
  for (const k of ["title", "category", "excerpt"]) if (!get(k)) errors[k] = "Required.";
  if (!slug) errors.slug = "Required.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(get("date"))) errors.date = "Use a valid date.";
  if (!(await isAllowedImageSrc(get("image")))) errors.image = "Choose an image.";
  const body = textToBody(String(formData.get("body") ?? ""));
  if (body.length === 0) errors.body = "Write some content.";
  if (slug && (await articleSlugTaken(audience, slug, id))) errors.slug = "Another article already uses this URL.";
  if (Object.keys(errors).length > 0) return { ok: false, message: "Please fix the highlighted fields.", errors };

  await saveArticle({
    id,
    audience,
    slug,
    title,
    category: get("category"),
    excerpt: get("excerpt"),
    image: get("image"),
    date: get("date"),
    body,
    published: formData.get("published") === "on",
  });
  revalidatePath("/", "layout");
  redirect(`/admin/articles?audience=${audience}&saved=${encodeURIComponent(title)}`);
}

export async function deleteArticleAction(id: string, audience: string) {
  await requireAdmin();
  await deleteArticle(id);
  revalidatePath("/", "layout");
  redirect(`/admin/articles?audience=${isAudience(audience) ? audience : "jobseekers"}`);
}

export async function importDefaultArticlesAction(audience: string) {
  await requireAdmin();
  if (!isAudience(audience)) return;
  const added = await importDefaultArticles(audience);
  revalidatePath("/", "layout");
  redirect(`/admin/articles?audience=${audience}&imported=${added}`);
}

/* ---------------- Media ---------------- */

export async function uploadImageAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { ok: false, message: "Choose at least one image." };
  for (const f of files) {
    if (!IMAGE_TYPES.includes(f.type)) return { ok: false, message: `${f.name}: only JPG, PNG or WebP images are allowed.` };
    if (f.size > MAX_IMAGE_BYTES) return { ok: false, message: `${f.name}: images must be under 4 MB.` };
  }
  try {
    for (const f of files) await saveImage(f, session.email);
  } catch (error) {
    console.error("Image upload failed", error);
    return {
      ok: false,
      message: error instanceof StorageNotConfiguredError ? error.message : "Upload to Cloudflare failed. Please try again.",
    };
  }
  revalidatePath("/admin/media");
  return { ok: true, message: `Uploaded ${files.length} image${files.length === 1 ? "" : "s"}.` };
}

export async function deleteImageAction(id: string) {
  await requireAdmin();
  // Never delete an image that's still shown somewhere on the site.
  const item = (await listLibraryImages()).find((i) => i.id === id);
  if (!item || (await imageUsage())[item.src]) return;
  await deleteImage(id);
  revalidatePath("/", "layout");
}

/* ---------------- Page heroes ---------------- */

export async function saveHeroAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!isHeroId(id)) return { ok: false, message: "Unknown page." };
  const get = (k: string) => String(formData.get(k) ?? "").trim().slice(0, 2000);

  const hero: Hero = {
    image: get("image"),
    eyebrow: get("eyebrow"),
    title: get("title"),
    text: get("text"),
    ctaLabel: get("ctaLabel"),
    ctaHref: get("ctaHref"),
    secondaryLabel: get("secondaryLabel"),
    secondaryHref: get("secondaryHref"),
  };

  const errors: Record<string, string> = {};
  if (!hero.title) errors.title = "Required.";
  const needsImage = !("noImage" in heroDefs[id] && heroDefs[id].noImage);
  if (needsImage && !(await isAllowedImageSrc(hero.image))) errors.image = "Choose an image.";
  for (const [label, href] of [["ctaLabel", "ctaHref"], ["secondaryLabel", "secondaryHref"]] as const) {
    if (!!hero[label] !== !!hero[href]) errors[hero[label] ? href : label] = "Fill in both the button text and link, or leave both empty.";
    if (hero[href] && !isSafeHref(hero[href])) errors[href] = "Use a site path like /jobs or a full https:// link.";
  }
  if (Object.keys(errors).length > 0) return { ok: false, message: "Please fix the highlighted fields.", errors };

  await saveHero(id, hero, session.email);
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved. The page has been updated." };
}

export async function resetHeroAction(id: string) {
  await requireAdmin();
  if (!isHeroId(id)) return;
  await resetHero(id);
  revalidatePath("/", "layout");
  redirect(`/admin/heroes/${id}?reset=1`);
}

/* ---------------- Services (employer solutions) ---------------- */

export async function saveSolutionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const get = (k: string) => String(formData.get(k) ?? "").trim().slice(0, 4000);
  const id = get("id") || undefined;
  const title = get("title");
  const slug = slugify(get("slug") || title);
  const icon = get("icon");

  const errors: Record<string, string> = {};
  for (const k of ["title", "text", "heroTitle", "heroText", "intro"]) if (!get(k)) errors[k] = "Required.";
  if (!slug) errors.slug = "Required.";
  if (!iconNames.includes(icon as IconName)) errors.icon = "Choose an icon.";
  if (!(await isAllowedImageSrc(get("image")))) errors.image = "Choose an image.";
  if (slug && (await solutionSlugTaken(slug, id))) errors.slug = "Another service already uses this URL.";

  const features = [0, 1, 2, 3, 4, 5]
    .map((i) => ({ icon: get(`f${i}-icon`), title: get(`f${i}-title`), text: get(`f${i}-text`) }))
    .filter((f) => f.title || f.text)
    .map((f) => ({ ...f, icon: (iconNames.includes(f.icon as IconName) ? f.icon : "check") as IconName }));
  if (features.length === 0) errors.features = "Add at least one feature.";

  if (Object.keys(errors).length > 0) return { ok: false, message: "Please fix the highlighted fields.", errors };

  await saveSolution({
    id,
    slug,
    icon: icon as IconName,
    title,
    text: get("text"),
    heroTitle: get("heroTitle"),
    heroText: get("heroText"),
    image: get("image"),
    intro: get("intro"),
    features,
    useCases: lines(formData.get("useCases")),
    order: Number(get("order")) || 0,
    published: formData.get("published") === "on",
    translations: {
      fr: get("title_fr") || undefined,
      pt: get("title_pt") || undefined,
      sw: get("title_sw") || undefined,
    },
  });
  revalidatePath("/", "layout");
  redirect(`/admin/services?saved=${encodeURIComponent(title)}`);
}

export async function deleteSolutionAction(id: string) {
  await requireAdmin();
  await deleteSolution(id);
  revalidatePath("/", "layout");
  redirect("/admin/services");
}

export async function importDefaultSolutionsAction() {
  await requireAdmin();
  const added = await importDefaultSolutions();
  revalidatePath("/", "layout");
  redirect(`/admin/services?imported=${added}`);
}

/* ---------------- Notifications ---------------- */

export async function sendTestEmailAction(): Promise<ActionState> {
  const session = await requireAdmin();
  if (!(await emailConfigured())) return { ok: false, message: "SMTP isn't configured yet. Add it in Settings → Email." };
  const to = await recipients();
  if (to.length === 0) return { ok: false, message: "Add at least one recipient and save first." };
  try {
    await sendEmail(to, "Test alert – Bridge Careers Global", [
      ["Sent by", session.email],
      ["Result", "Email alerts are working."],
    ]);
    return { ok: true, message: `Test email sent to ${to.join(", ")}.` };
  } catch (error) {
    console.error("Test email failed", error);
    return { ok: false, message: `Sending failed: ${error instanceof Error ? error.message : "unknown error"}` };
  }
}
