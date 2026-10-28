"use client";

import { usePathname } from "next/navigation";

// Public header/footer wrap every page except the admin area, which has its own shell.
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const isAdmin = usePathname().startsWith("/admin");
  if (isAdmin) return <>{children}</>;

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
