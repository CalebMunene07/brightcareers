import "server-only";
import { randomUUID } from "node:crypto";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ObjectId } from "mongodb";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";
import { getSettings } from "@/lib/settings";

// Images uploaded in the admin are stored in Cloudflare R2 (S3-compatible) and served from
// the bucket's public URL. MongoDB keeps only the metadata. Built-in images live in /public/images.

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export type MediaItem = { id?: string; src: string; name: string; size?: number; builtIn: boolean };

// key is the R2 object key for uploads; built-in (filler) images have no key and live in /public/images.
type MediaDoc = { key?: string; url: string; name: string; type: string; size: number; createdAt: Date; uploadedBy?: string; builtIn?: boolean };

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("Image uploads aren't configured yet (set the R2_* variables in .env.local).");
  }
}

async function r2() {
  const s = await getSettings();
  if (!s.r2AccountId || !s.r2AccessKeyId || !s.r2SecretAccessKey || !s.r2Bucket || !s.r2PublicUrl) {
    throw new StorageNotConfiguredError();
  }
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${s.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: s.r2AccessKeyId, secretAccessKey: s.r2SecretAccessKey },
  });
  return { client, bucket: s.r2Bucket, publicUrl: s.r2PublicUrl.replace(/\/+$/, "") };
}

export async function storageConfigured() {
  try {
    await r2();
    return true;
  } catch {
    return false;
  }
}

async function col() {
  return (await getDb()).collection<MediaDoc>(collections.media);
}

export async function listBuiltInImages(): Promise<MediaItem[]> {
  const dir = path.join(process.cwd(), "public", "images");
  const files = await readdir(dir).catch(() => [] as string[]);
  return files
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()
    .map((f) => ({ src: `/images/${f}`, name: f, builtIn: true }));
}

/** Images in the media library (uploads and registered filler images), newest first. */
export async function listLibraryImages(): Promise<MediaItem[]> {
  try {
    const docs = await (await col()).find().sort({ builtIn: 1, createdAt: -1 }).toArray();
    return docs.map((d) => ({ id: d._id.toString(), src: d.url, name: d.name, size: d.size, builtIn: !!d.builtIn }));
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return [];
    throw error;
  }
}

/**
 * Images admins can pick from. Once the library has been seeded it's the source of truth;
 * before that (or without a database) the filler files on disk are offered directly.
 */
export async function listAllImages() {
  const library = await listLibraryImages();
  return library.length > 0 ? library : listBuiltInImages();
}

/** Registers the filler images from /public/images in the library. Returns how many were added. */
export async function registerBuiltInImages() {
  const c = await col();
  await c.createIndex({ url: 1 }, { unique: true }).catch(() => {});
  const dir = path.join(process.cwd(), "public", "images");
  let added = 0;
  for (const img of await listBuiltInImages()) {
    const size = (await stat(path.join(dir, img.name)).catch(() => null))?.size ?? 0;
    const type = /\.png$/i.test(img.name) ? "image/png" : /\.webp$/i.test(img.name) ? "image/webp" : "image/jpeg";
    const res = await c.updateOne(
      { url: img.src },
      { $setOnInsert: { url: img.src, name: img.name, type, size, builtIn: true, createdAt: new Date(), uploadedBy: "seed" } },
      { upsert: true },
    );
    added += res.upsertedCount;
  }
  return added;
}

/** How many places use each image (articles, services, industries, page content). */
export async function imageUsage(): Promise<Record<string, number>> {
  const db = await getDb();
  const counts: Record<string, number> = {};
  const add = (src: unknown) => {
    if (typeof src === "string" && src) counts[src] = (counts[src] ?? 0) + 1;
  };
  for (const name of [collections.articles, collections.solutions, collections.industries]) {
    for (const d of await db.collection(name).find({}, { projection: { image: 1 } }).toArray()) add(d.image);
  }
  // Heroes and page sections store images inside their values.
  for (const d of await db.collection(collections.content).find({}, { projection: { value: 1 } }).toArray()) {
    for (const m of JSON.stringify(d.value ?? "").matchAll(/"(\/images\/[^"]+|https?:\/\/[^"]+\/uploads\/[^"]+)"/g)) add(m[1]);
  }
  return counts;
}

/** Filler files on disk that are no longer in the library: safe to delete from /public/images. */
export async function removableBuiltInFiles() {
  const library = new Set((await listLibraryImages()).map((i) => i.src));
  if (library.size === 0) return [];
  const usage = await imageUsage();
  return (await listBuiltInImages()).filter((i) => !library.has(i.src) && !usage[i.src]).map((i) => i.name);
}

export async function saveImage(file: File, uploadedBy: string) {
  const { client, bucket, publicUrl } = await r2();
  const key = `uploads/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${EXT[file.type] ?? "bin"}`;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  await (await col()).insertOne({
    key,
    url: `${publicUrl}/${key}`,
    name: file.name.slice(0, 200),
    type: file.type,
    size: file.size,
    createdAt: new Date(),
    uploadedBy,
  });
}

export async function deleteImage(id: string) {
  if (!ObjectId.isValid(id)) return;
  const c = await col();
  const doc = await c.findOne({ _id: new ObjectId(id) });
  if (!doc) return;
  if (doc.key) {
    const { client, bucket } = await r2();
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: doc.key }));
  }
  // Built-in files stay in /public/images until a developer removes them from the code.
  await c.deleteOne({ _id: doc._id });
}

/** True when `src` points at an allowed image (built-in, or uploaded to our R2 bucket). */
export async function isAllowedImageSrc(src: string) {
  if (/^\/images\/[\w.-]+\.(jpe?g|png|webp)$/i.test(src)) return true;
  const base = (await getSettings()).r2PublicUrl.replace(/\/+$/, "");
  return !!base && src.startsWith(`${base}/uploads/`) && /\.(jpe?g|png|webp)$/i.test(src);
}
