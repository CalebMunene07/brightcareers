import type { Metadata } from "next";
import { getHero, heroProps } from "@/lib/heroes";
import { AdvantagesSection, PhotoHero, SolutionsGrid, TechnologySection } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/employers/solutions", "Recruitment & HR solutions | Bridge Careers Global", "Flexible staffing, permanent recruitment, outsourcing, training and diversity solutions.");

export default async function SolutionsPage() {
  const hero = await getHero("solutions");
  return (
    <>
      <PhotoHero
        {...heroProps(hero)}
        crumbs={[
          { label: "Employers", href: "/employers" },
          { label: "Solutions", href: "/employers/solutions" },
        ]}
      />
      <SolutionsGrid title="Explore our solutions" />
      <TechnologySection muted />
      <AdvantagesSection />
    </>
  );
}
