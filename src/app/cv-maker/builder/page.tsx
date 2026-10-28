import type { Metadata } from "next";
import { CvBuilderLoader } from "@/components/cv/cv-builder-loader";
import { aiEnabled } from "@/lib/ai";
import { cvStrings } from "@/lib/cv-strings";
import { pricingStrings } from "@/lib/pricing";
import { getPricing } from "@/lib/pricing-repo";
import { getLocale, getT } from "@/lib/translate";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/cv-maker/builder", "Create your CV | Bridge Careers Global", "Build a professional CV in minutes and download it as a PDF.");

export default async function CvBuilderPage() {
  const [t, locale, pricing] = await Promise.all([getT(), getLocale(), getPricing()]);
  const labels = locale === "en" ? {} : Object.fromEntries([...cvStrings, ...pricingStrings(pricing), "Payment instructions"].map((s) => [s, t(s)]));
  return (
    <div className="bg-slate-50 print:bg-white">
      <CvBuilderLoader
        aiEnabled={await aiEnabled()}
        labels={labels}
        pricing={{ cvDownloadFee: pricing.cvDownloadFee, paymentMethods: pricing.paymentMethods, paymentInstructions: pricing.paymentInstructions }}
      />
    </div>
  );
}
