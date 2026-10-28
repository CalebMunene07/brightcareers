import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getInboxType, statuses, withoutFiles } from "@/lib/inbox";

const PER_PAGE = 25;

function param(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function InboxListPage({ params, searchParams }: PageProps<"/admin/inbox/[type]">) {
  await requireAdmin();
  const inbox = getInboxType((await params).type);
  if (!inbox) notFound();

  const sp = await searchParams;
  const status = param(sp.status) ?? "";
  const q = param(sp.q)?.trim() ?? "";
  const page = Math.max(1, Number(param(sp.page)) || 1);
  const job = inbox.key === "applications" ? (param(sp.job) ?? "") : "";

  const filter: Record<string, unknown> = {};
  if (statuses.some((s) => s.id === status)) filter.status = status;
  if (job) filter.job = job;
  if (q) {
    const rx = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    filter.$or = inbox.columns.map((c) => ({ [c.field]: rx }));
  }

  const db = await getDb();
  const col = db.collection(inbox.collection);
  const [total, rows] = await Promise.all([
    col.countDocuments(filter),
    col
      .find(filter, { projection: withoutFiles(inbox) })
      .sort({ createdAt: -1 })
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .toArray(),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  const href = (o: { status?: string; page?: number }) => {
    const p = new URLSearchParams();
    const s = o.status ?? status;
    if (s) p.set("status", s);
    if (q) p.set("q", q);
    if (job) p.set("job", job);
    if (o.page && o.page > 1) p.set("page", String(o.page));
    const qs = p.toString();
    return `/admin/inbox/${inbox.key}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-brand-dark">{inbox.label}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {total} {total === 1 ? "item" : "items"}
        {job && (
          <>
            {" "}for <span className="font-semibold text-slate-700">{job}</span> ·{" "}
            <Link href={`/admin/inbox/${inbox.key}`} className="text-brand hover:underline">show all</Link>
          </>
        )}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Status" className="flex flex-wrap gap-2">
          {[{ id: "", label: "All" }, ...statuses].map((s) => (
            <Link
              key={s.id || "all"}
              href={href({ status: s.id, page: 1 })}
              aria-current={status === s.id ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ${
                status === s.id ? "bg-brand text-white ring-brand" : "bg-white text-slate-700 ring-slate-200 hover:ring-brand"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </nav>
        <form method="get" className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          {job && <input type="hidden" name="job" value={job} />}
          <label htmlFor="q" className="sr-only">Search</label>
          <input id="q" name="q" defaultValue={q} placeholder="Search…" className="w-56 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-brand focus:outline-none" />
          <button type="submit" className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white">Search</button>
        </form>
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-white p-10 text-center text-sm text-slate-500 ring-1 ring-slate-200">Nothing here yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {inbox.columns.map((c) => (
                  <th key={c.field} className="px-4 py-3 font-semibold">{c.label}</th>
                ))}
                <th className="px-4 py-3 font-semibold">Received</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => {
                const id = row._id.toString();
                const st = statuses.find((s) => s.id === row.status);
                return (
                  <tr key={id} className="hover:bg-slate-50">
                    {inbox.columns.map((c, i) => (
                      <td key={c.field} className="max-w-[240px] truncate px-4 py-3 text-slate-700">
                        {i === 0 ? (
                          <Link href={`/admin/inbox/${inbox.key}/${id}`} className="font-semibold text-brand-dark hover:text-brand">
                            {String(row[c.field] ?? "") || "(no value)"}
                          </Link>
                        ) : (
                          String(row[c.field] ?? "")
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-slate-500">
                      {row.createdAt instanceof Date ? row.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : ""}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          row.status === "new"
                            ? "bg-accent/30 text-brand-dark"
                            : row.status === "in_progress"
                              ? "bg-sky-100 text-sky-800"
                              : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {st?.label ?? String(row.status ?? "")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={href({ page: n })}
              aria-current={n === page ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                n === page ? "bg-brand text-white" : "bg-white ring-1 ring-slate-200"
              }`}
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
