import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { audiences } from "@/lib/articles";
import { contentDefs, getContentMeta, type ContentKey } from "@/lib/site-content";

export default async function ContentIndexPage() {
  await requireAdmin();
  const keys = Object.keys(contentDefs) as ContentKey[];
  const metas = await Promise.all(keys.map((k) => getContentMeta(k)));
  const groups = ["Page sections", "Company", "Help & FAQ", "Settings"] as const;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-brand-dark">Site content</h1>
      <p className="mt-1 text-sm text-slate-500">Edit text and figures that appear across the website.</p>

      {groups.map((group) => (
        <section key={group}>
          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">{group}</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {keys.map((key, i) => {
              if ((contentDefs[key].group ?? "Company") !== group) return null;
              const def = contentDefs[key];
              const meta = metas[i];
              return (
                <Link key={key} href={`/admin/content/${key}`} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 hover:ring-brand">
                  <p className="font-bold text-brand-dark">{def.label}</p>
                  <p className="mt-1 text-sm text-slate-600">{def.description}</p>
                  <p className="mt-3 text-xs text-slate-400">
                    {meta ? `Edited ${meta.updatedAt.toLocaleDateString("en-GB")}${meta.updatedBy ? ` by ${meta.updatedBy}` : ""}` : "Using default text"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">Articles & media</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {audiences.map((a) => (
          <Link key={a.id} href={`/admin/articles?audience=${a.id}`} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 hover:ring-brand">
            <p className="font-bold text-brand-dark">{a.label}</p>
            <p className="mt-1 text-sm text-slate-600">Articles shown at {a.basePath}</p>
          </Link>
        ))}
        <Link href="/admin/heroes" className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 hover:ring-brand">
          <p className="font-bold text-brand-dark">Page heroes</p>
          <p className="mt-1 text-sm text-slate-600">Banner image, heading and buttons at the top of each page.</p>
        </Link>
        <Link href="/admin/services" className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 hover:ring-brand">
          <p className="font-bold text-brand-dark">Services</p>
          <p className="mt-1 text-sm text-slate-600">Employer solutions and their pages.</p>
        </Link>
        <Link href="/admin/media" className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 hover:ring-brand">
          <p className="font-bold text-brand-dark">Media library</p>
          <p className="mt-1 text-sm text-slate-600">Upload and manage images.</p>
        </Link>
      </div>
    </div>
  );
}
