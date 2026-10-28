"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { changeOwnPasswordAction, createAdminAction, resetAdminPasswordAction } from "@/app/admin/user-actions";

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const initial: ActionState = { ok: false, message: "" };

function Status({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p role="status" className={`text-sm font-medium ${state.ok ? "text-emerald-700" : "text-red-600"}`}>
      {state.message}
    </p>
  );
}

export function CreateAdminForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ActionState, FormData>(createAdminAction, initial);
  // Clear the form after a successful save (works with or without JavaScript).
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);
  const err = (k: string) => (state.errors?.[k] ? <p className="mt-1 text-xs text-red-600">{state.errors[k]}</p> : null);

  return (
    <form ref={ref} action={action} className="grid gap-4 sm:grid-cols-3">
      <div>
        <label htmlFor="new-name" className="text-sm font-medium">Name</label>
        <input id="new-name" name="name" className={input} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="new-email" className="text-sm font-medium">Email</label>
        <input id="new-email" name="email" type="email" autoComplete="off" className={input} />
        {err("email")}
      </div>
      <div>
        <label htmlFor="new-password" className="text-sm font-medium">Temporary password</label>
        <input id="new-password" name="password" type="password" autoComplete="new-password" className={input} />
        {err("password")}
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-3">
        <button type="submit" disabled={pending} className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Creating…" : "Add admin"}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}

export function ResetPasswordForm({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ActionState, FormData>(resetAdminPasswordAction, initial);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm font-semibold text-brand hover:underline">
        Reset password
      </button>
    );
  }
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <label htmlFor={`pw-${id}`} className="sr-only">New password</label>
      <input
        id={`pw-${id}`}
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="New password"
        className="w-44 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
      />
      <button type="submit" disabled={pending} className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">
        Save
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-500">Cancel</button>
      <Status state={state} />
    </form>
  );
}

export function ChangeOwnPasswordForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ActionState, FormData>(changeOwnPasswordAction, initial);
  // Clear the form after a successful save (works with or without JavaScript).
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="grid gap-4 sm:grid-cols-3">
      <div>
        <label htmlFor="cur" className="text-sm font-medium">Current password</label>
        <input id="cur" name="current" type="password" autoComplete="current-password" className={input} />
      </div>
      <div>
        <label htmlFor="next" className="text-sm font-medium">New password</label>
        <input id="next" name="next" type="password" autoComplete="new-password" className={input} />
      </div>
      <div>
        <label htmlFor="confirm" className="text-sm font-medium">Repeat new password</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" className={input} />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-3">
        <button type="submit" disabled={pending} className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Saving…" : "Change password"}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}
