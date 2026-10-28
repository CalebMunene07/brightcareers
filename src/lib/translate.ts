import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { after } from "next/server";
import { cache } from "react";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { activeTranslator, type TargetLocale } from "@/lib/translators";

// Translation memory for page content.
//
// Every English string shown on the public site goes through t(). Translations live in the
// `translations` collection, one document per (locale, text). A string with no translation is
// shown in English and queued; after the response is sent, queued strings are machine-translated
// (if a translator is configured) so the next visitor sees them translated. Admins can review and
// edit everything at /admin/translations, or translate by hand without any service.

export type TranslationStatus = "pending" | "machine" | "reviewed";

export type TranslationDoc = {
  locale: TargetLocale;
  hash: string;
  source: string;
  text: string;
  status: TranslationStatus;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
};

const MAX_SOURCE = 5000;

export function hashSource(source: string) {
  return createHash("sha1").update(source).digest("hex");
}

async function col() {
  const c = (await getDb()).collection<TranslationDoc>(collections.translations);
  return c;
}

let indexed = false;
async function ensureIndexes() {
  if (indexed) return;
  const c = await col();
  await c.createIndex({ locale: 1, hash: 1 }, { unique: true });
  await c.createIndex({ locale: 1, status: 1 });
  indexed = true;
}

/* ---------------- In-memory cache of finished translations ---------------- */

const TTL_MS = 30_000;
const memory = new Map<Locale, { at: number; map: Map<string, string> }>();

async function loadLocale(locale: TargetLocale) {
  const hit = memory.get(locale);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.map;
  const docs = await (await col())
    .find({ locale, status: { $in: ["machine", "reviewed"] } }, { projection: { hash: 1, text: 1 } })
    .toArray();
  const map = new Map(docs.map((d) => [d.hash, d.text]));
  memory.set(locale, { at: Date.now(), map });
  return map;
}

/** Forget cached translations so edits show immediately. */
export function invalidateTranslations(locale?: Locale) {
  if (locale) memory.delete(locale);
  else memory.clear();
}

/* ---------------- Request locale ---------------- */

export const getLocale = cache(async (): Promise<Locale> => {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(saved) ? saved : defaultLocale;
});

/* ---------------- t() ---------------- */

export type T = (source: string, vars?: Record<string, string | number>) => string;

function fill(text: string, vars?: Record<string, string | number>) {
  return vars ? text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : text;
}

/**
 * Returns a translate function for the current request's language.
 * Use {name} placeholders for values: t("Jobs in {country}", { country }).
 */
export const getT = cache(async (): Promise<T> => {
  const locale = await getLocale();
  if (locale === "en") return (s, vars) => fill(s, vars);

  let map: Map<string, string>;
  try {
    map = await loadLocale(locale);
  } catch (error) {
    if (!(error instanceof DatabaseNotConfiguredError)) console.error("[i18n] couldn't load translations", error);
    return (s, vars) => fill(s, vars);
  }

  const missing = new Set<string>();
  let scheduled = false;

  return (source, vars) => {
    const s = source.trim();
    if (!s || s.length > MAX_SOURCE || !/[A-Za-z]/.test(s)) return fill(source, vars);
    const found = map.get(hashSource(s));
    if (found !== undefined) return fill(found, vars);
    missing.add(s);
    if (!scheduled) {
      scheduled = true;
      // Queue (and machine-translate) the misses once this response has been sent.
      after(() => queueAndTranslate(locale, [...missing]));
    }
    return fill(source, vars);
  };
});

/** Translates a list of strings with the request's t(). Handy for arrays of content. */
export async function tAll<V extends Record<string, unknown>>(items: V[], fields: (keyof V)[]): Promise<V[]> {
  const t = await getT();
  return items.map((item) => {
    const copy = { ...item };
    for (const f of fields) {
      const v = item[f];
      if (typeof v === "string") (copy as Record<keyof V, unknown>)[f] = t(v);
      else if (Array.isArray(v)) (copy as Record<keyof V, unknown>)[f] = v.map((x) => (typeof x === "string" ? t(x) : x));
    }
    return copy;
  });
}

/* ---------------- Queue + machine translation ---------------- */

const running = new Set<Locale>();

async function queueAndTranslate(locale: TargetLocale, sources: string[]) {
  try {
    await ensureIndexes();
    const c = await col();
    const now = new Date();
    if (sources.length > 0) {
      await c.bulkWrite(
        sources.map((source) => ({
          updateOne: {
            filter: { locale, hash: hashSource(source) },
            update: { $setOnInsert: { locale, hash: hashSource(source), source, text: "", status: "pending" as const, createdAt: now, updatedAt: now } },
            upsert: true,
          },
        })),
        { ordered: false },
      );
    }
    if (await activeTranslator()) await translatePending(locale, 300);
  } catch (error) {
    console.error(`[i18n] queueing ${locale} translations failed`, error);
  }
}

/** Machine-translates up to `limit` pending strings for a locale. Returns how many were translated. */
export async function translatePending(locale: TargetLocale, limit = 1000) {
  if (running.has(locale)) return 0;
  const translator = await activeTranslator();
  if (!translator) return 0;
  running.add(locale);
  let done = 0;
  try {
    const c = await col();
    const pending = await c.find({ locale, status: "pending" }).limit(limit).toArray();
    // Batches stay well inside every provider's request limits.
    for (let i = 0; i < pending.length; ) {
      const batch: TranslationDoc[] = [];
      let chars = 0;
      while (i < pending.length && batch.length < 50 && chars + pending[i].source.length < 9000) {
        chars += pending[i].source.length;
        batch.push(pending[i++]);
      }
      if (batch.length === 0) batch.push(pending[i++]);
      const out = await translator.translate(batch.map((d) => d.source), locale);
      const now = new Date();
      await c.bulkWrite(
        batch.map((d, j) => ({
          updateOne: {
            filter: { locale, hash: d.hash, status: "pending" },
            update: { $set: { text: out[j] ?? "", status: "machine" as const, provider: translator.name, updatedAt: now } },
          },
        })),
      );
      done += batch.length;
    }
  } finally {
    running.delete(locale);
    invalidateTranslations(locale);
  }
  return done;
}
