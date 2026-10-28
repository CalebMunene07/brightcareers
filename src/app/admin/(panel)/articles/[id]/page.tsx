import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteArticleAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/app/admin/(panel)/confirm-button";
import { requireAdmin } from "@/lib/auth";
import { getAudience } from "@/lib/articles";
import { getArticleById } from "@/lib/articles-repo";
import { listAllImages } from "@/lib/media";
import { ArticleForm } from "../article-form";

export default async function EditArticlePage({ params }: PageProps<"/admin/articles/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [article, images] = await Promise.all([getArticleById(id), listAllImages()]);
  if (!article) notFound();
  const a = getAudience(article.audience);

  return (
    <div className="mx-auto max-w-4xl">
      <Link href={`/admin/articles?audience=${article.audience}`} className="text-sm text-slate-500 hover:text-brand">← {a.label}</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-brand-dark">{article.title}</h1>
        <div className="flex items-center gap-3">
          {article.published && (
            <Link href={`${a.basePath}/${article.slug}`} target="_blank" className="text-sm font-semibold text-brand hover:underline">
              View on site ↗
            </Link>
          )}
          <ConfirmButton action={deleteArticleAction.bind(null, id, article.audience)} label="Delete" confirmLabel="Yes, delete this article" />
        </div>
      </div>
      <div className="mt-6">
        <ArticleForm audience={article.audience} article={article} images={images} />
      </div>
    </div>
  );
}
