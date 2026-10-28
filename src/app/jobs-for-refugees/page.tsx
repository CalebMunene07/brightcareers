import type { Metadata } from "next";
import { getHero, heroProps } from "@/lib/heroes";
import { getContent } from "@/lib/site-content";
import { getT } from "@/lib/translate";
import {
  Accordion,
  CenteredHeading,
  CtaBanner,
  FeatureGrid,
  IconSteps,
  PhotoHero,
  SplitSection,
} from "@/components/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/jobs-for-refugees", "Jobs for refugees | Bridge Careers Global", "Support for refugees and displaced people looking for work: free advice, training and job matching.");

export default async function JobsForRefugeesPage() {
  const t = await getT();
  const [hero, faqs, help, steps] = await Promise.all([
    getHero("jobs-for-refugees"),
    getContent("refugeeFaq"),
    getContent("refugeeHelp"),
    getContent("refugeeSteps"),
  ]);
  return (
    <>
      <PhotoHero
        {...heroProps(hero)}
        crumbs={[{ label: "Jobs for refugees", href: "/jobs-for-refugees" }]}
      />

      <FeatureGrid
        title="How we can help"
        text="Practical support that fits your situation, from your first conversation to your first payslip."
        items={help}
      />

      <IconSteps
        muted
        title="Getting started"
        numbered
        steps={steps}
      />

      <SplitSection
        image="/images/coworkers.jpg"
        title="Fair, safe work"
        text="Everyone deserves to be treated fairly at work. When you work through Bridge you can expect:"
        points={[
          "A written contract you understand before you start",
          "Pay that is at least the legal minimum, paid on time",
          "Safe working conditions and the right protective equipment",
          "Someone to contact if something goes wrong",
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <CenteredHeading title="Common questions" />
          <div className="mt-10">
            <Accordion items={faqs.map((f) => ({ title: f.q, content: <p>{t(f.a)}</p> }))} />
          </div>
        </div>
      </section>

      <CtaBanner
        title="Are you an employer?"
        text="Refugees bring skills, resilience and new perspectives. We can help you build an inclusive hiring programme."
        cta={{ label: "Hire refugee talent", href: "/employers/solutions/diversity-and-inclusion" }}
      />
    </>
  );
}
