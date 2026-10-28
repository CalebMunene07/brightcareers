import type { FormState } from "@/app/actions";
import { Form, type Field } from "@/components/form";
import { CUSTOM_FILE_ACCEPT, isRequired, shown, type FormLayout } from "@/lib/forms";
import { getT } from "@/lib/translate";

/** Hides, requires and adds fields as set in Admin → Forms. Custom fields go at the end. */
function applyLayout(fields: Field[], layout: FormLayout): Field[] {
  return [
    ...fields.filter((f) => shown(layout, f.name)).map((f) => ({ ...f, required: isRequired(layout, f.name) })),
    ...layout.custom.map(
      (c): Field => ({
        name: c.key,
        label: c.label,
        type: c.type,
        required: c.required,
        options: c.type === "select" ? c.options : undefined,
        accept: c.type === "file" ? CUSTOM_FILE_ACCEPT : undefined,
        hint: c.hint || undefined,
        full: c.type === "file" || c.type === "textarea",
      }),
    ),
  ];
}

// Server wrapper around <Form> that translates labels, placeholders, options and buttons.
// Option values stay in English so submissions are stored consistently.
export async function TForm({
  action,
  fields: baseFields,
  layout,
  after = [],
  submitLabel,
  hidden,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  fields: Field[];
  layout?: FormLayout;
  /** Fields placed after the custom ones, e.g. a payment choice. */
  after?: Field[];
  submitLabel: string;
  hidden?: Record<string, string>;
}) {
  const t = await getT();
  const fields = [...(layout ? applyLayout(baseFields, layout) : baseFields), ...after];
  return (
    <Form
      action={action}
      hidden={hidden}
      submitLabel={t(submitLabel)}
      ui={{ submitted: t("Submitted"), sending: t("Sending…"), select: t("Select…") }}
      fields={fields.map((f) => ({
        ...f,
        label: t(f.label),
        placeholder: f.placeholder ? t(f.placeholder) : undefined,
        hint: f.hint ? t(f.hint) : undefined,
        options: f.options?.map((o) => (typeof o === "string" ? { value: o, label: t(o) } : { value: o.value, label: t(o.label) })),
      }))}
    />
  );
}
