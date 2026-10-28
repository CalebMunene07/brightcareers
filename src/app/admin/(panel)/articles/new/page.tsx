import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAudience, isAudience } from "@/lib/articles";
import { listAllImages } from "@/lib/media";
import { ArticleForm } from "../article-form";

export default async function NewArticlePage({ searchParams }: PageProps<"/admin/articles/new">) {
  await requireAdmin();
  const sp = await searchParams;
  const audience = typeof sp.audience === "string" && isAudience(sp.audience) ? sp.audience : "jobseekers";
  const images = await listAllImages();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href={`/admin/articles?audience=${audience}`} className="text-sm text-slate-500 hover:text-brand">← Articles</Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-dark">New {getAudience(audience).label.toLowerCase().replace(/s$/, "")}</h1>
      <div className="mt-6">
        <ArticleForm audience={audience} images={images} />
      </div>
    </div>
  );
}
