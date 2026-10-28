import { ObjectId } from "mongodb";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteSubmission, updateSubmissionStatus } from "@/app/admin/actions";
import { ConfirmButton } from "@/app/admin/(panel)/confirm-button";
import { CvPreview } from "@/components/cv/cv-preview";
import { requireAdmin } from "@/lib/auth";
import type { CvData } from "@/lib/cv";
import { getDb } from "@/lib/db";
import { customFiles, getInboxType, getPath, statuses, withoutFileData, type CustomAnswer } from "@/lib/inbox";

function formatBytes(n: number) {
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
}

export default async function InboxDetailPage({ params }: PageProps<"/admin/inbox/[type]/[id]">) {
  await requireAdmin();
  const { type, id } = await params;
  const inbox = getInboxType(type);
  if (!inbox || !ObjectId.isValid(id)) notFound();

  const db = await getDb();
  const doc = await db.collection(inbox.collection).findOne({ _id: new ObjectId(id) }, { projection: withoutFileData(inbox) });
  if (!doc) notFound();

  const files = [
    ...(inbox.files ?? []).map((f) => ({ ...f, file: getPath(doc, f.path) as { name?: string; size?: number } | undefined })),
    ...customFiles(doc).map((f) => ({ path: `extra.${f.key}`, label: f.label, file: f.file })),
  ];
  const answers = Array.isArray(doc.answers) ? (doc.answers as CustomAnswer[]) : [];
  const builtCv = inbox.key === "cvs" ? (doc.cv as CvData | undefined) : undefined;

  return (
    <div className="mx-auto max-w-5xl">
      <Link href={`/admin/inbox/${inbox.key}`} className="text-sm text-slate-500 hover:text-brand">← {inbox.label}</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">{String(doc[inbox.columns[0].field] ?? "") || inbox.singular}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Received {doc.createdAt instanceof Date ? doc.createdAt.toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" }) : "—"}
          </p>
        </div>
        <ConfirmButton action={deleteSubmission.bind(null, inbox.key, id)} label="Delete" confirmLabel="Yes, delete permanently" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-600">Status:</span>
        {statuses.map((s) => (
          <form key={s.id} action={updateSubmissionStatus.bind(null, inbox.key, id, s.id)}>
            <button
              type="submit"
              aria-pressed={doc.status === s.id}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ${
                doc.status === s.id ? "bg-brand text-white ring-brand" : "bg-white text-slate-700 ring-slate-200 hover:ring-brand"
              }`}
            >
              {s.label}
            </button>
          </form>
        ))}
      </div>

      <dl className="mt-6 divide-y divide-slate-100 rounded-2xl bg-white ring-1 ring-slate-200">
        {inbox.detail.map((f) => {
          const raw = doc[f.field];
          const value = raw instanceof Date ? raw.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : String(raw ?? "");
          return (
            <div key={f.field} className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr]">
              <dt className="text-sm font-medium text-slate-500">{f.label}</dt>
              <dd className={`text-sm text-slate-900 ${f.long ? "whitespace-pre-wrap" : ""}`}>
                {f.field === "email" && value ? (
                  <a href={`mailto:${value}`} className="text-brand hover:underline">{value}</a>
                ) : f.field === "phone" && value ? (
                  <a href={`tel:${value.replace(/\s/g, "")}`} className="text-brand hover:underline">{value}</a>
                ) : f.field === "job" && inbox.key === "applications" && value ? (
                  <Link href={`/jobs/${value}`} target="_blank" className="text-brand hover:underline">{value} ↗</Link>
                ) : (
                  value || <span className="text-slate-400">—</span>
                )}
              </dd>
            </div>
          );
        })}
        {answers.map((a) => (
          <div key={a.key} className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr]">
            <dt className="text-sm font-medium text-slate-500">{a.label}</dt>
            <dd className="whitespace-pre-wrap text-sm text-slate-900">{a.value}</dd>
          </div>
        ))}
        {files.map(({ path, label, file }) => (
          <div key={path} className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr]">
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd>
              {file?.name ? (
                <a
                  href={`/admin/files/${inbox.key}/${id}/${path.split(".").join("/")}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand/20"
                >
                  Download {file.name}
                  {file.size ? <span className="font-normal text-slate-500">({formatBytes(file.size)})</span> : null}
                </a>
              ) : (
                <span className="text-sm text-slate-400">—</span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {builtCv && (
        <section className="mt-8">
          <h2 className="font-bold text-brand-dark">CV preview</h2>
          <div className="cv-scale-wrap mt-4 max-w-[640px] overflow-hidden rounded-lg shadow-lg ring-1 ring-slate-200">
            <CvPreview cv={builtCv} />
          </div>
        </section>
      )}
    </div>
  );
}
