import "server-only";
import { createGateway, gateway, type LanguageModel } from "ai";
import { getSettings } from "@/lib/settings";

// AI features use the Vercel AI Gateway. The key comes from Admin → Settings (or AI_GATEWAY_API_KEY);
// on Vercel, the deployment's OIDC token works without a key.

export const DEFAULT_AI_MODEL = "anthropic/claude-haiku-4.5";

export async function aiEnabled() {
  return !!((await getSettings()).aiGatewayApiKey || process.env.VERCEL_OIDC_TOKEN);
}

/** A gateway model for the given purpose, using the saved key when there is one. */
export async function aiModel(purpose: "cv" | "translate"): Promise<LanguageModel> {
  const s = await getSettings();
  const id = (purpose === "cv" ? s.cvAiModel : s.translateAiModel) || DEFAULT_AI_MODEL;
  return s.aiGatewayApiKey ? createGateway({ apiKey: s.aiGatewayApiKey })(id) : gateway(id);
}
