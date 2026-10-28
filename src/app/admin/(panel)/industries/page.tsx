import Image from "@/components/site-image";
import Link from "next/link";
import { importDefaultIndustriesAction } from "@/app/admin/industry-actions";
import { requireAdmin } from "@/lib/auth";
import { collections, getDb } from "@/lib/db";
import { getAdminIndustries } from "@/lib/industries-repo";

export default async function AdminIndustriesPage({ searchParams }: PageProps<"/admin/industries">) {
  await requireAdmin();
  const sp = await searchParams;
  const { list, usingDefaults } = await getAdminIndustries();

  // Open job counts per industry, so admins can see what's affected before editing.
  const counts = await (await getDb())
    .collection(collections.jobs)
    .aggregate<{ _id: string; n: number }>([{ $group: { _id: "$industry", n: { $sum: 1 } } }])
    .toArray();
  const jobCount = Object.fromEntries(counts.map((c) => [c._id, c.n]));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Industries</h1>
          <p className="mt-1 text-sm text-slate-500">Shown on employer pages, job filters and job forms.</p>
        </div>
        {!usingDefaults && (
          <Link href="/admin/industries/new" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            + New industry
          </Link>
        )}
      </div>

      {typeof sp.saved === "string" && (
        <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">Saved “{sp.saved}”.</p>
      )}
      {typeof sp.imported === "string" && (
        <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          Imported {sp.imported} industr{sp.imported === "1" ? "y" : "ies"}. You can now edit them.
        </p>
      )}

      {usingDefaults && (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <p className="font-semibold text-amber-900">The site is showing the built-in industries</p>
          <p className="mt-1 text-sm text-amber-900">Import them into the database to start editing, reordering or adding industries.</p>
          <form action={importDefaultIndustriesAction} className="mt-4">
            <button type="submit" className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
              Import industries to edit
            </button>
          </form>
        </div>
      )}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((i) => {
          const body = (
            <>
              <div className="relative aspect-[3/1] bg-slate-100">
                <Image src={i.image} alt="" fill sizes="33vw" className="object-cover" />
                <span className={`absolute right-2 top-2 rounded-full px-2.5 py-1 text-xs font-semibold ${i.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                  {i.published ? "Live" : "Hidden"}
                </span>
              </div>
              <div className="p-4">
                <p className="font-bold text-brand-dark">{i.name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{i.description}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Order {i.order} · {jobCount[i.slug] ?? 0} job{jobCount[i.slug] === 1 ? "" : "s"}
                </p>
              </div>
            </>
          );
          return (
            <li key={i.slug}>
              {i.id ? (
                <Link href={`/admin/industries/${i.id}`} className="block h-full overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 hover:ring-brand">{body}</Link>
              ) : (
                <div className="h-full overflow-hidden rounded-2xl bg-white opacity-80 ring-1 ring-slate-200">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
