"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav({ items }: { items: { href: string; label: string; badge?: number }[] }) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
              {item.badge ? (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-brand-dark">{item.badge}</span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
