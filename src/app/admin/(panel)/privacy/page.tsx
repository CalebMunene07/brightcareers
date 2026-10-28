import Link from "next/link";
import { ConfirmButton } from "@/app/admin/(panel)/confirm-button";
import { eraseEmailAction } from "@/app/admin/privacy-actions";
import { requireAdmin } from "@/lib/auth";
import { findByEmail, lastRetentionRun, personalCollections } from "@/lib/privacy";
import { getContent } from "@/lib/site-content";
import { RetentionButton } from "./retention-button";

export default async function PrivacyPage({ searchParams }: PageProps<"/admin/privacy">) {
  await requireAdmin();
  const sp = await searchParams;
  const email = typeof sp.email === "string" ? sp.email.trim() : "";
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [found, retention, lastRun] = await Promise.all([
    valid ? findByEmail(email) : null,
    getContent("retention") as Promise<Record<string, string>>,
    lastRetentionRun(),
  ]);
  const total = found?.reduce((n, f) => n + f.docs.length, 0) ?? 0;

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Privacy & data</h1>
        <p className="mt-1 text-sm text-slate-500">Handle data access and deletion requests, and clean up old submissions.</p>
      </div>

      {typeof sp.erased === "string" && (
        <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          Deleted {sp.erased} record(s). A note of the deletion (without the email address) has been kept for your records.
        </p>
      )}

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">Find someone&apos;s data</h2>
        <form method="get" className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={email}
            placeholder="person@example.com"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <button type="submit" className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Search</button>
        </form>

        {email && !valid && <p className="mt-3 text-sm text-red-600">Enter a full email address.</p>}

        {found && (
          <div className="mt-6">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">{total}</span> record{total === 1 ? "" : "s"} found for <span className="font-semibold">{email}</span>.
            </p>
            <ul className="mt-3 divide-y divide-slate-100 rounded-xl ring-1 ring-slate-200">
              {found.map((f) => (
                <li key={f.key} className="px-4 py-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{f.label}</span>
                    <span className="text-slate-500">{f.docs.length}</span>
                  </div>
                  {f.docs.length > 0 && f.key !== "subscribers" && (
                    <ul className="mt-1 space-y-0.5">
                      {f.docs.map((d) => (
                        <li key={d._id.toString()}>
                          <Link href={`/admin/inbox/${f.key}/${d._id}`} className="text-brand hover:underline">
                            {d.createdAt instanceof Date ? d.createdAt.toLocaleDateString("en-GB") : "Record"}
                            {d.job ? ` · ${String(d.job)}` : ""}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            {total > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Link
                  href={`/admin/privacy-export?email=${encodeURIComponent(email)}`}
                  prefetch={false}
                  className="rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand hover:bg-brand/5"
                >
                  Download their data (JSON)
                </Link>
                <ConfirmButton
                  action={eraseEmailAction.bind(null, email)}
                  label="Delete all their data"
                  confirmLabel={`Yes, permanently delete ${total} record${total === 1 ? "" : "s"}`}
                />
              </div>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">Automatic cleanup</h2>
        <p className="mt-1 text-sm text-slate-500">
          Submissions older than these periods are deleted. Change them in{" "}
          <Link href="/admin/content/retention" className="font-semibold text-brand hover:underline">Site content → Data retention</Link>.
        </p>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {personalCollections
            .filter((c) => c.retention)
            .map((c) => {
              const months = Number(retention[c.retention!]);
              return (
                <li key={c.key} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span>{c.label}</span>
                  <span className="font-semibold">{months > 0 ? `${months} months` : "Kept until deleted"}</span>
                </li>
              );
            })}
        </ul>
        <div className="mt-5">
          <RetentionButton />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {lastRun ? `Last run ${(lastRun.at as Date).toLocaleString("en-GB")} (${String(lastRun.by)}).` : "Not run yet."} Schedule it daily by
          calling <code>/api/cron/retention</code> with the <code>CRON_SECRET</code>.
        </p>
      </section>
    </div>
  );
}
