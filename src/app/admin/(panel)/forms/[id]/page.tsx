import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCustomFormAction } from "@/app/admin/form-actions";
import { ConfirmButton } from "@/app/admin/(panel)/confirm-button";
import { requireAdmin } from "@/lib/auth";
import { getCustomFormById } from "@/lib/custom-forms-repo";
import { getFormDef } from "@/lib/forms";
import { getFormSettings } from "@/lib/forms-repo";
import { BuiltInFormEditor } from "../builtin-form-editor";
import { CustomFormEditor } from "../custom-form-editor";

export default async function EditFormPage({ params, searchParams }: PageProps<"/admin/forms/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const def = getFormDef(id);

  if (def) {
    return (
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/forms" className="text-sm text-slate-500 hover:text-brand">← Forms</Link>
        <h1 className="mt-2 text-2xl font-bold text-brand-dark">{def.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {def.description} Untick “On form” to remove a field, or untick “Required” to make it optional. Fields marked “Can’t be removed” are what the form is built around, but they can still be made optional.
          Past submissions keep everything they were sent with.
        </p>
        <div className="mt-6">
          <BuiltInFormEditor def={def} settings={await getFormSettings(def.id)} />
        </div>
      </div>
    );
  }

  const form = await getCustomFormById(id);
  if (!form) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/forms" className="text-sm text-slate-500 hover:text-brand">← Forms</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">{form.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {form.published ? (
              <Link href={`/apply/${form.slug}`} target="_blank" className="text-brand hover:underline">/apply/{form.slug} ↗</Link>
            ) : (
              "Draft: not on the site yet."
            )}{" "}
            Submissions arrive in <Link href="/admin/inbox/forms" className="text-brand hover:underline">Other applications</Link>.
          </p>
        </div>
        <ConfirmButton action={deleteCustomFormAction.bind(null, form.id!)} label="Delete form" confirmLabel="Yes, delete this form" />
      </div>
      {typeof sp.created === "string" && (
        <p role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          Form created. Tick “Published” and save when it’s ready to go live.
        </p>
      )}
      <div className="mt-6">
        <CustomFormEditor key={form.id} form={form} />
      </div>
    </div>
  );
}
