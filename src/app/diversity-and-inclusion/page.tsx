import type { Metadata } from "next";
import { getHero, heroProps } from "@/lib/heroes";
import { CtaBanner, FeatureGrid, PhotoHero, SplitSection } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/diversity-and-inclusion", "Diversity and inclusion | Bridge Careers Global", "Our commitment to fair, inclusive recruitment for candidates and clients.");

export default async function DiversityPage() {
  const hero = await getHero("diversity-and-inclusion");
  return (
    <>
      <PhotoHero
        {...heroProps(hero)}
        crumbs={[{ label: "Diversity and inclusion", href: "/diversity-and-inclusion" }]}
      />

      <SplitSection
        image="/images/team-laptop.jpg"
        title="Our commitment"
        text="We believe everyone should be judged on their skills and potential. That principle shapes how we advertise roles, assess candidates and advise the employers we work with."
        points={[
          "Every candidate is assessed against the same clear criteria",
          "We make reasonable adjustments at every stage of the process",
          "We challenge discriminatory requests from clients",
          "Our own teams reflect the communities we serve",
        ]}
      />

      <FeatureGrid
        muted
        title="How we put it into practice"
        items={[
          { icon: "search", title: "Inclusive sourcing", text: "We advertise widely and partner with community organisations to reach under-represented talent." },
          { icon: "check", title: "Fair assessment", text: "Structured interviews and skills-based screening reduce bias in decisions." },
          { icon: "academic", title: "Access to training", text: "Bridge Academy helps people build the skills and certifications to compete for new roles." },
          { icon: "heart", title: "Ongoing support", text: "We stay in touch after placement to help every new starter settle in and succeed." },
        ]}
      />

      <CtaBanner
        title="Want to build a more diverse team?"
        text="Our diversity and inclusion solutions help employers widen their talent pool and hire fairly."
        cta={{ label: "Explore D&I solutions", href: "/employers/solutions/diversity-and-inclusion" }}
      />
    </>
  );
}
