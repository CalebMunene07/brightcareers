"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LanguagePicker } from "@/components/language-picker";
import { Logo } from "@/components/logo";
import type { Dictionary, Locale } from "@/lib/i18n";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function useDismiss<T extends HTMLElement>(open: boolean, close: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

export function Header({ locale, t }: { locale: Locale; t: Dictionary }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const resourcesRef = useDismiss<HTMLLIElement>(resourcesOpen, () => setResourcesOpen(false));
  const searchRef = useDismiss<HTMLDivElement>(searchOpen, () => setSearchOpen(false));

  const isEmployer = pathname.startsWith("/employers");
  const navLinks = isEmployer ? t.employerNav : t.seekerNav;
  const resources = isEmployer ? t.employerResources : t.seekerResources;

  const audiences = [
    { label: t.forJobSeekers, href: "/", active: !isEmployer },
    { label: t.forEmployers, href: "/employers", active: isEmployer },
  ];

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim();
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(q ? `/jobs?q=${encodeURIComponent(q)}` : "/jobs");
  }

  const linkClass = "whitespace-nowrap text-sm xl:text-[15px] font-bold text-white transition-opacity hover:opacity-80";

  return (
    <header className="sticky top-0 z-50 shadow-sm print:hidden">
      {/* Audience tabs + language */}
      <div className="bg-slate-100">
        <div className="mx-auto flex h-8 max-w-7xl items-stretch justify-between px-4 sm:px-6 lg:px-8">
          <nav aria-label="Audience" className="flex">
            {audiences.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                aria-current={a.active ? "page" : undefined}
                className={`flex items-center px-4 text-xs font-bold transition-colors sm:px-8 sm:text-sm ${
                  a.active ? "bg-brand text-white" : "text-slate-900 hover:text-brand"
                }`}
              >
                {a.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center">
            <LanguagePicker locale={locale} label={t.language} region={t.region} />
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-brand">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Logo light />

          <nav aria-label="Main" className="hidden flex-1 lg:block">
            <ul className="flex items-center gap-5 xl:gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={`${linkClass} ${pathname === link.href ? "underline decoration-accent decoration-2 underline-offset-8" : ""}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li ref={resourcesRef} className="relative">
                <button
                  type="button"
                  aria-expanded={resourcesOpen}
                  aria-haspopup="true"
                  onClick={() => setResourcesOpen((v) => !v)}
                  className={`${linkClass} flex items-center gap-1`}
                >
                  {t.resources}
                  <Chevron open={resourcesOpen} />
                </button>
                {resourcesOpen && (
                  <ul className="absolute left-0 top-full mt-6 w-56 overflow-hidden rounded-b-xl bg-white py-2 shadow-xl ring-1 ring-slate-200">
                    {resources.map((r) => (
                      <li key={r.href}>
                        <Link
                          href={r.href}
                          onClick={() => setResourcesOpen(false)}
                          className="block px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-muted hover:text-brand"
                        >
                          {r.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          <div ref={searchRef} className="relative ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label={t.search}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-full p-2 text-white hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            {searchOpen && (
              <form
                onSubmit={onSearch}
                role="search"
                className="absolute right-0 top-full mt-4 flex w-[min(90vw,24rem)] gap-2 rounded-xl bg-white p-2 shadow-xl ring-1 ring-slate-200"
              >
                <label htmlFor="header-search" className="sr-only">{t.search}</label>
                <input
                  id="header-search"
                  name="q"
                  autoFocus
                  placeholder={t.searchPlaceholder}
                  className="min-w-0 flex-1 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none"
                />
                <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
                  {t.search}
                </button>
              </form>
            )}

            <button
              type="button"
              className="rounded-md p-2 text-white lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t.menuClose : t.menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Mobile" className="border-t border-white/15 px-4 pb-6 lg:hidden">
            <ul className="py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)} className="block py-3 font-bold text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/60">{t.resources}</p>
            <ul className="py-1">
              {resources.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} onClick={() => setMenuOpen(false)} className="block py-2.5 text-white/90">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
