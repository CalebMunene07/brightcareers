import "server-only";
import { cache } from "react";
import { collections, DatabaseNotConfiguredError, getDb } from "@/lib/db";
import { emptySettings, getFormDef, resolveLayout, type FormId, type FormLayout, type FormSettings } from "@/lib/forms";

// Field settings per form, stored in `content` as { key: "form:<id>", value: FormSettings }.

type Doc = { key: string; value: FormSettings; updatedAt: Date; updatedBy?: string };

async function col() {
  return (await getDb()).collection<Doc>(collections.content);
}

export const getFormSettings = cache(async (id: FormId): Promise<FormSettings> => {
  try {
    const doc = await (await col()).findOne({ key: `form:${id}` });
    return { fields: doc?.value?.fields ?? {}, custom: doc?.value?.custom ?? [] };
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return emptySettings;
    throw error;
  }
});

export async function getFormLayout(id: FormId): Promise<FormLayout> {
  return resolveLayout(getFormDef(id)!, await getFormSettings(id));
}

export async function saveFormSettings(id: FormId, value: FormSettings, updatedBy: string) {
  await (await col()).updateOne(
    { key: `form:${id}` },
    { $set: { key: `form:${id}`, value, updatedAt: new Date(), updatedBy } },
    { upsert: true },
  );
}
