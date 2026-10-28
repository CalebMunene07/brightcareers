import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getPricing } from "@/lib/pricing-repo";
import { PricingEditor } from "./pricing-editor";

export default async function PricingPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/forms" className="text-sm text-slate-500 hover:text-brand">← Forms</Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-dark">Pricing & payment</h1>
      <p className="mt-1 text-sm text-slate-500">
        Prices and payment details for the visa, air ticket and CV forms. Fees for forms you create are set on each form. No payment is
        taken on the site; your team sends a payment link. Past submissions keep the prices they were quoted.
      </p>
      <div className="mt-6">
        <PricingEditor pricing={await getPricing()} />
      </div>
    </div>
  );
}
