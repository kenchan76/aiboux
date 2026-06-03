export type CloudflareAiRunResult = {
  ok: boolean;
  provider: 'cloudflare-workers-ai';
  model: string;
  text: string;
  raw: Record<string, unknown>;
  latencyMs: number;
};

export type CloudflareAiErrorResult = {
  ok: false;
  provider: 'cloudflare-workers-ai';
  model: string;
  text: '';
  raw: Record<string, unknown>;
  latencyMs: number;
  error: string;
};

const DEFAULT_TEXT_MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8';

export function getWorkersAiModel(env: Cloudflare.Env): string {
  const configured = env.WORKERS_AI_TEXT_MODEL?.trim();
  return configured || DEFAULT_TEXT_MODEL;
}

export function hasWorkersAi(env: Cloudflare.Env): boolean {
  return typeof env.AI?.run === 'function';
}

export async function runWorkersAiText(
  env: Cloudflare.Env,
  prompt: string,
  options: { maxTokens?: number; temperature?: number } = {},
): Promise<CloudflareAiRunResult | CloudflareAiErrorResult> {
  const model = getWorkersAiModel(env);
  const startedAt = Date.now();

  if (!hasWorkersAi(env)) {
    return {
      ok: false,
      provider: 'cloudflare-workers-ai',
      model,
      text: '',
      raw: {},
      latencyMs: Date.now() - startedAt,
      error: 'Cloudflare Workers AI binding AI is not available.',
    };
  }

  try {
    const raw = await env.AI.run(model, {
      prompt,
      max_tokens: options.maxTokens ?? 160,
      temperature: options.temperature ?? 0.2,
    });
    const text = extractText(raw);

    return {
      ok: true,
      provider: 'cloudflare-workers-ai',
      model,
      text,
      raw: isRecord(raw) ? raw : { value: raw },
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      ok: false,
      provider: 'cloudflare-workers-ai',
      model,
      text: '',
      raw: {},
      latencyMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function extractText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (!isRecord(value)) return '';

  for (const key of ['response', 'text', 'result', 'output']) {
    const candidate = value[key];
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  }

  const choices = value.choices;
  if (Array.isArray(choices)) {
    for (const choice of choices) {
      if (!isRecord(choice)) continue;
      const message = choice.message;
      if (isRecord(message) && typeof message.content === 'string') return message.content.trim();
      if (typeof choice.text === 'string') return choice.text.trim();
    }
  }

  return JSON.stringify(value).slice(0, 2000);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
