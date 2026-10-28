import { renameAdminAction, setAdminActiveAction } from "@/app/admin/user-actions";
import { adminsCollection, requireAdmin } from "@/lib/auth";
import { ChangeOwnPasswordForm, CreateAdminForm, ResetPasswordForm } from "./forms";

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  const admins = await (await adminsCollection())
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ active: -1, name: 1 })
    .toArray();
  const activeCount = admins.filter((a) => a.active !== false).length;

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Admin users</h1>
        <p className="mt-1 text-sm text-slate-500">Everyone listed here can sign in to the admin panel.</p>
      </div>

      <section className="overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-200">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Last sign-in</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {admins.map((a) => {
              const id = a._id.toString();
              const isMe = id === session.id;
              const active = a.active !== false;
              const canDeactivate = active && !isMe && activeCount > 1;
              return (
                <tr key={id} className={active ? "" : "bg-slate-50 text-slate-400"}>
                  <td className="px-4 py-3">
                    <form action={renameAdminAction.bind(null, id)} className="flex items-center gap-2">
                      <label htmlFor={`name-${id}`} className="sr-only">Name</label>
                      <input
                        id={`name-${id}`}
                        name="name"
                        defaultValue={a.name}
                        className="w-40 rounded border border-transparent px-1.5 py-1 hover:border-slate-300 focus:border-brand focus:outline-none"
                      />
                      <button type="submit" className="text-xs text-brand hover:underline">Save</button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    {a.email}
                    {isMe && <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">You</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {a.lastLoginAt ? a.lastLoginAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                      {active ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-4">
                      {!isMe && active && <ResetPasswordForm id={id} />}
                      {canDeactivate && (
                        <form action={setAdminActiveAction.bind(null, id, false)}>
                          <button type="submit" className="text-sm font-semibold text-red-600 hover:underline">Deactivate</button>
                        </form>
                      )}
                      {!active && (
                        <form action={setAdminActiveAction.bind(null, id, true)}>
                          <button type="submit" className="text-sm font-semibold text-brand hover:underline">Reactivate</button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">Add an admin</h2>
        <p className="mt-1 text-sm text-slate-500">Give them a temporary password and ask them to change it after signing in.</p>
        <div className="mt-5">
          <CreateAdminForm />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-bold text-brand-dark">Change your password</h2>
        <div className="mt-5">
          <ChangeOwnPasswordForm />
        </div>
      </section>
    </div>
  );
}
