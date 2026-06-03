export const prerender = false;

import { env } from 'cloudflare:workers';
import { getTenantContext, tenantContextErrorResponse } from '../../../../lib/mail/tenant';

interface AttachmentRow {
  id: string;
  r2_key: string;
  file_name: string;
  mime_type: string;
  byte_size: number;
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

export async function GET({ params, request }: { params: { id?: string }; request: Request }): Promise<Response> {
  let tenant;

  try {
    tenant = await getTenantContext(request);
  } catch (error) {
    return tenantContextErrorResponse(error);
  }

  const attachmentId = params.id ?? '';

  if (!attachmentId) {
    return textResponse('Attachment id is required.', 400);
  }

  const attachment = await env.DB.prepare(
    `SELECT id, r2_key, file_name, mime_type, byte_size
     FROM mail_attachments
     WHERE tenant_id = ? AND id = ?
     LIMIT 1`,
  )
    .bind(tenant.id, attachmentId)
    .first<AttachmentRow>();

  if (!attachment) {
    return textResponse('Attachment not found.', 404);
  }

  const object = await env.STORAGE.get(attachment.r2_key);

  if (!object?.body) {
    return textResponse('Attachment object not found.', 404);
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || attachment.mime_type || 'application/octet-stream',
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(attachment.file_name)}`,
      'Content-Length': String(object.size),
      'Cache-Control': 'private, max-age=300',
    },
  });
}
