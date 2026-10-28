"use server";

import { generateText } from "ai";
import { headers } from "next/headers";
import { aiEnabled, aiModel } from "@/lib/ai";
import { collections, getDb } from "@/lib/db";
import { getLocale, getT } from "@/lib/translate";

// AI writing help for the public CV maker, via the Vercel AI Gateway.
// Rate-limited per IP because every call costs money.

const MAX_INPUT = 3000;
const HOURLY_LIMIT = 20;

export type AiKind = "summary" | "bullets";
export type AiResult = { ok: true; text: string } | { ok: false; message: string };

const SYSTEM = `You help job seekers improve the wording of their CV.
Rules:
- Use only facts present in the input. Never invent employers, dates, numbers, qualifications or achievements.
- Plain, confident, professional language. No buzzwords, no first person ("I"), no emojis, no markdown.
- Reply with the rewritten text only, nothing else.`;

async function withinLimit() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  const col = (await getDb()).collection<{ key: string; createdAt: Date }>(collections.aiUsage);
  await col.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 }).catch(() => {});
  const used = await col.countDocuments({ key: `ip:${ip}`, createdAt: { $gte: new Date(Date.now() - 3600_000) } });
  if (used >= HOURLY_LIMIT) return false;
  await col.insertOne({ key: `ip:${ip}`, createdAt: new Date() });
  return true;
}

function clean(s: unknown, max = MAX_INPUT) {
  return typeof s === "string" ? s.trim().slice(0, max) : "";
}

const writeIn: Record<string, string> = {
  en: "English",
  fr: "French",
  pt: "Portuguese",
  sw: "Swahili",
};

export async function improveCvText(
  kind: AiKind,
  input: { text?: string; title?: string; role?: string; skills?: string[]; roles?: string[] },
): Promise<AiResult> {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const res = await improveCvTextImpl(kind, input, writeIn[locale] ?? "English");
  return res.ok ? res : { ok: false, message: t(res.message) };
}

async function improveCvTextImpl(
  kind: AiKind,
  input: { text?: string; title?: string; role?: string; skills?: string[]; roles?: string[] },
  language: string,
): Promise<AiResult> {
  if (!(await aiEnabled())) return { ok: false, message: "AI help isn't available right now." };

  const text = clean(input.text);
  const title = clean(input.title, 120);
  const role = clean(input.role, 120);
  const skills = (input.skills ?? []).map((s) => clean(s, 60)).filter(Boolean).slice(0, 20);
  const roles = (input.roles ?? []).map((r) => clean(r, 120)).filter(Boolean).slice(0, 10);

  let prompt: string;
  if (kind === "summary") {
    if (!text && !title && roles.length === 0) {
      return { ok: false, message: "Add your job title or some experience first, so there's something to work from." };
    }
    prompt = text
      ? `Rewrite this CV profile summary as 2-3 clear sentences.\n\nTarget job title: ${title || "not given"}\nSkills: ${skills.join(", ") || "not given"}\n\nCurrent summary:\n${text}`
      : `Write a 2-3 sentence CV profile summary from these details only.\n\nTarget job title: ${title || "not given"}\nPrevious roles: ${roles.join("; ") || "not given"}\nSkills: ${skills.join(", ") || "not given"}`;
  } else {
    if (!text) return { ok: false, message: "Write a few notes about this job first, then ask AI to polish them." };
    prompt = `Rewrite these notes as 3-5 strong CV bullet points for the role "${role || "this job"}". Start each with an action verb. Keep any numbers that are given. Put each bullet on its own line with no bullet symbols.\n\nNotes:\n${text}`;
  }

  try {
    if (!(await withinLimit())) return { ok: false, message: "You've used AI help a lot in the last hour. Please try again later." };
    const { text: out } = await generateText({
      model: await aiModel("cv"),
      instructions: `${SYSTEM}\n- Write the result in ${language}.`,
      prompt,
      maxOutputTokens: 400,
    });
    const result = out
      .split("\n")
      .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
      .filter(Boolean)
      .join(kind === "bullets" ? "\n" : " ")
      .replace(/^"|"$/g, "");
    return result ? { ok: true, text: result } : { ok: false, message: "The AI didn't return anything. Please try again." };
  } catch (error) {
    console.error("[cv-ai] generation failed", error);
    return { ok: false, message: "AI help is temporarily unavailable. Please try again." };
  }
}
