import "server-only";
import { ObjectId, type WithId } from "mongodb";
import { cache } from "react";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";
import type { CustomField } from "@/lib/forms";
import type { Fee } from "@/lib/pricing";

// Application forms admins create in Admin → Forms (e.g. visit visa, tourist visa), each with its own fields and fees.
// Every form starts with a name and an email (each can be made optional); the rest are custom fields.
// Published forms live at /apply/<slug>; submissions go to the "Other applications" inbox.

export type CustomForm = {
  id?: string;
  slug: string;
  title: string;
  intro: string;
  published: boolean;
  fields: CustomField[];
  nameRequired: boolean;
  emailRequired: boolean;
  fees: Fee[];
  /** Ask for a preferred payment method (only when the form has fees). */
  askPayment: boolean;
  /** Shown beside the fees. Empty uses the instructions from Pricing & payment. */
  paymentInstructions: string;
  success: string;
  order: number;
};

type Doc = Omit<CustomForm, "id"> & { createdAt?: Date; updatedAt?: Date; updatedBy?: string };

function toForm(d: WithId<Doc>): CustomForm {
  return {
    id: d._id.toString(),
    slug: d.slug,
    title: d.title,
    intro: d.intro ?? "",
    published: d.published ?? false,
    fields: d.fields ?? [],
    nameRequired: d.nameRequired ?? true,
    emailRequired: d.emailRequired ?? true,
    fees: d.fees ?? [],
    askPayment: d.askPayment ?? true,
    paymentInstructions: d.paymentInstructions ?? "",
    success: d.success ?? "",
    order: d.order ?? 0,
  };
}

async function col() {
  return (await getDb()).collection<Doc>(collections.customForms);
}

export function feesTotal(form: Pick<CustomForm, "fees">) {
  return form.fees.reduce((sum, f) => sum + f.amount, 0);
}

export async function getAllCustomForms(): Promise<CustomForm[]> {
  return (await (await col()).find().sort({ order: 1, title: 1 }).toArray()).map(toForm);
}

export const getPublishedCustomForms = cache(async (): Promise<CustomForm[]> => {
  try {
    return (await (await col()).find({ published: true }).sort({ order: 1, title: 1 }).toArray()).map(toForm);
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return [];
    throw error;
  }
});

export async function getPublishedCustomForm(slug: string) {
  return (await getPublishedCustomForms()).find((f) => f.slug === slug);
}

export async function getCustomFormById(id: string) {
  if (!ObjectId.isValid(id)) return undefined;
  const doc = await (await col()).findOne({ _id: new ObjectId(id) });
  return doc ? toForm(doc) : undefined;
}

export async function customFormSlugTaken(slug: string, exceptId?: string) {
  const doc = await (await col()).findOne({ slug }, { projection: { _id: 1 } });
  return !!doc && doc._id.toString() !== exceptId;
}

/** Creates or updates a form. Returns its id. */
export async function saveCustomForm(form: CustomForm, updatedBy: string) {
  const { id, ...data } = form;
  const c = await col();
  if (id) {
    await c.updateOne({ _id: new ObjectId(id) }, { $set: { ...data, updatedAt: new Date(), updatedBy } });
    return id;
  }
  const { insertedId } = await c.insertOne({ ...data, createdAt: new Date(), updatedAt: new Date(), updatedBy });
  return insertedId.toString();
}

export async function deleteCustomForm(id: string) {
  if (ObjectId.isValid(id)) await (await col()).deleteOne({ _id: new ObjectId(id) });
}
