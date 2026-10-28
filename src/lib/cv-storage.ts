import "server-only";
import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Binary } from "mongodb";
import { getSettings } from "@/lib/settings";

// Storage for uploaded CVs and visa documents (personal data). When a private R2 bucket is set in Admin → Settings,
// files go to that bucket, which must NOT have public access; admins download them through /admin/files/….
// Otherwise the file is kept inside the MongoDB document.

export type StoredCv =
  | { name: string; type: string; size: number; storage: "r2"; key: string }
  | { name: string; type: string; size: number; storage?: "mongo"; data: Binary };

const EXT: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function privateBucket() {
  const s = await getSettings();
  if (!s.r2AccountId || !s.r2AccessKeyId || !s.r2SecretAccessKey || !s.r2PrivateBucket) return null;
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${s.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: s.r2AccessKeyId, secretAccessKey: s.r2SecretAccessKey },
  });
  return { client, bucket: s.r2PrivateBucket };
}

export async function storeCv(file: File): Promise<StoredCv> {
  return storeFile(file, "cvs");
}

/** Stores an upload under `folder/` in the private bucket, or inside the document when no bucket is set. */
export async function storeFile(file: File, folder: string): Promise<StoredCv> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const meta = { name: file.name.slice(0, 200), type: file.type, size: file.size };
  const r2 = await privateBucket();
  if (!r2) return { ...meta, storage: "mongo", data: new Binary(bytes) };

  const key = `${folder}/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${EXT[file.type] ?? "bin"}`;
  await r2.client.send(
    new PutObjectCommand({ Bucket: r2.bucket, Key: key, Body: bytes, ContentType: file.type, CacheControl: "private, no-store" }),
  );
  return { ...meta, storage: "r2", key };
}

export async function readCv(cv: StoredCv): Promise<Buffer | null> {
  if (cv.storage === "r2") {
    const r2 = await privateBucket();
    if (!r2) return null;
    const res = await r2.client.send(new GetObjectCommand({ Bucket: r2.bucket, Key: cv.key }));
    return res.Body ? Buffer.from(await res.Body.transformToByteArray()) : null;
  }
  return cv.data ? Buffer.from(cv.data.buffer) : null;
}

export async function deleteCv(cv: StoredCv | undefined) {
  if (cv?.storage !== "r2") return; // MongoDB copies go with the document
  const r2 = await privateBucket();
  if (r2) await r2.client.send(new DeleteObjectCommand({ Bucket: r2.bucket, Key: cv.key }));
}
