import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getWorkersAiModel, hasWorkersAi, runWorkersAiText } from '@/lib/server/cloudflareAi';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const shouldRun = url.searchParams.get('run') === '1';
  const prompt = sanitizePrompt(url.searchParams.get('prompt'));

  if (shouldRun && !isAllowedDiagnosticRequest(request)) {
    return Response.json(
      {
        success: false,
        error: 'Cloudflare AI diagnostic inference requires localhost or x-aiboux-admin-token when ADMIN_API_TOKEN is configured.',
      },
      { status: 401 },
    );
  }

  const response: Record<string, unknown> = {
    success: true,
    service: 'aiboux-ai',
    provider: 'cloudflare-workers-ai',
    bindings: {
      ai: hasWorkersAi(env),
    },
    model: getWorkersAiModel(env),
  };

  if (shouldRun) {
    response.inference = await runWorkersAiText(
      env,
      [
        'AIBOUX Cloudflare Workers AI connection test.',
        'Reply in Japanese with one short sentence that includes the exact word AIBOUX.',
        `User prompt: ${prompt}`,
      ].join('\n'),
      { maxTokens: 80, temperature: 0 },
    );
  }

  return Response.json(response);
};

function sanitizePrompt(value: string | null): string {
  const trimmed = value?.trim() ?? '';
  return trimmed.slice(0, 300) || '接続テスト';
}

function isAllowedDiagnosticRequest(request: Request): boolean {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true;

  const headerHost = request.headers.get('host')?.split(':')[0]?.toLowerCase();
  if (headerHost === 'localhost' || headerHost === '127.0.0.1' || headerHost === '::1') return true;

  const connectingIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip');
  if (connectingIp === '127.0.0.1' || connectingIp === '::1') return true;

  const token = env.ADMIN_API_TOKEN?.trim();
  if (!token) return false;
  return request.headers.get('x-aiboux-admin-token') === token;
}
