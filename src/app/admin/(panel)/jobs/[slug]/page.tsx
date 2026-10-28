import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteJobAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/app/admin/(panel)/confirm-button";
import { requireAdmin } from "@/lib/auth";
import { collections, getDb } from "@/lib/db";
import { getAllIndustries } from "@/lib/industries-repo";
import { getAllCountries } from "@/lib/locations-repo";
import { getJobBySlug } from "@/lib/jobs-repo";
import { JobForm } from "../job-form";

export default async function EditJobPage({ params }: PageProps<"/admin/jobs/[slug]">) {
  await requireAdmin();
  const job = await getJobBySlug((await params).slug);
  if (!job) notFound();
  const appsCol = (await getDb()).collection(collections.applications);
  const [appTotal, recentApps] = await Promise.all([
    appsCol.countDocuments({ job: job.slug }),
    appsCol.find({ job: job.slug }, { projection: { name: 1, email: 1, status: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(5).toArray(),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/jobs" className="text-sm text-slate-500 hover:text-brand">← Jobs</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-brand-dark">{job.title}</h1>
        <div className="flex items-center gap-3">
          {job.published && (
            <Link href={`/jobs/${job.slug}`} target="_blank" className="text-sm font-semibold text-brand hover:underline">
              View on site ↗
            </Link>
          )}
          <ConfirmButton action={deleteJobAction.bind(null, job.slug)} label="Delete job" confirmLabel="Yes, delete this job" />
        </div>
      </div>
      <section className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-brand-dark">Applications ({appTotal})</h2>
          {appTotal > 0 && (
            <Link href={`/admin/inbox/applications?job=${job.slug}`} className="text-sm font-semibold text-brand hover:underline">View all</Link>
          )}
        </div>
        {recentApps.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No applications yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {recentApps.map((a) => (
              <li key={a._id.toString()}>
                <Link href={`/admin/inbox/applications/${a._id}`} className="flex items-center justify-between gap-4 py-2.5 text-sm hover:text-brand">
                  <span className="font-medium">{String(a.name ?? "")}</span>
                  <span className="truncate text-slate-500">{String(a.email ?? "")}</span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {a.status === "new" ? "New · " : ""}
                    {a.createdAt instanceof Date ? a.createdAt.toLocaleDateString("en-GB") : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6">
        <JobForm job={job} industries={(await getAllIndustries()).map((i) => ({ slug: i.slug, name: i.name }))} countries={await getAllCountries()} />
      </div>
    </div>
  );
}
