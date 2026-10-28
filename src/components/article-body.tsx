import { paragraphs, type ArticleBlock } from "@/lib/articles";
import { getT } from "@/lib/translate";

// Each heading and paragraph is translated separately, so edits only re-translate what changed.
export async function ArticleBody({ body }: { body: ArticleBlock[] }) {
  const t = await getT();
  return (
    <>
      {body.map((block, i) => (
        <div key={i} className="mt-8 first:mt-0">
          {block.heading && <h2 className="text-2xl font-bold text-brand-dark">{t(block.heading)}</h2>}
          {paragraphs(block.text).map((p, j) => (
            <p key={j} className="mt-3 whitespace-pre-line text-lg leading-relaxed text-slate-700">
              {t(p)}
            </p>
          ))}
        </div>
      ))}
    </>
  );
}
