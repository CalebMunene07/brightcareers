import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { chromeKeys, getNavOverrides, menuLabels, menus } from "@/lib/nav-repo";
import { NavForm, type NavGroup } from "./nav-form";

const chromeNames: Record<(typeof chromeKeys)[number], string> = {
  forJobSeekers: "Top bar: job seekers tab",
  forEmployers: "Top bar: employers tab",
  resources: "“Resources” dropdown button",
};

export default async function NavigationPage({ searchParams }: PageProps<"/admin/navigation">) {
  await requireAdmin();
  const sp = await searchParams;
  const locale = typeof sp.locale === "string" && isLocale(sp.locale) ? sp.locale : "en";
  const base = getDictionary(locale);
  const overrides = await getNavOverrides(locale);

  const groups: NavGroup[] = [
    {
      title: "Top bar & buttons",
      rows: chromeKeys.map((k) => ({ field: `chrome:${k}`, defaultLabel: base[k], hint: chromeNames[k], value: overrides[`chrome:${k}`] ?? "" })),
    },
    ...menus.map((m) => ({
      title: menuLabels[m],
      rows: base[m].map((item) => ({
        field: `${m}:${item.href}`,
        defaultLabel: item.label,
        hint: item.href,
        value: overrides[`${m}:${item.href}`] ?? "",
      })),
    })),
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-brand-dark">Menu labels</h1>
      <p className="mt-1 text-sm text-slate-500">Rename menu items for each language. Leave a field empty to use the built-in label shown in grey.</p>

      <nav aria-label="Language" className="mt-6 flex flex-wrap gap-2">
        {locales.map((l) => (
          <Link
            key={l.code}
            href={`/admin/navigation?locale=${l.code}`}
            aria-current={l.code === locale ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 ${
              l.code === locale ? "bg-brand text-white ring-brand" : "bg-white text-slate-700 ring-slate-200 hover:ring-brand"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        <NavForm key={locale} locale={locale} groups={groups} />
      </div>
    </div>
  );
}
