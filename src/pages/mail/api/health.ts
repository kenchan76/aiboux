export const prerender = false;

import { env } from 'cloudflare:workers';

export async function GET(): Promise<Response> {
  const startedAt = Date.now();
  const result = await env.DB.prepare('SELECT 1 AS ok').first<{ ok: number }>();

  return Response.json({
    ok: result?.ok === 1,
    service: 'aiboux-mail',
    bindings: {
      db: Boolean(env.DB),
      storage: Boolean(env.STORAGE),
      email: Boolean(env.EMAIL),
    },
    latency_ms: Date.now() - startedAt,
  });
}
