import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { resolveAssistantIntent } from "@/lib/ai/intent-router";
import { getWorkersAiModel, hasWorkersAi, runWorkersAiText } from "@/lib/server/cloudflareAi";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let payload: { text?: string; service?: string };

  try {
    payload = (await request.json()) as { text?: string; service?: string };
  } catch {
    return Response.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const text = payload.text?.trim() ?? "";
  if (!text) {
    return Response.json({ success: false, error: "text is required." }, { status: 400 });
  }

  const intent = resolveAssistantIntent(text, payload.service ?? "mail");
  let aiNote: unknown = null;

  if (hasWorkersAi(env)) {
    aiNote = await runWorkersAiText(
      env,
      [
        "You are AIBOUX Intent Router. Return one short Japanese sentence validating the detected intent.",
        `Detected intent: ${intent.intent}`,
        `User utterance: ${text}`,
      ].join("\n"),
      { maxTokens: 80, temperature: 0 },
    );
  }

  return Response.json({
    success: true,
    provider: hasWorkersAi(env) ? "cloudflare-workers-ai" : "deterministic-only",
    model: getWorkersAiModel(env),
    intent,
    aiNote,
  });
};
