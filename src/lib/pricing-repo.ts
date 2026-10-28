import "server-only";
import { cache } from "react";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";
import { defaultPricing, type Pricing } from "@/lib/pricing";

// Pricing and payment settings, stored in `content` as { key: "pricing", value: Pricing }.

const KEY = "pricing";

type Doc = { key: string; value: Partial<Pricing>; updatedAt: Date; updatedBy?: string };

async function col() {
  return (await getDb()).collection<Doc>(collections.content);
}

export const getPricing = cache(async (): Promise<Pricing> => {
  try {
    const doc = await (await col()).findOne({ key: KEY });
    const v = doc?.value ?? {};
    return {
      ...defaultPricing,
      ...v,
      routeFees: { ...defaultPricing.routeFees, ...v.routeFees },
      paymentMethods: v.paymentMethods?.length ? v.paymentMethods : defaultPricing.paymentMethods,
    };
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return defaultPricing;
    throw error;
  }
});

export async function savePricing(value: Pricing, updatedBy: string) {
  await (await col()).updateOne({ key: KEY }, { $set: { key: KEY, value, updatedAt: new Date(), updatedBy } }, { upsert: true });
}
