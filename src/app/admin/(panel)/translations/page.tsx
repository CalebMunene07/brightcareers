import Link from "next/link";
import { approveAllMachineAction, saveTranslationAction } from "@/app/admin/translation-actions";
import { requireAdmin } from "@/lib/auth";
import { collections, getDb } from "@/lib/db";
import { locales } from "@/lib/i18n";
import type { TranslationDoc, TranslationStatus } from "@/lib/translate";
import { activeTranslator } from "@/lib/translators";
import { TranslationTools } from "./tools";

const PER_PAGE = 40;
const targets = locales.filter((l) => l.code !== "en");
const statusInfo: Record<TranslationStatus, { label: string; cls: string }> = {
  pending: { label: "Needs translation", cls: "bg-amber-100 text-amber-800" },
  machine: { label: "Machine", cls: "bg-sky-100 text-sky-800" },
  reviewed: { label: "Reviewed", cls: "bg-emerald-100 text-emerald-800" },
};

function param(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function TranslationsPage({ searchParams }: PageProps<"/admin/translations">) {
  await requireAdmin();
  const sp = await searchParams;
  const locale = targets.find((l) => l.code === param(sp.locale))?.code ?? "fr";
  const status = (["pending", "machine", "reviewed"] as const).find((s) => s === param(sp.status));
  const q = param(sp.q)?.trim() ?? "";
  const page = Math.max(1, Number(param(sp.page)) || 1);

  const col = (await getDb()).collection<TranslationDoc>(collections.translations);
  const filter: Record<string, unknown> = { locale };
  if (status) filter.status = status;
  if (q) {
    const rx = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    filter.$or = [{ source: rx }, { text: rx }];
  }

  const [counts, total, rows] = await Promise.all([
    col.aggregate<{ _id: TranslationStatus; n: number }>([{ $match: { locale } }, { $group: { _id: "$status", n: { $sum: 1 } } }]).toArray(),
    col.countDocuments(filter),
    col.find(filter).sort({ status: 1, source: 1 }).skip((page - 1) * PER_PAGE).limit(PER_PAGE).toArray(),
  ]);
  const count = Object.fromEntries(counts.map((c) => [c._id, c.n])) as Partial<Record<TranslationStatus, number>>;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const translator = await activeTranslator();

  const href = (o: { locale?: string; status?: string; page?: number }) => {
    const p = new URLSearchParams({ locale: o.locale ?? locale });
    const s = o.status ?? status;
    if (s) p.set("status", s);
    if (q && !o.locale) p.set("q", q);
    if (o.page && o.page > 1) p.set("page", String(o.page));
    return `/admin/translations?${p}`;
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-brand-dark">Translations</h1>
      <p className="mt-1 text-sm text-slate-500">
        Everything visitors read in French, Portuguese and Swahili. Text without a translation is shown in English until it&apos;s translated.
      </p>

      <nav aria-label="Language" className="mt-6 flex flex-wrap gap-2">
        {targets.map((l) => (
          <Link
            key={l.code}
            href={href({ locale: l.code, status: "" })}
            aria-current={l.code === locale ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 ${l.code === locale ? "bg-brand text-white ring-brand" : "bg-white text-slate-700 ring-slate-200 hover:ring-brand"}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <section className="mt-6 grid gap-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200 lg:grid-cols-[1fr_auto]">
        <div>
          <div className="flex flex-wrap gap-2 text-sm">
            {(["pending", "machine", "reviewed"] as const).map((s) => (
              <Link key={s} href={href({ status: s, page: 1 })} className={`rounded-full px-3 py-1 font-semibold ${statusInfo[s].cls} ${status === s ? "ring-2 ring-brand" : ""}`}>
                {statusInfo[s].label}: {count[s] ?? 0}
              </Link>
            ))}
            <Link href={href({ status: "", page: 1 })} className={`rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 ${!status ? "ring-2 ring-brand" : ""}`}>
              All
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            {translator ? (
              <>Automatic translation: <strong>{translator.name}</strong>. New text is translated in the background as pages are visited.</>
            ) : (
              <>No translation service is set up, so new text waits here for you to translate it by hand. Add a translation service in <Link href="/admin/settings#translation" className="font-semibold text-brand underline">Settings → Translation</Link> (Azure has a free tier) to translate automatically.</>
            )}
          </p>
          <div className="mt-4">
            <TranslationTools locale={locale} canTranslate={!!translator} pending={count.pending ?? 0} />
          </div>
        </div>
        {(count.machine ?? 0) > 0 && (
          <form action={approveAllMachineAction.bind(null, locale)} className="self-start">
            <button type="submit" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand hover:text-brand">
              Mark all machine translations reviewed
            </button>
          </form>
        )}
      </section>

      <form method="get" className="mt-6 flex gap-2">
        <input type="hidden" name="locale" value={locale} />
        {status && <input type="hidden" name="status" value={status} />}
        <label htmlFor="q" className="sr-only">Search</label>
        <input id="q" name="q" defaultValue={q} placeholder="Search English or translated text…" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
        <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Search</button>
      </form>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-10 text-center text-sm text-slate-500 ring-1 ring-slate-200">
          Nothing here yet. Use “Scan whole site” to collect every text that needs translating.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((r) => (
            <li key={r.hash} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <form action={saveTranslationAction.bind(null, locale, r.hash)} className="grid gap-3 lg:grid-cols-2">
                <div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusInfo[r.status].cls}`}>{statusInfo[r.status].label}</span>
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{r.source}</p>
                </div>
                <div>
                  <label htmlFor={`t-${r.hash}`} className="sr-only">Translation</label>
                  <textarea
                    id={`t-${r.hash}`}
                    name="text"
                    defaultValue={r.text}
                    rows={Math.min(8, Math.max(2, Math.ceil(r.source.length / 70)))}
                    lang={locale}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                  <button type="submit" className="mt-1 rounded-full bg-brand px-4 py-1 text-xs font-semibold text-white hover:bg-brand-dark">
                    Save
                  </button>
                </div>
              </form>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex flex-wrap justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link key={n} href={href({ page: n })} aria-current={n === page ? "page" : undefined} className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${n === page ? "bg-brand text-white" : "bg-white ring-1 ring-slate-200"}`}>
              {n}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
