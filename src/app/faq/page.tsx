import type { Metadata } from "next";
import { FaqPage } from "@/components/faq-page";
import { getHero } from "@/lib/heroes";
import { getContent } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/faq", "Job seeker FAQ | Bridge Careers Global", "Answers to common questions about applying, pay, temporary work and more.");

export default async function JobSeekerFaqPage() {
  const [jobSeekerFaq, hero] = await Promise.all([getContent("jobSeekerFaq"), getHero("faq")]);
  return (
    <FaqPage
      hero={hero}
      crumbs={[{ label: "FAQ", href: "/faq" }]}
      faqs={jobSeekerFaq}
      cta={{
        title: "Still have a question?",
        text: "Our team is happy to help.",
        label: "Contact us",
        href: "/contact-us",
      }}
    />
  );
}
