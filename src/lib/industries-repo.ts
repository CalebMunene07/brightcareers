import "server-only";
import { ObjectId, type WithId } from "mongodb";
import { cache } from "react";
import { industries as defaultIndustries, type Industry } from "@/lib/content";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";

// Industries. Stored in the `industries` collection; until any are saved
// (or without a database) the site uses the defaults from content.ts.

export type StoredIndustry = Industry & { id?: string; order: number; published: boolean };

type Doc = Omit<StoredIndustry, "id"> & { createdAt?: Date; updatedAt?: Date };

const defaults: StoredIndustry[] = defaultIndustries.map((i, n) => ({ ...i, order: n + 1, published: true }));

function toIndustry(d: WithId<Doc>): StoredIndustry {
  return {
    id: d._id.toString(),
    slug: d.slug,
    name: d.name,
    image: d.image,
    description: d.description,
    roles: d.roles ?? [],
    order: d.order ?? 0,
    published: d.published ?? true,
  };
}

async function col() {
  return (await getDb()).collection<Doc>(collections.industries);
}

async function stored(): Promise<StoredIndustry[] | null> {
  try {
    const docs = await (await col()).find().sort({ order: 1, name: 1 }).toArray();
    return docs.length > 0 ? docs.map(toIndustry) : null;
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return null;
    throw error;
  }
}

/** Live industries in display order. */
export const getPublishedIndustries = cache(async (): Promise<StoredIndustry[]> => {
  return ((await stored()) ?? defaults).filter((i) => i.published);
});

export async function getPublishedIndustry(slug: string) {
  return (await getPublishedIndustries()).find((i) => i.slug === slug);
}

/** Every industry (including hidden ones), for job forms and labels. */
export const getAllIndustries = cache(async (): Promise<StoredIndustry[]> => (await stored()) ?? defaults);

/** Display name for an industry slug, falling back to the slug itself. */
export async function industryName(slug: string) {
  return (await getAllIndustries()).find((i) => i.slug === slug)?.name ?? slug;
}

/* ---------------- Admin ---------------- */

export async function getAdminIndustries() {
  const list = await stored();
  return { list: list ?? defaults, usingDefaults: list === null };
}

export async function getIndustryById(id: string) {
  if (!ObjectId.isValid(id)) return undefined;
  const d = await (await col()).findOne({ _id: new ObjectId(id) });
  return d ? toIndustry(d) : undefined;
}

export async function industrySlugTaken(slug: string, exceptId?: string) {
  const filter: Record<string, unknown> = { slug };
  if (exceptId && ObjectId.isValid(exceptId)) filter._id = { $ne: new ObjectId(exceptId) };
  return (await (await col()).countDocuments(filter, { limit: 1 })) > 0;
}

export async function saveIndustry(i: StoredIndustry) {
  const { id, ...data } = i;
  const now = new Date();
  if (id && ObjectId.isValid(id)) {
    await (await col()).updateOne({ _id: new ObjectId(id) }, { $set: { ...data, updatedAt: now } });
    return id;
  }
  const res = await (await col()).insertOne({ ...data, createdAt: now, updatedAt: now });
  return res.insertedId.toString();
}

export async function deleteIndustry(id: string) {
  if (!ObjectId.isValid(id)) return;
  await (await col()).deleteOne({ _id: new ObjectId(id) });
}

export async function importDefaultIndustries() {
  const c = await col();
  let added = 0;
  for (const i of defaults) {
    const res = await c.updateOne(
      { slug: i.slug },
      { $setOnInsert: { ...i, createdAt: new Date(), updatedAt: new Date() } },
      { upsert: true },
    );
    added += res.upsertedCount;
  }
  return added;
}
