import Link from "next/link";
import { getPublishedJobs } from "@/lib/jobs-repo";
import { jobCountry, type Job } from "@/lib/jobs";
import { getRegions } from "@/lib/locations-repo";
import { getT } from "@/lib/translate";

function countJobs(jobs: Job[], country: string) {
  return jobs.filter((job) => jobCountry(job) === country).length;
}

const defaults = {
  jobs: {
    title: "Find your next role",
    text: "Choose where you'd like to work. We recruit for permanent, temporary and contract roles across many countries, so whether you want to stay close to home or take your career abroad, start by picking a location below.",
  },
  contact: {
    title: "Contact your local team",
    text: "Choose your country and we'll make sure your message reaches the right team.",
  },
};

export async function LocationPicker({
  mode = "jobs",
  title,
  text,
}: {
  mode?: "jobs" | "contact";
  title?: string;
  text?: string;
}) {
  const [jobs, regions, t] = await Promise.all([getPublishedJobs(), getRegions(), getT()]);
  const remote = jobs.filter((job) => jobCountry(job) === "Remote").length;
  const heading = title ?? defaults[mode].title;
  const intro = text ?? defaults[mode].text;

  function href(country: string) {
    const c = encodeURIComponent(country);
    return mode === "jobs" ? `/jobs?location=${c}#results` : `/contact-us?country=${c}#form`;
  }

  return (
    <section id="locations" className="relative scroll-mt-28 overflow-hidden bg-white py-16 sm:py-20">
      {/* subtle dotted backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-brand-dark sm:text-5xl">{t(heading)}</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">{t(intro)}</p>
          {mode === "jobs" && remote > 0 && (
            <Link
              href="/jobs?location=Remote"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/20"
            >
              {t("Prefer to work from anywhere? See remote jobs ({count})", { count: remote })}
            </Link>
          )}
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((region) => (
            <details key={region.name} className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 border-b-2 border-brand-dark pb-3 text-2xl font-bold text-brand-dark [&::-webkit-details-marker]:hidden">
                {t(region.name)}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <ul className="mt-5 space-y-3 pl-4">
                {region.countries.map((country) => {
                  const count = mode === "jobs" ? countJobs(jobs, country) : 0;
                  return (
                    <li key={country}>
                      <Link
                        href={href(country)}
                        className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-dark hover:underline"
                      >
                        {t(country)}
                        {count > 0 && (
                          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[11px] font-semibold text-brand-dark no-underline">
                            {count}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
