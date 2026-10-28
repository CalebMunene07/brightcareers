import "server-only";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";
import { isOpen, sampleJobs, todayIso, type Job } from "@/lib/jobs";

// Job storage. When MONGODB_URI isn't set, the public site falls back to the sample jobs
// so pages still render during development.

// closes is stored as null when a closing date is cleared.
type JobDoc = Omit<Job, "closes"> & { closes?: string | null; createdAt?: Date; updatedAt?: Date };

function strip(doc: JobDoc): Job {
  return {
    slug: doc.slug,
    title: doc.title,
    company: doc.company,
    location: doc.location,
    country: doc.country || undefined,
    city: doc.city || undefined,
    type: doc.type,
    industry: doc.industry,
    salary: doc.salary,
    posted: doc.posted,
    closes: doc.closes || undefined,
    summary: doc.summary,
    responsibilities: doc.responsibilities ?? [],
    requirements: doc.requirements ?? [],
    published: doc.published ?? true,
  };
}

async function jobsCollection() {
  const db = await getDb();
  return db.collection<JobDoc>(collections.jobs);
}

/** Published jobs that haven't passed their closing date, newest first. */
export async function getPublishedJobs(): Promise<Job[]> {
  const today = todayIso();
  try {
    const docs = await (await jobsCollection())
      .find({
        published: { $ne: false },
        $or: [{ closes: { $exists: false } }, { closes: null }, { closes: "" }, { closes: { $gte: today } }],
      })
      .sort({ posted: -1 })
      .toArray();
    return docs.map(strip);
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return sampleJobs.filter((j) => isOpen(j, today));
    throw error;
  }
}

/** An open job that can be applied for. */
export async function getPublishedJob(slug: string): Promise<Job | undefined> {
  const jobs = await getPublishedJobs();
  return jobs.find((j) => j.slug === slug);
}

/** A published job for its detail page, including closed ones (shown as "closed"). */
export async function getJobForPage(slug: string): Promise<Job | undefined> {
  try {
    const doc = await (await jobsCollection()).findOne({ slug, published: { $ne: false } });
    return doc ? strip(doc) : undefined;
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return sampleJobs.find((j) => j.slug === slug);
    throw error;
  }
}

/** All jobs including drafts, for the admin panel. */
export async function getAllJobs(): Promise<Job[]> {
  const docs = await (await jobsCollection()).find().sort({ posted: -1 }).toArray();
  return docs.map(strip);
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  const doc = await (await jobsCollection()).findOne({ slug });
  return doc ? strip(doc) : undefined;
}

export async function saveJob(job: Job, originalSlug?: string) {
  const col = await jobsCollection();
  const now = new Date();
  await col.updateOne(
    { slug: originalSlug ?? job.slug },
    { $set: { ...job, updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true },
  );
}

export async function deleteJob(slug: string) {
  await (await jobsCollection()).deleteOne({ slug });
}

export async function slugExists(slug: string) {
  return (await (await jobsCollection()).countDocuments({ slug }, { limit: 1 })) > 0;
}

/** `base`, or `base-2`, `base-3`… whichever no other job uses yet. `own` is the job's current slug, which it may keep. */
export async function uniqueSlug(base: string, own?: string) {
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    if (slug === own || !(await slugExists(slug))) return slug;
  }
}

/** Inserts any sample jobs that aren't in the database yet. Returns how many were added. */
export async function importSampleJobs() {
  const col = await jobsCollection();
  let added = 0;
  for (const job of sampleJobs) {
    const res = await col.updateOne(
      { slug: job.slug },
      { $setOnInsert: { ...job, published: true, createdAt: new Date() } },
      { upsert: true },
    );
    added += res.upsertedCount;
  }
  return added;
}
