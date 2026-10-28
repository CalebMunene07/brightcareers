import type { Metadata } from "next";
import Link from "next/link";
import { JobCard } from "@/components/job-card";
import { PageHero } from "@/components/page-hero";
import { getPublishedIndustries } from "@/lib/industries-repo";
import { jobTypes, searchJobs } from "@/lib/jobs";
import { getPublishedJobs } from "@/lib/jobs-repo";
import { getT } from "@/lib/translate";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/jobs", "Find a job | Bridge Careers Global", "Search permanent, temporary and contract jobs across industries and countries.");

function param(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default async function JobsPage({ searchParams }: PageProps<"/jobs">) {
  const sp = await searchParams;
  const filters = {
    q: param(sp.q),
    location: param(sp.location),
    type: param(sp.type),
    industry: param(sp.industry),
  };
  const [jobs, industries, t] = await Promise.all([getPublishedJobs(), getPublishedIndustries(), getT()]);
  const results = searchJobs(jobs, filters);
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <>
      <PageHero
        eyebrow="Find a job"
        title={filters.location ? `Jobs in ${filters.location}` : "Your next opportunity starts here"}
        text="Browse permanent, temporary and contract roles from employers we know and trust."
        crumbs={[{ label: "Jobs", href: "/jobs" }]}
      >
        <Link
          href="/#locations"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm font-semibold hover:bg-white/10"
        >
          {t(filters.location ? "Change location" : "Browse by country")}
        </Link>
      </PageHero>

      <section id="results" className="scroll-mt-28 bg-muted py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
          <aside>
            <form method="get" className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 lg:sticky lg:top-24">
              <h2 className="font-semibold text-brand-dark">{t("Filter jobs")}</h2>
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="q" className="text-sm font-medium text-slate-700">{t("Keyword")}</label>
                  <input id="q" name="q" defaultValue={filters.q} placeholder={t("e.g. nurse")} className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="location" className="text-sm font-medium text-slate-700">{t("Location")}</label>
                  <input id="location" name="location" defaultValue={filters.location} placeholder={t("City or country")} className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="type" className="text-sm font-medium text-slate-700">{t("Job type")}</label>
                  <select id="type" name="type" defaultValue={filters.type ?? ""} className={fieldClass}>
                    <option value="">{t("All types")}</option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>{t(type)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="industry" className="text-sm font-medium text-slate-700">{t("Industry")}</label>
                  <select id="industry" name="industry" defaultValue={filters.industry ?? ""} className={fieldClass}>
                    <option value="">{t("All industries")}</option>
                    {industries.map((i) => (
                      <option key={i.slug} value={i.slug}>{t(i.name)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="mt-6 w-full rounded-full bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
                {t("Apply filters")}
              </button>
              {hasFilters && (
                <Link href="/jobs" className="mt-3 block text-center text-sm font-medium text-slate-600 hover:text-brand">
                  {t("Clear all")}
                </Link>
              )}
            </form>
          </aside>

          <div>
            <p className="text-sm text-slate-600" aria-live="polite">
              {t(results.length === 1 ? "{n} job found" : "{n} jobs found", { n: results.length })}
            </p>

            {results.length > 0 ? (
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {results.map((job) => (
                  <JobCard key={job.slug} job={job} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-white p-10 text-center ring-1 ring-slate-200">
                <p className="text-lg font-semibold text-brand-dark">{t("No jobs match your search")}</p>
                <p className="mt-2 text-slate-600">
                  {t("Try fewer filters, or send us your CV and we'll tell you about new roles.")}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link href="/jobs" className="rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand">
                    {t("See all jobs")}
                  </Link>
                  <Link href="/cv-maker" className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white">
                    {t("Create your CV")}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
