import Link from "next/link";
import { notFound } from "next/navigation";
import { resetContentAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/app/admin/(panel)/confirm-button";
import { requireAdmin } from "@/lib/auth";
import { contentDefs, getContent, getContentMeta, isContentKey } from "@/lib/site-content";
import { listAllImages } from "@/lib/media";
import { emailConfigured } from "@/lib/notify";
import { ContentEditor } from "../content-editor";
import { TestEmailButton } from "../test-email-button";

export default async function ContentKeyPage({ params, searchParams }: PageProps<"/admin/content/[key]">) {
  await requireAdmin();
  const { key } = await params;
  if (!isContentKey(key)) notFound();
  const { reset } = await searchParams;

  const def = contentDefs[key];
  const needsImages = (def.fields as { type?: string }[]).some((f) => f.type === "image");
  const [value, meta, images, smtpReady] = await Promise.all([
    getContent(key),
    getContentMeta(key),
    needsImages ? listAllImages() : [],
    key === "notifications" ? emailConfigured() : false,
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/content" className="text-sm text-slate-500 hover:text-brand">← Site content</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">{def.label}</h1>
          <p className="mt-1 text-sm text-slate-500">{def.description}</p>
          <p className="mt-2 text-xs text-slate-400">
            Shown on:{" "}
            {def.usedOn.map((p, i) => (
              <span key={p}>
                {i > 0 && ", "}
                <Link href={p} target="_blank" className="text-brand hover:underline">{p}</Link>
              </span>
            ))}
          </p>
        </div>
        {meta && (
          <ConfirmButton action={resetContentAction.bind(null, key)} label="Reset to default" confirmLabel="Yes, discard my edits" />
        )}
      </div>

      {reset === "1" && (
        <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          Reset to the default text.
        </p>
      )}

      {key === "notifications" && (
        <div className={`mt-6 rounded-xl p-4 text-sm ring-1 ${smtpReady ? "bg-emerald-50 text-emerald-900 ring-emerald-200" : "bg-amber-50 text-amber-900 ring-amber-200"}`}>
          {smtpReady ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>SMTP is configured. Save your recipients, then send a test.</span>
              <TestEmailButton />
            </div>
          ) : (
            <span>
              Email sending isn&apos;t configured yet. Add your SMTP details in{" "}
              <Link href="/admin/settings#email" className="font-semibold underline">Settings → Email</Link>. Submissions are still saved in the inbox.
            </span>
          )}
        </div>
      )}

      <div className="mt-6">
        <ContentEditor
          key={meta?.updatedAt?.toISOString() ?? "default"}
          contentKey={key}
          kind={def.kind}
          itemLabel={"itemLabel" in def ? def.itemLabel : undefined}
          fields={def.fields}
          initial={value}
          images={images}
        />
      </div>
    </div>
  );
}
