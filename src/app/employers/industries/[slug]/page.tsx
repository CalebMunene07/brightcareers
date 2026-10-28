import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobCard } from "@/components/job-card";
import {
  AdvantagesSection,
  CenteredHeading,
  FeatureGrid,
  IconSteps,
  PhotoHero,
  SolutionsGrid,
  SplitSection,
} from "@/components/sections";
import { getContent } from "@/lib/site-content";
import { getPublishedIndustry } from "@/lib/industries-repo";
import { getT } from "@/lib/translate";
import { getPublishedJobs } from "@/lib/jobs-repo";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/employers/industries/[slug]">): Promise<Metadata> {
  const industry = await getPublishedIndustry((await params).slug);
  if (!industry) return {};
  return pageMetadata(`/employers/industries/${industry.slug}`, `${industry.name} staffing solutions | Bridge Careers Global`, industry.description);
}

export default async function IndustryPage({ params }: PageProps<"/employers/industries/[slug]">) {
  const industry = await getPublishedIndustry((await params).slug);
  if (!industry) notFound();

  const name = industry.name.toLowerCase();
  const [whyBridge, t] = await Promise.all([getContent("whyBridge"), getT()]);
  const industryJobs = (await getPublishedJobs()).filter((j) => j.industry === industry.slug);

  return (
    <>
      <PhotoHero
        image={industry.image}
        eyebrow="Industries"
        title={`${industry.name} staffing solutions`}
        text={industry.description}
        cta={{ label: "Get in touch", href: "/employers/request-staff" }}
        crumbs={[
          { label: "Employers", href: "/employers" },
          { label: "Industries", href: "/employers/industries" },
          { label: industry.name, href: `/employers/industries/${industry.slug}` },
        ]}
      />

      <SplitSection
        image={industry.image}
        title={`Building your ${name} workforce`}
        text={`We create a recruitment plan around your sites, shifts and compliance requirements, then supply people who are ready to contribute from the first day. Typical roles we fill in ${name} include:`}
        points={industry.roles}
      />

      <IconSteps
        muted
        title="From plan to day one"
        numbered
        steps={[
          { icon: "target", title: "Build the plan", text: "We agree volumes, skills, timelines and budget with you." },
          { icon: "search", title: "Find the people", text: "We source and screen candidates with the right experience and certifications." },
          { icon: "handshake", title: "Hire with confidence", text: "You choose from a shortlist; we manage offers and contracts." },
          { icon: "rocket", title: "Prepare for day one", text: "Inductions, safety briefings and paperwork completed before the start." },
        ]}
      />

      <AdvantagesSection />
      <FeatureGrid title={`The Bridge difference in ${name}`} items={whyBridge} />

      <section className="bg-muted py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CenteredHeading title={`Open ${name} jobs`} text="Looking for work in this sector? These roles are open now." />
          {industryJobs.length > 0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {industryJobs.map((job) => (
                <JobCard key={job.slug} job={job} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-slate-600">
              {t("No open roles right now.")}{" "}
              <Link href="/cv-maker" className="font-semibold text-brand hover:underline">{t("Create your CV")}</Link>{" "}
              {t("and we'll be in touch when something comes up.")}
            </p>
          )}
        </div>
      </section>

      <SolutionsGrid title="Our solutions" />
    </>
  );
}
