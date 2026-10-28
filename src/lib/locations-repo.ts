import "server-only";
import { cache } from "react";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";
import { countriesOf, defaultRegions, REMOTE, type Region } from "@/lib/locations";

// Continents and their countries, stored in `content` as { key: "locations", value: Region[] }.
// Until saved (or without a database) the defaults from locations.ts are used.

const KEY = "locations";

type Doc = { key: string; value: Region[]; updatedAt: Date; updatedBy?: string };

async function col() {
  return (await getDb()).collection<Doc>(collections.content);
}

export const getRegions = cache(async (): Promise<Region[]> => {
  try {
    const doc = await (await col()).findOne({ key: KEY });
    return doc?.value?.length ? doc.value : defaultRegions;
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return defaultRegions;
    throw error;
  }
});

/** Every country in the picker, alphabetically. */
export async function getAllCountries() {
  return countriesOf(await getRegions());
}

/** The listed spelling of a country (case-insensitive), or Remote; undefined when it isn't listed. */
export async function findKnownCountry(value: string) {
  const v = value.trim().toLowerCase();
  if (v === REMOTE.toLowerCase()) return REMOTE;
  return (await getAllCountries()).find((c) => c.toLowerCase() === v);
}

export async function saveRegions(value: Region[], updatedBy: string) {
  await (await col()).updateOne({ key: KEY }, { $set: { key: KEY, value, updatedAt: new Date(), updatedBy } }, { upsert: true });
}
