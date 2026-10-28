import Link from "next/link";
import { getT } from "@/lib/translate";

export default async function NotFound() {
  const t = await getT();
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-3xl font-bold text-brand-dark">{t("Page not found")}</h1>
      <p className="mt-3 text-slate-600">{t("The page you're looking for doesn't exist or has moved.")}</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
          {t("Go home")}
        </Link>
        <Link href="/jobs" className="rounded-full border border-brand px-6 py-3 text-sm font-semibold text-brand">
          {t("Browse jobs")}
        </Link>
      </div>
    </section>
  );
}
