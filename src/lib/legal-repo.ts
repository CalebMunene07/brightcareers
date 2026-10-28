import "server-only";
import { cache } from "react";
import type { ArticleBlock } from "@/lib/articles";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";
import { legalPages } from "@/lib/legal";

// Editable legal pages, stored in the `content` collection as { key: "legal:<slug>", value }.
// Unsaved pages use the drafts in legal.ts.

export type LegalContent = {
  title: string;
  summary: string;
  updated: string; // YYYY-MM-DD
  body: ArticleBlock[];
  reviewed: boolean; // hides the "draft" notice once a lawyer has approved it
};

export const legalSlugs = legalPages.map((p) => p.slug);

export function defaultLegal(slug: string): LegalContent | undefined {
  const page = legalPages.find((p) => p.slug === slug);
  if (!page) return undefined;
  return {
    title: page.title,
    summary: page.summary,
    updated: page.updated,
    body: page.sections.map((s) => ({ heading: s.heading, text: s.text.join("\n\n") })),
    reviewed: false,
  };
}

type Doc = { key: string; value: LegalContent; updatedAt: Date; updatedBy?: string };

async function col() {
  return (await getDb()).collection<Doc>(collections.content);
}

export const getLegal = cache(async (slug: string): Promise<LegalContent | undefined> => {
  const fallback = defaultLegal(slug);
  if (!fallback) return undefined;
  try {
    const doc = await (await col()).findOne({ key: `legal:${slug}` });
    return doc ? { ...fallback, ...doc.value } : fallback;
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return fallback;
    throw error;
  }
});

export async function getLegalMeta(slug: string) {
  const doc = await (await col()).findOne({ key: `legal:${slug}` }, { projection: { updatedAt: 1, updatedBy: 1 } });
  return doc ? { updatedAt: doc.updatedAt, updatedBy: doc.updatedBy } : null;
}

export async function saveLegal(slug: string, value: LegalContent, updatedBy: string) {
  await (await col()).updateOne(
    { key: `legal:${slug}` },
    { $set: { key: `legal:${slug}`, value, updatedAt: new Date(), updatedBy } },
    { upsert: true },
  );
}

export async function resetLegal(slug: string) {
  await (await col()).deleteOne({ key: `legal:${slug}` });
}
