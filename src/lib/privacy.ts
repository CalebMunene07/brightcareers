import "server-only";
import { createHash } from "node:crypto";
import { deleteCv } from "@/lib/cv-storage";
import { collections, getDb } from "@/lib/db";
import { getInboxType, storedFiles, withoutFileData } from "@/lib/inbox";
import { getContent } from "@/lib/site-content";

// Data-protection tools: find, export and erase everything held about an email address,
// and delete old submissions according to the retention settings.

export const personalCollections = [
  { key: "applications", label: "Job applications", collection: collections.applications, retention: "applicationsMonths" },
  { key: "cvs", label: "CVs from the CV maker", collection: collections.cvs, retention: "cvsMonths" },
  { key: "cv-downloads", label: "CV download purchases", collection: collections.cvDownloads, retention: "cvsMonths" },
  { key: "messages", label: "Contact messages", collection: collections.contacts, retention: "messagesMonths" },
  { key: "requests", label: "Staff requests", collection: collections.staffRequests, retention: "requestsMonths" },
  { key: "visa", label: "Visa applications", collection: collections.visaApplications, retention: "visaMonths" },
  { key: "tickets", label: "Air ticket requests", collection: collections.ticketRequests, retention: "ticketsMonths" },
  { key: "forms", label: "Other applications", collection: collections.formSubmissions, retention: "formsMonths" },
  { key: "subscribers", label: "Newsletter", collection: collections.newsletter, retention: null },
] as const;

function emailFilter(email: string) {
  const escaped = email.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return { email: { $regex: `^${escaped}$`, $options: "i" } };
}

/** Removes uploaded files (CVs, visa documents) kept in the private bucket for these submissions. */
async function deleteFiles(key: string, docs: Record<string, unknown>[]) {
  const inbox = getInboxType(key);
  if (!inbox?.files) return;
  for (const doc of docs) for (const file of storedFiles(inbox, doc)) await deleteCv(file);
}

export async function findByEmail(email: string) {
  const db = await getDb();
  return Promise.all(
    personalCollections.map(async (c) => {
      const docs = await db
        .collection(c.collection)
        .find(emailFilter(email), { projection: withoutFileData(getInboxType(c.key) ?? {}) })
        .sort({ createdAt: -1 })
        .toArray();
      return { ...c, docs };
    }),
  );
}

/** Everything held about an email, as plain JSON (CV files are listed, not embedded). */
export async function exportByEmail(email: string) {
  const found = await findByEmail(email);
  return {
    email,
    exportedAt: new Date().toISOString(),
    data: Object.fromEntries(found.map((f) => [f.key, f.docs.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }))])),
  };
}

export async function deleteByEmail(email: string, adminEmail: string) {
  const db = await getDb();
  let total = 0;
  for (const c of personalCollections) {
    const col = db.collection(c.collection);
    await deleteFiles(c.key, await col.find(emailFilter(email)).toArray());
    total += (await col.deleteMany(emailFilter(email))).deletedCount;
  }
  // Keep an accountability record without storing the address itself.
  await db.collection(collections.privacyLog).insertOne({
    action: "erase",
    emailHash: createHash("sha256").update(email.trim().toLowerCase()).digest("hex"),
    deleted: total,
    by: adminEmail,
    at: new Date(),
  });
  return total;
}

/** Deletes submissions older than the configured retention periods. Returns counts per type. */
export async function runRetention(by = "scheduled") {
  const settings = (await getContent("retention")) as Record<string, string>;
  const db = await getDb();
  const result: Record<string, number> = {};

  for (const c of personalCollections) {
    if (!c.retention) continue;
    const months = Number(settings[c.retention]);
    if (!Number.isFinite(months) || months <= 0) continue; // empty or 0 = keep
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);
    const col = db.collection(c.collection);
    const filter = { createdAt: { $lt: cutoff } };
    await deleteFiles(c.key, await col.find(filter).toArray());
    result[c.key] = (await col.deleteMany(filter)).deletedCount;
  }

  await db.collection(collections.privacyLog).insertOne({ action: "retention", result, by, at: new Date() });
  return result;
}

export async function lastRetentionRun() {
  const db = await getDb();
  return db.collection(collections.privacyLog).findOne({ action: "retention" }, { sort: { at: -1 } });
}
