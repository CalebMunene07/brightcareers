import "server-only";
import { ObjectId, type WithId } from "mongodb";
import { cache } from "react";
import { defaultArticles, type Article, type Audience } from "@/lib/articles";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";

type ArticleDoc = Omit<Article, "id"> & { createdAt?: Date; updatedAt?: Date };

function toArticle(doc: WithId<ArticleDoc>): Article {
  return {
    id: doc._id.toString(),
    audience: doc.audience,
    slug: doc.slug,
    category: doc.category,
    title: doc.title,
    excerpt: doc.excerpt,
    image: doc.image,
    date: doc.date,
    body: doc.body ?? [],
    published: doc.published ?? true,
  };
}

async function col() {
  return (await getDb()).collection<ArticleDoc>(collections.articles);
}

/** Published articles for one audience, newest first. Falls back to defaults without a database. */
export const getPublishedArticles = cache(async (audience: Audience): Promise<Article[]> => {
  try {
    const docs = await (await col()).find({ audience, published: { $ne: false } }).sort({ date: -1 }).toArray();
    return docs.map(toArticle);
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) {
      return defaultArticles.filter((a) => a.audience === audience).sort((a, b) => b.date.localeCompare(a.date));
    }
    throw error;
  }
});

export async function getPublishedArticle(audience: Audience, slug: string) {
  return (await getPublishedArticles(audience)).find((a) => a.slug === slug);
}

/* ---------------- Admin ---------------- */

export async function getAllArticles(audience: Audience) {
  const docs = await (await col()).find({ audience }).sort({ date: -1 }).toArray();
  return docs.map(toArticle);
}

export async function getArticleById(id: string) {
  if (!ObjectId.isValid(id)) return undefined;
  const doc = await (await col()).findOne({ _id: new ObjectId(id) });
  return doc ? toArticle(doc) : undefined;
}

export async function articleSlugTaken(audience: Audience, slug: string, exceptId?: string) {
  const filter: Record<string, unknown> = { audience, slug };
  if (exceptId && ObjectId.isValid(exceptId)) filter._id = { $ne: new ObjectId(exceptId) };
  return (await (await col()).countDocuments(filter, { limit: 1 })) > 0;
}

export async function saveArticle(article: Article) {
  const { id, ...data } = article;
  const now = new Date();
  if (id && ObjectId.isValid(id)) {
    await (await col()).updateOne({ _id: new ObjectId(id) }, { $set: { ...data, updatedAt: now } });
    return id;
  }
  const res = await (await col()).insertOne({ ...data, createdAt: now, updatedAt: now });
  return res.insertedId.toString();
}

export async function deleteArticle(id: string) {
  if (!ObjectId.isValid(id)) return;
  await (await col()).deleteOne({ _id: new ObjectId(id) });
}

/** Adds any default articles that aren't in the database yet. Returns how many were added. */
export async function importDefaultArticles(audience: Audience) {
  const c = await col();
  let added = 0;
  for (const a of defaultArticles.filter((x) => x.audience === audience)) {
    const res = await c.updateOne(
      { audience, slug: a.slug },
      { $setOnInsert: { ...a, createdAt: new Date(), updatedAt: new Date() } },
      { upsert: true },
    );
    added += res.upsertedCount;
  }
  return added;
}
