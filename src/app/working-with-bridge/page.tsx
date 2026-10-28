import type { Metadata } from "next";
import { getHero, heroProps } from "@/lib/heroes";
import { LocationPicker } from "@/components/location-picker";
import { Accordion, CenteredHeading, IconSteps, PhotoHero, SplitSection } from "@/components/sections";
import { getContent } from "@/lib/site-content";
import { getT } from "@/lib/translate";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/working-with-bridge", "Working with Bridge | Bridge Careers Global", "How to apply, what happens next, and tips for your CV, assessments and interviews.");

export default async function WorkingWithBridgePage() {
  const hero = await getHero("working-with-bridge");
  const [applyTips, journey, t] = await Promise.all([getContent("applyTips"), getContent("candidateJourney"), getT()]);
  return (
    <>
      <PhotoHero
        {...heroProps(hero)}
        crumbs={[{ label: "Working with Bridge", href: "/working-with-bridge" }]}
      />

      <IconSteps
        title="How to apply"
        text="Three simple steps from search to conversation."
        numbered
        steps={[
          { icon: "search", title: "Search for a job", text: "Filter by keyword, location, job type and industry to find roles that suit you." },
          { icon: "send", title: "Apply online", text: "Complete a short form and upload your CV, or create one with our CV maker." },
          { icon: "phone", title: "We'll be in touch", text: "A consultant reviews your application and contacts you about next steps." },
        ]}
      />

      <SplitSection
        muted
        image="/images/laptop-woman.jpg"
        title="Thousands of opportunities, one place to start"
        text="From short temporary assignments to long-term careers, we recruit for employers across many industries and countries. Tell us what you're looking for and we'll do the searching with you."
        cta={{ label: "Find a job", href: "/jobs" }}
      />

      <LocationPicker />

      <IconSteps
        muted
        title="Your journey with Bridge"
        text="What to expect from first click to first day."
        numbered
        steps={journey}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <CenteredHeading title="Quick tips" text="Practical advice from our consultants to help you through each stage." />
          <div className="mt-10">
            <Accordion
              items={applyTips.map((tip) => ({
                title: tip.title,
                content: (
                  <ul className="list-disc space-y-2 pl-5">
                    {tip.points.map((p) => (
                      <li key={p}>{t(p)}</li>
                    ))}
                  </ul>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      <SplitSection reverse muted image="/images/pro-man.jpg" title="Become a Bridge associate">
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-brand-dark">{t("The associate advantage")}</h3>
            <p className="mt-2 leading-relaxed text-slate-600">
              {t("When you work through Bridge you get a dedicated consultant, regular pay, access to training through Bridge Academy and help finding your next assignment before the current one ends.")}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-brand-dark">{t("Opportunities that fit your life")}</h3>
            <p className="mt-2 leading-relaxed text-slate-600">
              {t("Choose temporary, contract or permanent work, full-time or part-time hours, close to home or abroad. We match you with roles that suit your skills and your plans.")}
            </p>
          </div>
        </div>
      </SplitSection>
    </>
  );
}
