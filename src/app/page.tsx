import type { Metadata } from "next";
import Image from "@/components/site-image";
import Link from "next/link";
import { ArrowRight } from "@/components/icon";
import { InsightsSection } from "@/components/insights-section";
import { LocationPicker } from "@/components/location-picker";
import { getHero } from "@/lib/heroes";
import { jsonLd, pageMetadata, SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/seo";
import { getContent } from "@/lib/site-content";
import { getT } from "@/lib/translate";

async function Hero() {
  const [hero, t] = await Promise.all([getHero("home"), getT()]);
  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, var(--accent) 0, transparent 35%), radial-gradient(circle at 10% 90%, color-mix(in srgb, var(--brand) 60%, #ffffff) 0, transparent 40%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t(hero.eyebrow)}</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {t(hero.title)}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-200">
          {t(hero.text)}
        </p>

        <form
          action="/jobs"
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 text-left shadow-xl sm:flex-row"
        >
          <label htmlFor="q" className="sr-only">{t("Job title or keyword")}</label>
          <input
            id="q"
            name="q"
            placeholder={t("Job title or keyword")}
            className="min-w-0 flex-1 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <label htmlFor="loc" className="sr-only">{t("Location")}</label>
          <input
            id="loc"
            name="location"
            placeholder={t("Country or city")}
            className="min-w-0 flex-1 rounded-xl border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none sm:border-l"
          />
          <button
            type="submit"
            className="rounded-xl bg-accent px-6 py-3 font-semibold text-brand-dark transition-opacity hover:opacity-90"
          >
            {t("Search jobs")}
          </button>
        </form>

        <a href="#locations" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:text-accent">
          {t("Or browse jobs by country")} <ArrowRight />
        </a>
      </div>
    </section>
  );
}

async function WorkingWithBridge() {
  const [stats, t] = await Promise.all([getContent("stats"), getT()]);
  return (
    <section className="relative isolate overflow-hidden bg-brand-dark text-white">
      <Image src="/images/team-laptop.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-brand/40" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("Working with Bridge")}</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-100">
            {t("Our service is free for job seekers. A dedicated consultant helps you sharpen your CV, prepares you for interviews and stays in touch after you start, so you're never navigating your job search alone.")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/working-with-bridge"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-brand-dark hover:opacity-90"
            >
              {t("How it works")} <ArrowRight />
            </Link>
            <Link
              href="/cv-maker"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white/10"
            >
              {t("Build your CV")}
            </Link>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <dt className="sr-only">{t(s.label)}</dt>
              <dd>
                <span className="block text-3xl font-bold text-accent sm:text-4xl">{s.value}</span>
                <span className="mt-2 block text-sm text-slate-100">{t(s.label)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export const metadata: Metadata = pageMetadata("/", `${SITE_NAME} | Recruitment & Staffing`, SITE_DESCRIPTION);

// Tells search engines who runs the site, for the knowledge panel and site name in results.
async function OrganizationData() {
  const url = await siteUrl();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "EmploymentAgency",
            "@id": `${url}/#organization`,
            name: SITE_NAME,
            url,
            logo: `${url}/images/logo.png`,
            image: `${url}/images/og-image.png`,
            description: SITE_DESCRIPTION,
          },
          { "@type": "WebSite", "@id": `${url}/#website`, name: SITE_NAME, url, publisher: { "@id": `${url}/#organization` } },
        ],
      })}
    />
  );
}

export default function Home() {
  return (
    <>
      <OrganizationData />
      <Hero />
      <WorkingWithBridge />
      <LocationPicker />
      <InsightsSection />
    </>
  );
}
