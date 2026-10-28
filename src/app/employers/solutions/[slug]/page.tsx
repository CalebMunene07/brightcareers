import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import {
  AdvantagesSection,
  CenteredHeading,
  CtaBanner,
  FeatureGrid,
  IconSteps,
  PhotoHero,
  SolutionsGrid,
  TechnologySection,
} from "@/components/sections";
import { getContent } from "@/lib/site-content";
import { getPublishedSolution } from "@/lib/solutions-repo";
import { getT } from "@/lib/translate";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/employers/solutions/[slug]">): Promise<Metadata> {
  const solution = await getPublishedSolution((await params).slug);
  if (!solution) return {};
  return pageMetadata(`/employers/solutions/${solution.slug}`, `${solution.heroTitle} | Bridge Careers Global`, solution.text);
}

export default async function SolutionPage({ params }: PageProps<"/employers/solutions/[slug]">) {
  const solution = await getPublishedSolution((await params).slug);
  if (!solution) notFound();
  const [hiringSteps, whyBridge, t] = await Promise.all([getContent("hiringSteps"), getContent("whyBridge"), getT()]);

  return (
    <>
      <PhotoHero
        image={solution.image}
        eyebrow="Solutions"
        title={solution.heroTitle}
        text={solution.heroText}
        cta={{ label: "Request a quote", href: `/employers/request-staff?service=${solution.slug}` }}
        crumbs={[
          { label: "Employers", href: "/employers" },
          { label: "Solutions", href: "/employers/solutions" },
          { label: solution.title, href: `/employers/solutions/${solution.slug}` },
        ]}
      />

      <FeatureGrid title={`How ${solution.title.toLowerCase()} helps you`} text={solution.intro} items={solution.features} />

      <section className="bg-muted py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <CenteredHeading title="Is this right for you?" text={`${solution.title} is a great fit if:`} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {solution.useCases.map((u) => (
              <li key={u} className="flex gap-3 rounded-xl bg-white p-5 text-slate-800 ring-1 ring-slate-200">
                <Icon name="check" className="h-6 w-6 shrink-0 text-brand" />
                {t(u)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AdvantagesSection />
      <TechnologySection />
      <IconSteps muted title="Our hiring process" text="A proven four-step approach behind every placement." numbered steps={hiringSteps} />
      <FeatureGrid title="Why employers choose Bridge" items={whyBridge} />
      <SolutionsGrid muted title="Explore other solutions" />
      <CtaBanner
        title="Let's talk about your hiring needs"
        text="Share a few details and a consultant will get back to you within one working day."
        cta={{ label: "Request a quote", href: `/employers/request-staff?service=${solution.slug}` }}
      />
    </>
  );
}
