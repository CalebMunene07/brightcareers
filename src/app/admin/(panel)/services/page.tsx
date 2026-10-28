import Link from "next/link";
import { importDefaultSolutionsAction } from "@/app/admin/actions";
import { Icon } from "@/components/icon";
import { requireAdmin } from "@/lib/auth";
import { getAdminSolutions } from "@/lib/solutions-repo";

export default async function ServicesPage({ searchParams }: PageProps<"/admin/services">) {
  await requireAdmin();
  const sp = await searchParams;
  const { list, usingDefaults } = await getAdminSolutions();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Services</h1>
          <p className="mt-1 text-sm text-slate-500">Employer solutions shown at /employers/solutions, on the employer pages and in the footer.</p>
        </div>
        {!usingDefaults && (
          <Link href="/admin/services/new" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            + New service
          </Link>
        )}
      </div>

      {typeof sp.saved === "string" && (
        <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">Saved “{sp.saved}”.</p>
      )}
      {typeof sp.imported === "string" && (
        <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">Imported {sp.imported} service(s). You can now edit them.</p>
      )}

      {usingDefaults && (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <p className="font-semibold text-amber-900">The site is showing the built-in services</p>
          <p className="mt-1 text-sm text-amber-900">Import them into the database to start editing, reordering or adding services.</p>
          <form action={importDefaultSolutionsAction} className="mt-4">
            <button type="submit" className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
              Import services to edit
            </button>
          </form>
        </div>
      )}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => {
          const body = (
            <>
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon name={s.icon} />
                </span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                  {s.published ? "Live" : "Draft"}
                </span>
              </div>
              <p className="mt-4 font-bold text-brand-dark">{s.title}</p>
              <p className="mt-1 text-sm text-slate-600">{s.text}</p>
              <p className="mt-3 text-xs text-slate-400">Order {s.order} · /employers/solutions/{s.slug}</p>
            </>
          );
          return (
            <li key={s.slug}>
              {s.id ? (
                <Link href={`/admin/services/${s.id}`} className="block h-full rounded-2xl bg-white p-5 ring-1 ring-slate-200 hover:ring-brand">{body}</Link>
              ) : (
                <div className="h-full rounded-2xl bg-white p-5 opacity-80 ring-1 ring-slate-200">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
