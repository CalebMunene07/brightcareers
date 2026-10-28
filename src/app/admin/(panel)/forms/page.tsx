import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { feesTotal, getAllCustomForms } from "@/lib/custom-forms-repo";
import { formDefs } from "@/lib/forms";
import { usd } from "@/lib/visa";

export default async function FormsPage() {
  await requireAdmin();
  const custom = await getAllCustomForms();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Forms</h1>
          <p className="mt-1 text-sm text-slate-500">Choose which fields each form asks for, or create new application forms with their own pricing.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/forms/pricing" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand ring-1 ring-brand hover:bg-brand/5">
            Pricing & payment
          </Link>
          <Link href="/admin/forms/new" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            + New form
          </Link>
        </div>
      </div>

      <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-500">Your forms</h2>
      {custom.length === 0 ? (
        <p className="mt-3 rounded-2xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
          None yet. Create one for each service you offer, e.g. a visit visa or tourist visa application. Each gets its own page at /apply/….
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100 rounded-2xl bg-white ring-1 ring-slate-200">
          {custom.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/forms/${f.id}`} className="font-semibold text-brand-dark hover:text-brand">{f.title}</Link>
                <p className="text-xs text-slate-500">
                  /apply/{f.slug} · {f.fields.filter((x) => x.type !== "section").length} question{f.fields.filter((x) => x.type !== "section").length === 1 ? "" : "s"} · {f.fees.length > 0 ? usd(feesTotal(f)) : "Free"}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${f.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                {f.published ? "Published" : "Draft"}
              </span>
              {f.published && (
                <Link href={`/apply/${f.slug}`} target="_blank" className="text-sm text-brand hover:underline">View ↗</Link>
              )}
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-500">Built-in forms</h2>
      <ul className="mt-3 divide-y divide-slate-100 rounded-2xl bg-white ring-1 ring-slate-200">
        {formDefs.map((f) => (
          <li key={f.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
            <div className="min-w-0 flex-1">
              <Link href={`/admin/forms/${f.id}`} className="font-semibold text-brand-dark hover:text-brand">{f.title}</Link>
              <p className="text-xs text-slate-500">{f.description}</p>
            </div>
            <Link href={`/admin/forms/${f.id}`} className="text-sm font-semibold text-brand hover:underline">Edit fields</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
