import type { Metadata } from "next";
import { getHero, heroProps } from "@/lib/heroes";
import { getContent } from "@/lib/site-content";
import { IndustryGrid } from "@/components/industry-grid";
import {
  AdvantagesSection,
  CenteredHeading,
  PhotoHero,
  SolutionsGrid,
  SplitSection,
  StatsBar,
  TechnologySection,
} from "@/components/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/employers", "The Bridge advantage | Employer services | Bridge Careers Global", "Flexible staffing, permanent recruitment, outsourcing and training for employers.");

export default async function EmployersPage() {
  const [hero, difference] = await Promise.all([getHero("employers"), getContent("bridgeDifference")]);
  return (
    <>
      <PhotoHero
        {...heroProps(hero)}
      />

      <StatsBar />

      <SplitSection image={difference.image} title={difference.title} text={difference.text} points={difference.points} />

      <SolutionsGrid muted text="Flexible, permanent or fully outsourced: choose the support that fits your business." />

      <SplitSection
        reverse
        image="/images/open-office.jpg"
        title="How we work"
        text="Every business is different, so we offer different ways of working, from a single vacancy to an on-site team managing your entire flexible workforce."
        points={["On-site staffing teams", "Managed service and master vendor programmes", "Dedicated recruitment centres for high-volume hiring"]}
        cta={{ label: "How we work", href: "/employers/how-we-work" }}
      />

      <section className="bg-muted py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CenteredHeading
            title="Industries we serve"
            text="Specialist knowledge across the sectors that keep economies moving."
          />
          <div className="mt-12">
            <IndustryGrid />
          </div>
        </div>
      </section>

      <TechnologySection />
      <AdvantagesSection />
    </>
  );
}
