import "server-only";
import { cache } from "react";
import { getPublishedCustomForms } from "@/lib/custom-forms-repo";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";
import { getDictionary, type Dictionary, type Locale, type NavItem } from "@/lib/i18n";
import { getT } from "@/lib/translate";

// Menu label overrides per language, stored in `content` as { key: "nav:<locale>", value: { [field]: label } }.
// Field ids: "chrome:<key>" for top-bar/tab labels, "<menu>:<href>" for menu items.

export const chromeKeys = ["forJobSeekers", "forEmployers", "resources"] as const;
export const menus = ["seekerNav", "seekerResources", "employerNav", "employerResources"] as const;
export type Menu = (typeof menus)[number];

export const menuLabels: Record<Menu, string> = {
  seekerNav: "Job seeker menu",
  seekerResources: "Job seeker “Resources” dropdown",
  employerNav: "Employer menu",
  employerResources: "Employer “Resources” dropdown",
};

export type NavOverrides = Record<string, string>;

type Doc = { key: string; value: NavOverrides; updatedAt: Date; updatedBy?: string };

async function col() {
  return (await getDb()).collection<Doc>(collections.content);
}

export const getNavOverrides = cache(async (locale: Locale): Promise<NavOverrides> => {
  try {
    const doc = await (await col()).findOne({ key: `nav:${locale}` });
    return doc?.value ?? {};
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return {};
    throw error;
  }
});

export async function saveNavOverrides(locale: Locale, value: NavOverrides, updatedBy: string) {
  await (await col()).updateOne(
    { key: `nav:${locale}` },
    { $set: { key: `nav:${locale}`, value, updatedAt: new Date(), updatedBy } },
    { upsert: true },
  );
}

/** Inserts links right after the item with `href` (or at the end when it isn't there). */
function insertAfter(items: NavItem[], href: string, extra: NavItem[]) {
  const i = items.findIndex((item) => item.href === href);
  return i < 0 ? [...items, ...extra] : [...items.slice(0, i + 1), ...extra, ...items.slice(i + 1)];
}

/** Dictionary for a locale with any admin label overrides applied, plus links to forms published in Admin → Forms. */
export async function getLocalizedDictionary(locale: Locale): Promise<Dictionary> {
  const base = getDictionary(locale);
  const [o, forms, t] = await Promise.all([getNavOverrides(locale), getPublishedCustomForms(), getT()]);
  const dict: Dictionary = { ...base };
  for (const k of chromeKeys) if (o[`chrome:${k}`]) dict[k] = o[`chrome:${k}`];
  for (const m of menus) dict[m] = base[m].map((item) => ({ ...item, label: o[`${m}:${item.href}`] || item.label }));

  // Published forms sit next to the air ticket booking link in the job seeker "Resources" menu and the footer.
  const formLinks = forms.map((f) => ({ href: `/apply/${f.slug}`, label: t(f.title) }));
  if (formLinks.length > 0) {
    dict.seekerResources = insertAfter(dict.seekerResources, "/air-ticket-booking", formLinks);
    dict.footer = {
      ...dict.footer,
      columns: dict.footer.columns.map((col) =>
        col.links.some((l) => l.href === "/air-ticket-booking") ? { ...col, links: insertAfter(col.links, "/air-ticket-booking", formLinks) } : col,
      ),
    };
  }
  return dict;
}
