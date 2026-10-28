import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { collections, getDb } from "@/lib/db";
import { inboxTypes } from "@/lib/inbox";
import { SeedButton } from "./seed-button";

export default async function AdminDashboard() {
  const session = await requireAdmin();
  const db = await getDb();

  const [jobTotal, jobLive, ...inbox] = await Promise.all([
    db.collection(collections.jobs).countDocuments(),
    db.collection(collections.jobs).countDocuments({ published: { $ne: false } }),
    ...inboxTypes.flatMap((t) => [
      db.collection(t.collection).countDocuments({ status: "new" }),
      db.collection(t.collection).countDocuments(),
    ]),
  ]);

  const recent = await db
    .collection(collections.applications)
    .find({}, { projection: { name: 1, job: 1, createdAt: 1, status: 1 } })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-brand-dark">Welcome back, {session.name}</h1>
      <p className="mt-1 text-sm text-slate-500">Here&apos;s what&apos;s happening on the site.</p>

      {jobTotal === 0 && (
        <section className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <p className="font-semibold text-amber-900">This database is empty</p>
          <p className="mt-1 text-sm text-amber-900">
            Load the starter content that ships with the site (sample jobs, services, industries, articles, page text and images) so
            you have something to edit. Anything you&apos;ve already saved is kept.
          </p>
          <div className="mt-4">
            <SeedButton />
          </div>
        </section>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/jobs" className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 hover:ring-brand">
          <p className="text-sm font-medium text-slate-500">Jobs</p>
          <p className="mt-2 text-3xl font-bold text-brand-dark">{jobLive}</p>
          <p className="mt-1 text-xs text-slate-500">live · {jobTotal - jobLive} draft</p>
        </Link>
        {inboxTypes.map((t, i) => (
          <Link key={t.key} href={`/admin/inbox/${t.key}`} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 hover:ring-brand">
            <p className="text-sm font-medium text-slate-500">{t.label}</p>
            <p className="mt-2 text-3xl font-bold text-brand-dark">{inbox[i * 2]}</p>
            <p className="mt-1 text-xs text-slate-500">new · {inbox[i * 2 + 1]} total</p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-brand-dark">Latest applications</h2>
          <Link href="/admin/inbox/applications" className="text-sm font-semibold text-brand hover:underline">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No applications yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {recent.map((r) => (
              <li key={r._id.toString()}>
                <Link href={`/admin/inbox/applications/${r._id}`} className="flex items-center justify-between gap-4 py-3 text-sm hover:text-brand">
                  <span className="font-medium">{String(r.name ?? "")}</span>
                  <span className="truncate text-slate-500">{String(r.job ?? "")}</span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {r.createdAt instanceof Date ? r.createdAt.toLocaleDateString("en-GB") : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
