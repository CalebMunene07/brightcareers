import "server-only";
import { randomUUID } from "node:crypto";
import { generateText, Output } from "ai";
import { z } from "zod";
import { aiModel } from "@/lib/ai";
import { getSettings, type Settings } from "@/lib/settings";

// Machine-translation back ends. Pick one with TRANSLATOR=azure|google|ai, or leave it unset
// to use the first one that has credentials (Azure, then Google, then AI).
// Each takes English strings and returns them translated, in the same order.

export type TargetLocale = "fr" | "pt" | "sw";
export type Translator = { name: string; translate: (texts: string[], to: TargetLocale) => Promise<string[]> };

/* ---------- Microsoft Azure AI Translator (free tier: 2M characters/month) ---------- */

const azure = (s: Settings): Translator => ({
  name: "Azure Translator",
  async translate(texts, to) {
    const region = s.azureTranslatorRegion;
    const res = await fetch(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${to}&textType=plain`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": s.azureTranslatorKey,
        ...(region ? { "Ocp-Apim-Subscription-Region": region } : {}),
        "Content-Type": "application/json",
        "X-ClientTraceId": randomUUID(),
      },
      body: JSON.stringify(texts.map((Text) => ({ Text }))),
    });
    if (!res.ok) throw new Error(`Azure Translator ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { translations: { text: string }[] }[];
    return data.map((d) => d.translations[0]?.text ?? "");
  },
});

/* ---------- Google Cloud Translation (Basic v2) ---------- */

const google = (s: Settings): Translator => ({
  name: "Google Translate",
  async translate(texts, to) {
    const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(s.googleTranslateApiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: texts, source: "en", target: to, format: "text" }),
    });
    if (!res.ok) throw new Error(`Google Translate ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { data: { translations: { translatedText: string }[] } };
    return data.data.translations.map((t) => t.translatedText);
  },
});

/* ---------- AI via the Vercel AI Gateway ---------- */

const languageNames: Record<TargetLocale, string> = {
  fr: "French",
  pt: "Portuguese (as used in Mozambique and Angola)",
  sw: "Swahili",
};

const ai = (): Translator => ({
  name: "AI (AI Gateway)",
  async translate(texts, to) {
    const { output } = await generateText({
      model: await aiModel("translate"),
      instructions: `You translate website text for a recruitment company from English into ${languageNames[to]}.
Keep the meaning, tone and formatting (line breaks). Keep {placeholders}, URLs, email addresses, numbers and brand names
(Bridge Careers Global, Bridge Staffing, Bridge Professionals, Bridge Academy) unchanged.`,
      prompt: `Translate each string. Return the translations in the same order.\n\n${JSON.stringify(texts)}`,
      output: Output.array({ element: z.string(), minItems: texts.length, maxItems: texts.length }),
    });
    return output;
  },
});

export async function activeTranslator(): Promise<Translator | null> {
  const s = await getSettings();
  const choice = s.translator?.toLowerCase();
  const available = {
    azure: !!s.azureTranslatorKey,
    google: !!s.googleTranslateApiKey,
    ai: !!(s.aiGatewayApiKey || process.env.VERCEL_OIDC_TOKEN),
  };
  const make = { azure: () => azure(s), google: () => google(s), ai };
  if (choice === "azure" || choice === "google" || choice === "ai") return available[choice] ? make[choice]() : null;
  if (available.azure) return azure(s);
  if (available.google) return google(s);
  if (available.ai) return ai();
  return null;
}
