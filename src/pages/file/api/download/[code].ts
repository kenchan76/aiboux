export const prerender = false;

import { env } from 'cloudflare:workers';

interface TransferRow {
  id: string;
  download_code: string;
  file_name: string;
  r2_key: string;
  file_size: number;
  file_type: string;
  expires_at: string;
}

function textResponse(message: string, status: number): Response {
  return new Response(message, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET({ params }: { params: { code?: string } }): Promise<Response> {
  const code = params.code ?? '';

  if (!code) {
    return textResponse('Missing download code.', 400);
  }

  const transfer = await env.DB.prepare(
    `SELECT id, download_code, file_name, r2_key, file_size, file_type, expires_at
     FROM public_file_transfers
     WHERE download_code = ?
     LIMIT 1`,
  )
    .bind(code)
    .first<TransferRow>();

  if (!transfer) {
    return textResponse('File transfer was not found.', 404);
  }

  const expiresAt = new Date(transfer.expires_at);

  if (Number.isNaN(expiresAt.getTime()) || Date.now() > expiresAt.getTime()) {
    return textResponse('This link has expired (7-day retention policy exceeded).', 410);
  }

  const object = await env.STORAGE.get(transfer.r2_key);

  if (!object?.body) {
    return textResponse('The stored file is no longer available.', 404);
  }

  await env.DB.prepare(
    `UPDATE public_file_transfers
     SET download_count = download_count + 1
     WHERE id = ?`,
  )
    .bind(transfer.id)
    .run();

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || transfer.file_type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(transfer.file_name)}`,
      'Content-Length': String(object.size),
      'Cache-Control': 'private, max-age=0, no-store',
      'X-AIBOUX-Transfer-ID': transfer.id,
    },
  });
}
