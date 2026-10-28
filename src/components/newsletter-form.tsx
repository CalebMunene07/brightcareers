"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/actions";

export function NewsletterForm({
  label,
  placeholder,
  submit,
}: {
  label: string;
  placeholder: string;
  submit: string;
}) {
  const [state, action, pending] = useActionState(subscribeNewsletter, { ok: false, message: "" });

  if (state.ok) {
    return <p role="status" className="mt-6 text-sm font-semibold text-accent">{state.message}</p>;
  }

  return (
    <form action={action} className="mt-6 max-w-sm" noValidate>
      <div className="flex gap-2">
        <label htmlFor="newsletter" className="sr-only">{label}</label>
        <input
          id="newsletter"
          name="email"
          type="email"
          required
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-brand-dark transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submit}
        </button>
      </div>
      {state.message && (
        <p role="alert" className="mt-2 text-xs text-red-300">
          {state.errors?.email ?? state.message}
        </p>
      )}
    </form>
  );
}
