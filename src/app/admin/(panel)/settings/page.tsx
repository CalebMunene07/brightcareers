import { requireAdmin } from "@/lib/auth";
import { getSettingsForAdmin, settingSections } from "@/lib/settings";
import { SettingsForm } from "./settings-form";
import { ThemeForm } from "./theme-form";

export default async function SettingsPage() {
  await requireAdmin();
  const states = await getSettingsForAdmin();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Brand colours and credentials for the services the website uses. Passwords and keys are encrypted before they&apos;re stored and are never shown again
          after saving. Values from the server&apos;s <code>.env</code> file are used until you save your own here.
        </p>
      </div>

      <nav aria-label="Sections" className="flex flex-wrap gap-2 text-sm">
        {settingSections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-700 ring-1 ring-slate-200 hover:ring-brand">
            {s.title}
          </a>
        ))}
      </nav>

      {settingSections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <h2 className="font-bold text-brand-dark">{section.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{section.description}</p>
          <div className="mt-5">
            {section.id === "branding" ? (
              <ThemeForm fields={section.fields} states={Object.fromEntries(section.fields.map((f) => [f.key, states[f.key]]))} />
            ) : (
              <SettingsForm
                sectionId={section.id}
                fields={section.fields}
                states={Object.fromEntries(section.fields.map((f) => [f.key, states[f.key]]))}
                testable={section.id !== "security"}
              />
            )}
          </div>
        </section>
      ))}

      <section className="rounded-2xl bg-slate-100 p-6 text-sm text-slate-600">
        <h2 className="font-semibold text-slate-800">Kept in the server environment</h2>
        <p className="mt-1">
          <code>MONGODB_URI</code> (where these settings are stored) and <code>AUTH_SECRET</code> (signs admin sign-ins and encrypts the
          values above) can&apos;t be edited here. If you change <code>AUTH_SECRET</code>, re-enter the passwords and keys on this page.
        </p>
      </section>
    </div>
  );
}
