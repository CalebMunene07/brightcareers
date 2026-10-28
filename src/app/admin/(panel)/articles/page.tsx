import Link from "next/link";
import { importDefaultArticlesAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { audiences, getAudience, isAudience } from "@/lib/articles";
import { getAllArticles } from "@/lib/articles-repo";
import { formatPosted } from "@/lib/jobs";

export default async function AdminArticlesPage({ searchParams }: PageProps<"/admin/articles">) {
  await requireAdmin();
  const sp = await searchParams;
  const audience = typeof sp.audience === "string" && isAudience(sp.audience) ? sp.audience : "jobseekers";
  const a = getAudience(audience);
  const articles = await getAllArticles(audience);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-brand-dark">Articles</h1>
        <Link href={`/admin/articles/new?audience=${audience}`} className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          + New article
        </Link>
      </div>

      <nav aria-label="Article type" className="mt-6 flex gap-2">
        {audiences.map((x) => (
          <Link
            key={x.id}
            href={`/admin/articles?audience=${x.id}`}
            aria-current={x.id === audience ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 ${
              x.id === audience ? "bg-brand text-white ring-brand" : "bg-white text-slate-700 ring-slate-200 hover:ring-brand"
            }`}
          >
            {x.label}
          </Link>
        ))}
      </nav>

      {typeof sp.saved === "string" && (
        <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">Saved “{sp.saved}”.</p>
      )}
      {typeof sp.imported === "string" && (
        <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">Imported {sp.imported} article(s).</p>
      )}

      {articles.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center ring-1 ring-slate-200">
          <p className="font-semibold text-brand-dark">No {a.label.toLowerCase()} in the database yet</p>
          <p className="mt-1 text-sm text-slate-500">Write a new one, or import the starter articles.</p>
          <form action={importDefaultArticlesAction.bind(null, audience)} className="mt-5">
            <button type="submit" className="rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand hover:bg-brand hover:text-white">
              Import starter articles
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((x) => (
                <tr key={x.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/articles/${x.id}`} className="font-semibold text-brand-dark hover:text-brand">{x.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{x.category}</td>
                  <td className="px-4 py-3 text-slate-600">{formatPosted(x.date)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${x.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                      {x.published ? "Live" : "Draft"}
                    </span>
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
