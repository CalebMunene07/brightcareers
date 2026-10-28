import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { submitApplication } from "@/app/actions";
import { TForm } from "@/components/t-form";
import { getFormLayout } from "@/lib/forms-repo";
import { JobCard } from "@/components/job-card";
import { PageHero } from "@/components/page-hero";
import { daysUntilClose, formatPosted, isOpen, type Job } from "@/lib/jobs";
import { industryName } from "@/lib/industries-repo";
import { getJobForPage, getPublishedJobs } from "@/lib/jobs-repo";
import { getLocale, getT } from "@/lib/translate";
import { jsonLd, pageMetadata, SITE_NAME, siteUrl } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/jobs/[slug]">): Promise<Metadata> {
  const job = await getJobForPage((await params).slug);
  if (!job) return {};
  return pageMetadata(`/jobs/${job.slug}`, `${job.title} in ${job.location} | Bridge Careers Global`, job.summary);
}

const employmentTypes: Record<string, string> = { Permanent: "FULL_TIME", Temporary: "TEMPORARY", Contract: "CONTRACTOR" };

/** schema.org JobPosting, so open roles can appear in Google's job search. Left out once a job has closed. */
async function jobPostingData(job: Job) {
  const url = await siteUrl();
  const list = (items: string[]) => `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
  const remote = job.country === "Remote" || /\bremote\b/i.test(job.location);
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `<p>${escapeHtml(job.summary)}</p><h3>Responsibilities</h3>${list(job.responsibilities)}<h3>Requirements</h3>${list(job.requirements)}`,
    datePosted: job.posted,
    ...(job.closes ? { validThrough: `${job.closes}T23:59:59` } : {}),
    employmentType: employmentTypes[job.type] ?? "OTHER",
    hiringOrganization: { "@type": "Organization", name: job.company || SITE_NAME },
    ...(remote
      ? { jobLocationType: "TELECOMMUTE" }
      : {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: job.city || job.location,
              ...(job.country ? { addressCountry: job.country } : {}),
            },
          },
        }),
    directApply: true,
    url: `${url}/jobs/${job.slug}`,
  };
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default async function JobPage({ params }: PageProps<"/jobs/[slug]">) {
  const job = await getJobForPage((await params).slug);
  if (!job) notFound();
  const open = isOpen(job);
  const days = daysUntilClose(job);
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const date = (iso: string) => formatPosted(iso, locale);

  const related = (await getPublishedJobs()).filter((j) => j.industry === job.industry && j.slug !== job.slug).slice(0, 2);

  const details = [
    { label: t("Location"), value: t(job.location) },
    { label: t("Job type"), value: t(job.type) },
    { label: t("Salary"), value: t(job.salary) },
    { label: t("Industry"), value: t(await industryName(job.industry)) },
    { label: t("Posted"), value: date(job.posted) },
    ...(job.closes ? [{ label: t(open ? "Closes" : "Closed"), value: date(job.closes) }] : []),
  ];

  return (
    <>
      {open && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(await jobPostingData(job))} />}
      <PageHero
        eyebrow={job.company}
        title={job.title}
        text={job.summary}
        crumbs={[
          { label: "Jobs", href: "/jobs" },
          { label: job.title, href: `/jobs/${job.slug}` },
        ]}
      >
        {open ? (
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#apply" className="inline-flex rounded-full bg-accent px-6 py-3 font-semibold text-brand-dark hover:opacity-90">
              {t("Apply now")}
            </a>
            {days !== null && days <= 7 && (
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">
                {days === 0 ? t("Closes today") : t(days === 1 ? "Closes in {n} day" : "Closes in {n} days", { n: days })}
              </span>
            )}
          </div>
        ) : (
          <p className="mt-8 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
            {t("Applications for this job have closed")}
          </p>
        )}
      </PageHero>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-brand-dark">{t("What you'll do")}</h2>
              <ul className="mt-4 space-y-2.5">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex gap-3 text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    {t(r)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-dark">{t("What you'll need")}</h2>
              <ul className="mt-4 space-y-2.5">
                {job.requirements.map((r) => (
                  <li key={r} className="flex gap-3 text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {t(r)}
                  </li>
                ))}
              </ul>
            </div>

            {open ? (
              <div id="apply" className="scroll-mt-24 rounded-2xl bg-muted p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-brand-dark">{t("Apply for this job")}</h2>
                <p className="mt-2 text-slate-600">{t("It only takes a couple of minutes.")}</p>
                <div className="mt-6">
                  <TForm
                    action={submitApplication}
                    layout={await getFormLayout("application")}
                    submitLabel="Submit application"
                    hidden={{ job: job.slug }}
                    fields={[
                      { name: "name", label: "Full name", required: true },
                      { name: "email", label: "Email", type: "email", required: true },
                      { name: "phone", label: "Phone", type: "tel", required: true },
                      { name: "location", label: "Current location" },
                      {
                        name: "cv",
                        label: "CV (PDF or Word, max 4 MB)",
                        type: "file",
                        required: true,
                        accept: ".pdf,.doc,.docx",
                        full: true,
                      },
                      { name: "message", label: "Cover note", type: "textarea" },
                    ]}
                  />
                </div>
              </div>
            ) : (
              <div id="apply" className="scroll-mt-24 rounded-2xl bg-muted p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-brand-dark">{t("This job has closed")}</h2>
                <p className="mt-2 text-slate-600">
                  {t("Applications closed on {date}. Take a look at similar roles below, or", { date: date(job.closes!) })}{" "}
                  <Link href="/jobs" className="font-semibold text-brand hover:underline">{t("browse all open jobs")}</Link>.
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <dl className="divide-y divide-slate-200 rounded-2xl ring-1 ring-slate-200">
              {details.map((d) => (
                <div key={d.label} className="flex justify-between gap-4 px-5 py-3.5 text-sm">
                  <dt className="text-slate-500">{d.label}</dt>
                  <dd className="text-right font-medium text-slate-900">{d.value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/jobs" className="block text-sm font-semibold text-brand hover:underline">
              ← {t("Back to all jobs")}
            </Link>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-muted py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-brand-dark">{t("Similar jobs")}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {related.map((j) => (
                <JobCard key={j.slug} job={j} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
