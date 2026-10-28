import "server-only";
import { countryNames } from "@/lib/countries";
import { getLocale, getT } from "@/lib/translate";
import { pricingStrings, ROUTE_FEES_NOTE } from "@/lib/pricing";
import { getPricing } from "@/lib/pricing-repo";
import { destinations, employmentStatuses, genders, travelClasses, visaDocuments, visaTypes } from "@/lib/visa";
import { visaStrings } from "@/lib/visa-strings";

/** Translated labels for the visa and air ticket forms. Empty in English, where the forms use their own text. */
export async function visaFormLabels(extra: string[] = []): Promise<Record<string, string>> {
  const [t, locale, pricing] = await Promise.all([getT(), getLocale(), getPricing()]);
  if (locale === "en") return {};
  const all = new Set([
    ...visaStrings,
    ...countryNames,
    ...Object.keys(destinations),
    ...Object.values(destinations).flat(),
    ...visaTypes,
    ...genders,
    ...employmentStatuses,
    ...travelClasses,
    ...visaDocuments.map((d) => d.label),
    ...pricingStrings(pricing),
    ROUTE_FEES_NOTE,
    ...extra,
  ]);
  return Object.fromEntries([...all].map((s) => [s, t(s)]));
}
