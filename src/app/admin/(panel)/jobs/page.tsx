import Link from "next/link";
import { importSampleJobsAction, toggleJobPublished } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { collections, getDb } from "@/lib/db";
import { getAllIndustries } from "@/lib/industries-repo";
import { formatPosted, isOpen, todayIso } from "@/lib/jobs";
import { getAllJobs } from "@/lib/jobs-repo";

export default async function AdminJobsPage({ searchParams }: PageProps<"/admin/jobs">) {
  await requireAdmin();
  const { saved, imported } = await searchParams;
  const [jobs, industries] = await Promise.all([getAllJobs(), getAllIndustries()]);
  const today = todayIso();
  const appCounts = await (await getDb())
    .collection(collections.applications)
    .aggregate<{ _id: string; n: number; fresh: number }>([
      { $group: { _id: "$job", n: { $sum: 1 }, fresh: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } } } },
    ])
    .toArray();
  const apps = Object.fromEntries(appCounts.map((c) => [c._id, c]));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Jobs</h1>
          <p className="mt-1 text-sm text-slate-500">{jobs.length} total</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/jobs/import" className="rounded-full border border-brand px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand/5">
            Import from spreadsheet
          </Link>
          <Link href="/admin/jobs/new" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            + New job
          </Link>
        </div>
      </div>

      {typeof saved === "string" && (
        <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          Saved “{saved}”.
        </p>
      )}
      {typeof imported === "string" && (
        <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          Imported {imported} sample job{imported === "1" ? "" : "s"}.
        </p>
      )}

      {jobs.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center ring-1 ring-slate-200">
          <p className="font-semibold text-brand-dark">No jobs yet</p>
          <p className="mt-1 text-sm text-slate-500">Create your first job, or import the sample jobs to get started.</p>
          <form action={importSampleJobsAction} className="mt-5">
            <button type="submit" className="rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand hover:bg-brand hover:text-white">
              Import sample jobs
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-200">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Industry</th>
                <th className="px-4 py-3 font-semibold">Posted</th>
                <th className="px-4 py-3 font-semibold">Closes</th>
                <th className="px-4 py-3 font-semibold">Applications</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr key={job.slug} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/jobs/${job.slug}`} className="font-semibold text-brand-dark hover:text-brand">
                      {job.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{job.location}</td>
                  <td className="px-4 py-3 text-slate-600">{job.type}</td>
                  <td className="px-4 py-3 text-slate-600">{industries.find((i) => i.slug === job.industry)?.name ?? job.industry}</td>
                  <td className="px-4 py-3 text-slate-600">{formatPosted(job.posted)}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {job.closes ? (
                      <span className={isOpen(job, today) ? "" : "font-semibold text-red-600"}>
                        {formatPosted(job.closes)}
                        {!isOpen(job, today) && " · Expired"}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {apps[job.slug] ? (
                      <Link href={`/admin/inbox/applications?job=${job.slug}`} className="font-semibold text-brand hover:underline">
                        {apps[job.slug].n}
                        {apps[job.slug].fresh > 0 && (
                          <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-brand-dark">{apps[job.slug].fresh} new</span>
                        )}
                      </Link>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleJobPublished.bind(null, job.slug)}>
                      <button
                        type="submit"
                        title="Click to toggle"
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          job.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {job.published ? "Live" : "Draft"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
