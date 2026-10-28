import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { Logo } from "@/components/logo";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { inboxTypes } from "@/lib/inbox";
import { AdminNav } from "./admin-nav";

export const metadata: Metadata = {
  title: "Admin | Bridge Careers Global",
  robots: { index: false, follow: false },
};

async function newCounts() {
  try {
    const db = await getDb();
    const counts = await Promise.all(
      inboxTypes.map((t) => db.collection(t.collection).countDocuments({ status: "new" })),
    );
    return Object.fromEntries(inboxTypes.map((t, i) => [t.key, counts[i]]));
  } catch {
    return {} as Record<string, number>;
  }
}

export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  const session = await requireAdmin();
  const counts = await newCounts();

  const nav = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/jobs", label: "Jobs" },
    { href: "/admin/heroes", label: "Page heroes" },
    { href: "/admin/services", label: "Services" },
    { href: "/admin/industries", label: "Industries" },
    { href: "/admin/locations", label: "Locations" },
    { href: "/admin/forms", label: "Forms" },
    { href: "/admin/content", label: "Site content" },
    { href: "/admin/articles", label: "Articles" },
    { href: "/admin/media", label: "Media" },
    { href: "/admin/legal", label: "Legal pages" },
    { href: "/admin/navigation", label: "Menu labels" },
    { href: "/admin/translations", label: "Translations" },
    ...inboxTypes.map((t) => ({ href: `/admin/inbox/${t.key}`, label: t.label, badge: counts[t.key] })),
    { href: "/admin/privacy", label: "Privacy & data" },
    { href: "/admin/users", label: "Admin users" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col bg-brand-dark p-5 md:flex">
        <Logo light />
        <nav aria-label="Admin" className="mt-10 flex-1">
          <AdminNav items={nav} />
        </nav>
        <div className="border-t border-white/10 pt-4 text-sm text-slate-300">
          <p className="truncate font-medium text-white">{session.name}</p>
          <p className="truncate text-xs">{session.email}</p>
          <div className="mt-3 flex gap-3">
            <Link href="/" className="text-xs hover:text-white">View site ↗</Link>
            <form action={logout}>
              <button type="submit" className="text-xs hover:text-white">Sign out</button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between bg-brand-dark px-4 py-3 md:hidden">
          <Logo light />
          <form action={logout}>
            <button type="submit" className="text-sm text-white">Sign out</button>
          </form>
        </div>
        <nav aria-label="Admin mobile" className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 md:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
              {n.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
