import Link from "next/link";
import { ArrowRight } from "@/components/icon";
import { Accordion, PhotoHero } from "@/components/sections";
import type { Faq } from "@/lib/faq";
import { heroProps, type Hero } from "@/lib/heroes";
import { getT } from "@/lib/translate";

export async function FaqPage({
  hero,
  crumbs,
  faqs,
  cta,
}: {
  hero: Hero;
  crumbs: { label: string; href: string }[];
  faqs: Faq[];
  cta: { title: string; text: string; label: string; href: string };
}) {
  const t = await getT();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: t(f.q),
      acceptedAnswer: { "@type": "Answer", text: t(f.a) },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PhotoHero compact {...heroProps(hero)} crumbs={crumbs} />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Accordion items={faqs.map((f) => ({ title: f.q, content: <p>{t(f.a)}</p> }))} />

          <div className="mt-14 rounded-3xl bg-muted p-8 text-center sm:p-10">
            <h2 className="text-2xl font-bold text-brand-dark">{t(cta.title)}</h2>
            <p className="mt-2 text-slate-600">{t(cta.text)}</p>
            <Link
              href={cta.href}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-dark"
            >
              {t(cta.label)} <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
