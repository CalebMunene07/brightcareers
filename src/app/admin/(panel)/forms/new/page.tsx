import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { CustomFormEditor } from "../custom-form-editor";

export default async function NewFormPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/forms" className="text-sm text-slate-500 hover:text-brand">← Forms</Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-dark">New form</h1>
      <p className="mt-1 text-sm text-slate-500">For example a visit visa or tourist visa application, with its own questions and fees.</p>
      <div className="mt-6">
        <CustomFormEditor />
      </div>
    </div>
  );
}
