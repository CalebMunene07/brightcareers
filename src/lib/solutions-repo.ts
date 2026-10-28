import "server-only";
import { ObjectId, type WithId } from "mongodb";
import { cache } from "react";
import { employerSolutions, type Solution } from "@/lib/content";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";

// Employer services. Stored in the `solutions` collection; until any are saved
// (or without a database) the site uses the defaults from content.ts.

/** Optional translated names, shown in the footer for that language. */
export type SolutionTranslations = { fr?: string; pt?: string; sw?: string };

export type StoredSolution = Solution & { id?: string; order: number; published: boolean; translations?: SolutionTranslations };

type Doc = Omit<StoredSolution, "id"> & { createdAt?: Date; updatedAt?: Date };

const defaults: StoredSolution[] = employerSolutions.map((s, i) => ({ ...s, order: i + 1, published: true }));

function toSolution(d: WithId<Doc>): StoredSolution {
  return {
    id: d._id.toString(),
    slug: d.slug,
    icon: d.icon,
    title: d.title,
    text: d.text,
    heroTitle: d.heroTitle,
    heroText: d.heroText,
    image: d.image,
    intro: d.intro,
    features: d.features ?? [],
    useCases: d.useCases ?? [],
    order: d.order ?? 0,
    published: d.published ?? true,
    translations: d.translations ?? {},
  };
}

async function col() {
  return (await getDb()).collection<Doc>(collections.solutions);
}

/** All stored services in display order, or null when none have been saved yet. */
async function stored(): Promise<StoredSolution[] | null> {
  try {
    const docs = await (await col()).find().sort({ order: 1, title: 1 }).toArray();
    return docs.length > 0 ? docs.map(toSolution) : null;
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return null;
    throw error;
  }
}

export const getPublishedSolutions = cache(async (): Promise<StoredSolution[]> => {
  const list = (await stored()) ?? defaults;
  return list.filter((s) => s.published);
});

export async function getPublishedSolution(slug: string) {
  return (await getPublishedSolutions()).find((s) => s.slug === slug);
}

/* ---------------- Admin ---------------- */

export async function getAdminSolutions() {
  const list = await stored();
  return { list: list ?? defaults, usingDefaults: list === null };
}

export async function getSolutionById(id: string) {
  if (!ObjectId.isValid(id)) return undefined;
  const d = await (await col()).findOne({ _id: new ObjectId(id) });
  return d ? toSolution(d) : undefined;
}

export async function solutionSlugTaken(slug: string, exceptId?: string) {
  const filter: Record<string, unknown> = { slug };
  if (exceptId && ObjectId.isValid(exceptId)) filter._id = { $ne: new ObjectId(exceptId) };
  return (await (await col()).countDocuments(filter, { limit: 1 })) > 0;
}

export async function saveSolution(s: StoredSolution) {
  const { id, ...data } = s;
  const now = new Date();
  if (id && ObjectId.isValid(id)) {
    await (await col()).updateOne({ _id: new ObjectId(id) }, { $set: { ...data, updatedAt: now } });
    return id;
  }
  const res = await (await col()).insertOne({ ...data, createdAt: now, updatedAt: now });
  return res.insertedId.toString();
}

export async function deleteSolution(id: string) {
  if (!ObjectId.isValid(id)) return;
  await (await col()).deleteOne({ _id: new ObjectId(id) });
}

/** Copies the default services into the database so they can be edited. */
export async function importDefaultSolutions() {
  const c = await col();
  let added = 0;
  for (const s of defaults) {
    const res = await c.updateOne(
      { slug: s.slug },
      { $setOnInsert: { ...s, createdAt: new Date(), updatedAt: new Date() } },
      { upsert: true },
    );
    added += res.upsertedCount;
  }
  return added;
}
