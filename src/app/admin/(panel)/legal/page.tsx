import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatPosted } from "@/lib/jobs";
import { getLegal, legalSlugs } from "@/lib/legal-repo";

export default async function AdminLegalPage() {
  await requireAdmin();
  const pages = await Promise.all(legalSlugs.map(async (slug) => ({ slug, page: (await getLegal(slug))! })));

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-brand-dark">Legal pages</h1>
      <p className="mt-1 text-sm text-slate-500">Linked from the footer of every page.</p>
      <ul className="mt-6 divide-y divide-slate-100 rounded-2xl bg-white ring-1 ring-slate-200">
        {pages.map(({ slug, page }) => (
          <li key={slug}>
            <Link href={`/admin/legal/${slug}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50">
              <div>
                <p className="font-semibold text-brand-dark">{page.title}</p>
                <p className="text-xs text-slate-500">/{slug} · updated {formatPosted(page.updated)}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${page.reviewed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                {page.reviewed ? "Reviewed" : "Draft"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
