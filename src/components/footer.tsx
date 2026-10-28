import Link from "next/link";
import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import type { Dictionary, Locale } from "@/lib/i18n";
import { getPublishedSolutions } from "@/lib/solutions-repo";

export async function Footer({ t, locale }: { t: Dictionary["footer"]; locale: Locale }) {
  const year = new Date().getFullYear();
  // The Solutions column lists the live services from the admin, using translated names when set.
  const solutions = await getPublishedSolutions();
  const columns = t.columns.map((col, i) =>
    i === 0 ? { ...col, links: solutions.map((s) => ({ label: (locale !== "en" && s.translations?.[locale]) || s.title, href: `/employers/solutions/${s.slug}` })) } : col,
  );

  return (
    <footer className="bg-brand-dark text-slate-300 print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <div>
            <div className="inline-block rounded-2xl bg-white p-3">
              <Logo full />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">{t.tagline}</p>
            <NewsletterForm label={t.emailLabel} placeholder={t.emailPlaceholder} submit={t.subscribe} />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-white">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm transition-colors hover:text-accent">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Bridge Careers Global. {t.rights}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {t.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
