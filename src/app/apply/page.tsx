import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { feesTotal, getPublishedCustomForms } from "@/lib/custom-forms-repo";
import { pageMetadata } from "@/lib/seo";
import { getT } from "@/lib/translate";
import { usd } from "@/lib/visa";

export const metadata: Metadata = pageMetadata("/apply", "Apply online | Bridge Careers Global", "Visa and travel applications you can complete online with Bridge Careers Global.");

// Every published form from Admin → Forms, plus the built-in visa and air ticket forms.
export default async function ApplyIndexPage() {
  const [forms, t] = await Promise.all([getPublishedCustomForms(), getT()]);
  const cards = [
    { href: "/visa-application", title: "Work visa application", text: "Apply for a work visa with a role in your destination country.", price: "" },
    ...forms.map((f) => ({ href: `/apply/${f.slug}`, title: f.title, text: f.intro, price: f.fees.length > 0 ? usd(feesTotal(f)) : "" })),
    { href: "/air-ticket-booking", title: "Air ticket booking", text: "Share your route and we'll compare flight options for you.", price: "" },
  ];

  return (
    <>
      <PageHero eyebrow="Apply online" title="Applications" text="Choose the service you need and complete the form online." crumbs={[{ label: "Apply", href: "/apply" }]} />
      <section className="bg-muted py-12 sm:py-16">
        <ul className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {cards.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-slate-200 transition-shadow hover:shadow-lg hover:ring-brand">
                <h2 className="text-lg font-bold text-brand-dark">{t(c.title)}</h2>
                {c.text && <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">{t(c.text)}</p>}
                <p className="mt-4 flex items-center justify-between text-sm font-semibold text-brand">
                  {t("Apply now")} →{c.price && <span className="text-slate-700">{c.price}</span>}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
