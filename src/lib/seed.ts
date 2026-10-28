import "server-only";
import { importDefaultArticles } from "@/lib/articles-repo";
import { adminsCollection, hashPassword } from "@/lib/admin-store";
import { collections, getDb } from "@/lib/db";
import { heroDefs, type HeroId } from "@/lib/heroes";
import { importDefaultIndustries } from "@/lib/industries-repo";
import { importSampleJobs } from "@/lib/jobs-repo";
import { defaultLegal, legalSlugs } from "@/lib/legal-repo";
import { registerBuiltInImages } from "@/lib/media";
import { contentDefs, type ContentKey } from "@/lib/site-content";
import { importDefaultSolutions } from "@/lib/solutions-repo";

// Loads the starter (filler) content that ships with the code into the database, so a new
// database isn't empty. Only adds what's missing: anything already saved or edited is left alone.

export type SeedReport = Record<string, number>;

async function seedContentDocs(entries: { key: string; value: unknown }[]) {
  const col = (await getDb()).collection(collections.content);
  let added = 0;
  for (const { key, value } of entries) {
    const res = await col.updateOne(
      { key },
      { $setOnInsert: { key, value, updatedAt: new Date(), updatedBy: "starter content" } },
      { upsert: true },
    );
    added += res.upsertedCount;
  }
  return added;
}

/**
 * Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD (in .env.local) if that account
 * doesn't exist yet. An existing account's password is never changed.
 */
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!email || password.length < 10) return 0;
  const admins = await adminsCollection();
  await admins.createIndex({ email: 1 }, { unique: true }).catch(() => {});
  const res = await admins.updateOne(
    { email },
    {
      $setOnInsert: {
        email,
        name: process.env.ADMIN_NAME?.trim() || "Admin",
        passwordHash: await hashPassword(password),
        active: true,
        sessionVersion: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );
  return res.upsertedCount;
}

export async function seedStarterContent(): Promise<SeedReport> {
  const report: SeedReport = {};
  report["admin accounts"] = await seedAdmin();
  report["images"] = await registerBuiltInImages();
  report["jobs"] = await importSampleJobs();
  report["services"] = await importDefaultSolutions();
  report["industries"] = await importDefaultIndustries();
  report["job seeker articles"] = await importDefaultArticles("jobseekers");
  report["employer articles"] = await importDefaultArticles("employers");
  report["site content sections"] = await seedContentDocs(
    (Object.keys(contentDefs) as ContentKey[]).map((key) => ({ key, value: contentDefs[key].default })),
  );
  report["page heroes"] = await seedContentDocs(
    (Object.keys(heroDefs) as HeroId[]).map((id) => ({ key: `hero:${id}`, value: heroDefs[id].default })),
  );
  report["legal pages"] = await seedContentDocs(legalSlugs.map((slug) => ({ key: `legal:${slug}`, value: defaultLegal(slug) })));
  return report;
}
