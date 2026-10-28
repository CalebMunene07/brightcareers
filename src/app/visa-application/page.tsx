import type { Metadata } from "next";
import { VisaForm } from "@/components/visa/visa-form";
import { customStrings } from "@/lib/forms";
import { getFormLayout } from "@/lib/forms-repo";
import { getPricing } from "@/lib/pricing-repo";
import { visaFormLabels } from "@/lib/visa-labels";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/visa-application", "Visa application | Bridge Careers Global", "Apply for a work visa with Bridge Careers Global: your details, travel plans and documents in five simple steps.");

function param(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function VisaApplicationPage({ searchParams }: PageProps<"/visa-application">) {
  const sp = await searchParams;
  const [layout, pricing] = await Promise.all([getFormLayout("visa"), getPricing()]);
  return (
    <div className="bg-muted">
      <VisaForm labels={await visaFormLabels(customStrings(layout))} layout={layout} pricing={pricing} initialCountry={param(sp.country)} initialRole={param(sp.role)} />
    </div>
  );
}
