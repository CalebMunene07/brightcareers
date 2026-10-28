import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { submitCustomForm } from "@/app/actions";
import { Icon } from "@/components/icon";
import { PageHero } from "@/components/page-hero";
import { TForm } from "@/components/t-form";
import { feesTotal, getPublishedCustomForm } from "@/lib/custom-forms-repo";
import { getPricing } from "@/lib/pricing-repo";
import { pageMetadata, SITE_NAME } from "@/lib/seo";
import { getT } from "@/lib/translate";
import { usd } from "@/lib/visa";

export async function generateMetadata({ params }: PageProps<"/apply/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const form = await getPublishedCustomForm(slug);
  if (!form) return {};
  return pageMetadata(`/apply/${slug}`, `${form.title} | ${SITE_NAME}`, form.intro || `Apply online: ${form.title}.`);
}

export default async function ApplyPage({ params }: PageProps<"/apply/[slug]">) {
  const { slug } = await params;
  const [form, t, pricing] = await Promise.all([getPublishedCustomForm(slug), getT(), getPricing()]);
  if (!form) notFound();

  const hasFees = form.fees.length > 0;
  const askPayment = form.askPayment && hasFees;
  const instructions = (form.paymentInstructions || pricing.paymentInstructions).trim();

  return (
    <>
      <PageHero
        eyebrow="Apply online"
        title={form.title}
        text={form.intro || undefined}
        crumbs={[
          { label: "Apply", href: "/apply" },
          { label: form.title, href: `/apply/${form.slug}` },
        ]}
      />
      <section className="bg-muted py-10 sm:py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_340px] lg:items-start lg:px-8">
          <div className="min-w-0 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-8">
            <TForm
              action={submitCustomForm}
              submitLabel="Submit application"
              hidden={{ form: form.slug }}
              fields={[
                { name: "name", label: "Full name", required: form.nameRequired },
                { name: "email", label: "Email address", type: "email", required: form.emailRequired },
              ]}
              layout={{ fields: {}, custom: form.fields }}
              after={
                askPayment
                  ? [{ name: "paymentMethod", label: "Preferred payment method", type: "select", required: true, full: true, options: pricing.paymentMethods.map((m) => ({ value: m.id, label: m.label })) }]
                  : []
              }
            />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            {hasFees && (
              <div className="rounded-2xl border-t-4 border-brand bg-white p-6 ring-1 ring-slate-200">
                <h2 className="flex items-center gap-2 font-bold text-brand-dark">
                  <Icon name="file" className="h-5 w-5 text-brand" />
                  {t("Fee breakdown")}
                </h2>
                <dl className="mt-3 divide-y divide-slate-100">
                  {form.fees.map((f) => (
                    <div key={f.label} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                      <dt className="text-slate-500">{t(f.label)}</dt>
                      <dd className="font-semibold text-slate-800">{usd(f.amount)}</dd>
                    </div>
                  ))}
                  <div className="flex items-baseline justify-between gap-4 py-2">
                    <dt className="text-sm text-slate-500">{t("Total amount")}</dt>
                    <dd className="text-base font-bold text-brand-dark">{usd(feesTotal(form))}</dd>
                  </div>
                </dl>
                <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Icon name="shield" className="h-4 w-4 text-brand" />
                  {t("Paid later via a secure link from our team")}
                </p>
                {instructions && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-sm font-bold text-brand-dark">{t("Payment instructions")}</p>
                    <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{t(instructions)}</p>
                  </div>
                )}
              </div>
            )}
            <div className="rounded-2xl bg-brand-dark p-6 text-white">
              <h2 className="font-bold">{t("What happens next?")}</h2>
              <p className="mt-1 text-sm text-white/80">{t("Our team reviews your application and contacts you by email with the next steps.")}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
