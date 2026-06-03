import type { APIRoute } from 'astro';
import finalLog from '../../../../all_log/3_最終完了ログ_A2_dash.md?raw';

export const prerender = false;

const ACCESS_TOKEN = 'cad9722a4d544d860db9bbb7b353df763314fc8425979f98';
const EXPIRES_AT = '2026-05-27T14:56:00Z';

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const expiresAt = new Date(EXPIRES_AT);

  if (token !== ACCESS_TOKEN) {
    return new Response('Not found', {
      status: 404,
      headers: secureHeaders(),
    });
  }

  if (Number.isNaN(expiresAt.getTime()) || Date.now() > expiresAt.getTime()) {
    return new Response('This temporary log URL has expired.', {
      status: 410,
      headers: secureHeaders(),
    });
  }

  return new Response(finalLog, {
    status: 200,
    headers: {
      ...secureHeaders(),
      'content-type': 'text/markdown; charset=utf-8',
      'content-disposition': 'inline; filename="3_final_completion_log_A2_dash.md"',
      expires: expiresAt.toUTCString(),
    },
  });
};

function secureHeaders(): HeadersInit {
  return {
    'cache-control': 'no-store, max-age=0',
    'x-content-type-options': 'nosniff',
    'x-robots-tag': 'noindex, nofollow, noarchive',
  };
}
