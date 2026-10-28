import type { Metadata } from "next";
import { getHero, heroProps } from "@/lib/heroes";
import { IndustryGrid } from "@/components/industry-grid";
import { AdvantagesSection, CenteredHeading, PhotoHero } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/employers/industries", "Industries | Bridge Careers Global", "Specialist recruitment across healthcare, technology, finance, engineering and more.");

export default async function IndustriesPage() {
  const hero = await getHero("industries");
  return (
    <>
      <PhotoHero
        {...heroProps(hero)}
        crumbs={[
          { label: "Employers", href: "/employers" },
          { label: "Industries", href: "/employers/industries" },
        ]}
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CenteredHeading
            title="Choose your industry"
            text="Find out how we support employers in your sector, the roles we fill and the jobs we currently have open."
          />
          <div className="mt-12">
            <IndustryGrid withText />
          </div>
        </div>
      </section>
      <AdvantagesSection />
    </>
  );
}
