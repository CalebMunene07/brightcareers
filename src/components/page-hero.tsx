import Link from "next/link";
import { getT } from "@/lib/translate";

export async function PageHero({
  eyebrow,
  title,
  text,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  crumbs?: { label: string; href: string }[];
  children?: React.ReactNode;
}) {
  const t = await getT();
  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(circle at 85% 10%, var(--accent) 0, transparent 30%), radial-gradient(circle at 0% 100%, color-mix(in srgb, var(--brand) 60%, #ffffff) 0, transparent 40%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        {crumbs && (
          <nav aria-label={t("Breadcrumb")} className="mb-6 text-sm text-slate-300">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">{t("Home")}</Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <Link href={c.href} className="hover:text-white">{t(c.label)}</Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t(eyebrow)}</p>
        )}
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{t(title)}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg text-slate-200">{t(text)}</p>}
        {children}
      </div>
    </section>
  );
}

export async function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  const t = await getT();
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">{t(eyebrow)}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">{t(title)}</h2>
      {text && <p className="mt-4 text-lg text-slate-600">{t(text)}</p>}
    </div>
  );
}
