"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { parseJobCsv, type ImportRowError } from "@/lib/job-import";
import { saveJob, slugExists } from "@/lib/jobs-repo";

export type ImportState = {
  ok: boolean;
  message: string;
  created?: number;
  updated?: number;
  errors?: ImportRowError[];
};

const MAX_BYTES = 2 * 1024 * 1024;

export async function importJobsAction(_prev: ImportState, formData: FormData): Promise<ImportState> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose a CSV file to upload." };
  if (file.size > MAX_BYTES) return { ok: false, message: "The file is too large (max 2 MB)." };
  if (!/\.csv$/i.test(file.name)) return { ok: false, message: "Upload a .csv file. In Excel use File → Save As → CSV." };

  const dryRun = formData.get("mode") === "check";
  const { jobs, errors, total } = await parseJobCsv(await file.text());

  // Nothing is imported if any row has a problem, so a file is never half-applied.
  if (errors.length > 0) {
    return {
      ok: false,
      message: `${errors.length} of ${total} row${total === 1 ? "" : "s"} need fixing. Nothing was imported.`,
      errors,
    };
  }

  let created = 0;
  let updated = 0;
  for (const job of jobs) {
    const exists = await slugExists(job.slug);
    if (!dryRun) await saveJob(job);
    if (exists) updated++;
    else created++;
  }
  if (!dryRun) revalidatePath("/", "layout");

  return {
    ok: true,
    message: dryRun
      ? `All ${total} rows look good: ${created} would be created and ${updated} updated. Choose “Import” to apply.`
      : `Imported ${total} job${total === 1 ? "" : "s"}: ${created} created, ${updated} updated.`,
    created,
    updated,
  };
}
