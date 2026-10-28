"use client";

import { useActionState, useEffect, useRef } from "react";
import { uploadImageAction, type ActionState } from "@/app/admin/actions";

export function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ActionState, FormData>(uploadImageAction, { ok: false, message: "" });
  // Clear the form after a successful save (works with or without JavaScript).
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:flex-row sm:items-center">
      <label htmlFor="files" className="sr-only">Images</label>
      <input
        id="files"
        name="files"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="min-w-0 flex-1 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand"
      />
      <button type="submit" disabled={pending} className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
        {pending ? "Uploading…" : "Upload"}
      </button>
      {state.message && (
        <p role="status" className={`text-sm font-medium ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</p>
      )}
    </form>
  );
}
