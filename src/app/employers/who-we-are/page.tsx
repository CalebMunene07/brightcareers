import type { Metadata } from "next";
import { getHero, heroProps } from "@/lib/heroes";
import Link from "next/link";
import { ArrowRight } from "@/components/icon";
import { AdvantagesSection, CenteredHeading, PhotoHero, StatsBar, TechnologySection } from "@/components/sections";
import { getContent } from "@/lib/site-content";
import { getT } from "@/lib/translate";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/employers/who-we-are", "Who we are | Bridge Careers Global", "Our story, our divisions and what drives us.");

export default async function WhoWeArePage() {
  const hero = await getHero("who-we-are");
  const [milestones, divisions, t] = await Promise.all([getContent("milestones"), getContent("divisions"), getT()]);
  return (
    <>
      <PhotoHero
        {...heroProps(hero)}
        crumbs={[
          { label: "Employers", href: "/employers" },
          { label: "Who we are", href: "/employers/who-we-are" },
        ]}
      />

      <StatsBar />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <CenteredHeading title="Our story" text="How a simple belief in personal recruitment grew into an international business." />
          <ol className="relative mt-14 space-y-10 border-l-2 border-brand/20 pl-8 sm:pl-10">
            {milestones.map((m) => (
              <li key={m.period} className="relative">
                <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-white bg-brand ring-2 ring-brand/30 sm:-left-[49px]" aria-hidden="true" />
                <h3 className="text-xl font-bold text-brand-dark">{t(m.period)}</h3>
                <p className="mt-2 max-w-2xl leading-relaxed text-slate-600">{t(m.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-muted py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CenteredHeading title="The Bridge group" text="Three specialist divisions, one shared commitment to people." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {divisions.map((d, i) => (
              <Link
                key={d.name}
                href={d.href}
                className="group flex flex-col rounded-2xl bg-white p-8 ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white ${["bg-brand", "bg-accent", "bg-brand-dark"][i]}`}>
                  {d.name.split(" ")[1][0]}
                </span>
                <h3 className="mt-5 text-xl font-bold text-brand-dark">{t(d.name)}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{t(d.text)}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand">
                  {t("Learn more")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TechnologySection />
      <AdvantagesSection />
    </>
  );
}
