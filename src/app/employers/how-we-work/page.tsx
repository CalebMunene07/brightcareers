import type { Metadata } from "next";
import { getHero, heroProps } from "@/lib/heroes";
import {
  AdvantagesSection,
  CenteredHeading,
  PhotoHero,
  SolutionsGrid,
  SplitSection,
  TechnologySection,
} from "@/components/sections";
import { getContent } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/employers/how-we-work", "How we work | Bridge Careers Global", "On-site teams, managed service programmes, recruitment centres and more.");

export default async function HowWeWorkPage() {
  const [hero, workModels] = await Promise.all([getHero("how-we-work"), getContent("workModels")]);
  return (
    <>
      <PhotoHero
        {...heroProps(hero)}
        crumbs={[
          { label: "Employers", href: "/employers" },
          { label: "How we work", href: "/employers/how-we-work" },
        ]}
      />

      <section className="bg-white pt-16 sm:pt-20">
        <CenteredHeading
          title="Ways we can work together"
          text="Choose the delivery model that matches the size and shape of your workforce. Many clients combine more than one."
        />
      </section>

      {workModels.map((model, i) => (
        <SplitSection
          key={model.title}
          reverse={i % 2 === 1}
          muted={i % 2 === 1}
          image={model.image}
          title={model.title}
          text={model.text}
          points={model.points}
          cta={model.href ? { label: "More information", href: model.href } : undefined}
        />
      ))}

      <TechnologySection muted />
      <SolutionsGrid />
      <AdvantagesSection />
    </>
  );
}
