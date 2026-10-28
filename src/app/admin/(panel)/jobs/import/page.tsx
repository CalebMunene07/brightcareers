import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAllIndustries } from "@/lib/industries-repo";
import { importColumns } from "@/lib/job-import";
import { jobTypes } from "@/lib/jobs";
import { ImportForm } from "./import-form";

export default async function ImportJobsPage() {
  await requireAdmin();
  const industries = await getAllIndustries();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/jobs" className="text-sm text-slate-500 hover:text-brand">← Jobs</Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-dark">Import jobs from a spreadsheet</h1>

      <ol className="mt-6 list-decimal space-y-2 rounded-2xl bg-white p-6 pl-10 text-sm text-slate-700 ring-1 ring-slate-200">
        <li>
          <Link href="/admin/jobs-template" prefetch={false} className="font-semibold text-brand hover:underline">Download the template</Link> and open it in
          Excel or Google Sheets.
        </li>
        <li>Add one job per row. Keep the header row as it is.</li>
        <li>Save as <strong>CSV</strong> (Excel: File → Save As → CSV UTF-8).</li>
        <li>Upload it below. Use <strong>Check file</strong> first to see any problems without changing anything.</li>
      </ol>

      <div className="mt-6">
        <ImportForm />
      </div>

      <details className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <summary className="cursor-pointer font-semibold text-brand-dark">Column guide</summary>
        <dl className="mt-4 space-y-2 text-sm">
          {importColumns.map((c) => (
            <div key={c.key} className="grid gap-1 sm:grid-cols-[160px_1fr]">
              <dt className="font-mono font-semibold">
                {c.key}
                {c.required && <span className="text-red-600"> *</span>}
              </dt>
              <dd className="text-slate-600">
                {c.key === "type" && `One of: ${jobTypes.join(", ")}.`}
                {c.key === "industry" && `Industry name or slug: ${industries.map((i) => i.slug).join(", ")}.`}
                {c.key === "country" && "A country from Admin → Locations, or Remote."}
                {c.key === "slug" && "Optional URL. Leave empty to create it from the title and city (or country), e.g. nurse-london. A matching slug updates that existing job."}
                {(c.key === "posted" || c.key === "closes") && "Date as YYYY-MM-DD. posted defaults to today; closes is optional."}
                {(c.key === "responsibilities" || c.key === "requirements") && "Separate items with | (a vertical bar)."}
                {c.key === "published" && "yes or no (default yes)."}
                {["title", "company", "city", "salary", "summary"].includes(c.key) && <>e.g. {c.example}</>}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}
