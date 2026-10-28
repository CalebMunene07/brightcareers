import type { Metadata } from "next";
import { FaqPage } from "@/components/faq-page";
import { getHero } from "@/lib/heroes";
import { getContent } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/employers/faq", "Employer FAQ | Bridge Careers Global", "Answers to common questions about fees, screening, timelines and temporary staff.");

export default async function EmployerFaqPage() {
  const [employerFaq, hero] = await Promise.all([getContent("employerFaq"), getHero("employer-faq")]);
  return (
    <FaqPage
      hero={hero}
      crumbs={[
        { label: "Employers", href: "/employers" },
        { label: "FAQ", href: "/employers/faq" },
      ]}
      faqs={employerFaq}
      cta={{
        title: "Ready to talk about your hiring needs?",
        text: "Tell us what you need and we'll get back to you within one working day.",
        label: "Request a quote",
        href: "/employers/request-staff",
      }}
    />
  );
}
