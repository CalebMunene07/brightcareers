// Prices, payment methods and payment instructions, edited in Admin → Forms → Pricing & payment
// (stored by pricing-repo.ts). These defaults apply until an admin saves the page. Shared with the browser.

import { findCountry } from "@/lib/countries";

export type Fee = { label: string; amount: number };
export type PaymentMethod = { id: string; label: string; note: string; mark: string };

/** Air ticket booking service fee tiers in USD (excludes the airline fare). */
export type RouteFees = { sameCountry: number; sameContinent: number; europeNorthAmerica: number; other: number };

export type Pricing = {
  /** Fixed visa application fees. Government visa fees vary by destination and are not quoted here. */
  visaFees: Fee[];
  routeFees: RouteFees;
  processingTime: string;
  cvDownloadFee: number;
  paymentMethods: PaymentMethod[];
  /** Shown wherever someone chooses how to pay. Empty hides the box. */
  paymentInstructions: string;
};

export const defaultPricing: Pricing = {
  visaFees: [{ label: "Processing fee", amount: 50 }],
  routeFees: { sameCountry: 15, sameContinent: 25, europeNorthAmerica: 45, other: 60 },
  processingTime: "15 – 20 business days",
  cvDownloadFee: 50,
  paymentMethods: [
    { id: "Card", label: "Visa card", note: "Credit / Debit", mark: "VISA · MC · AMEX" },
    { id: "Skrill", label: "Skrill", note: "", mark: "SKRILL" },
    { id: "Neteller", label: "Neteller", note: "", mark: "NETELLER" },
  ],
  paymentInstructions: "",
};

export function usd(amount: number) {
  return `USD ${amount.toFixed(2)}`;
}

export function feesTotal(fees: Fee[]) {
  return fees.reduce((sum, f) => sum + f.amount, 0);
}

/** Air ticket booking fee for a route, by the tiers in `fees`. 0 until both countries are chosen. */
export function routeFee(fees: RouteFees, from: string, to: string) {
  if (!from || !to) return 0;
  if (from === to) return fees.sameCountry;
  const a = findCountry(from)?.continent;
  const b = findCountry(to)?.continent;
  if (a && a === b) return fees.sameContinent;
  if ((a === "Europe" && b === "North America") || (a === "North America" && b === "Europe")) return fees.europeNorthAmerica;
  return fees.other;
}

/** English text explaining the route fee tiers; translate it with these values filled in. */
export const ROUTE_FEES_NOTE = "{same} within one country · {continent} within one continent · {euna} between Europe and North America · {other} other international routes";

export function routeFeesVars(fees: RouteFees) {
  const whole = (n: number) => `USD ${Number.isInteger(n) ? n : n.toFixed(2)}`;
  return { same: whole(fees.sameCountry), continent: whole(fees.sameContinent), euna: whole(fees.europeNorthAmerica), other: whole(fees.other) };
}

/** Every admin-written string, for translation. */
export function pricingStrings(p: Pricing) {
  return [
    ...p.visaFees.map((f) => f.label),
    p.processingTime,
    ...p.paymentMethods.flatMap((m) => [m.label, m.note]),
    p.paymentInstructions,
  ].filter(Boolean);
}
