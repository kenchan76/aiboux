export const prerender = false;

import { env } from 'cloudflare:workers';
import {
  findActiveBlock,
  insertInboundMessageFromParsed,
  parseRawEmail,
  quarantineRawEmail,
} from '../../../lib/mail/ingress';
import { getTenantContext, tenantContextErrorResponse } from '../../../lib/mail/tenant';

function jsonError(message: string, status: number): Response {
  return Response.json({ success: false, error: message }, { status });
}

export async function POST({ request }: { request: Request }): Promise<Response> {
  let tenant;

  try {
    tenant = await getTenantContext(request);
  } catch (error) {
    return tenantContextErrorResponse(error);
  }

  const raw = await request.text();

  if (!raw.trim()) {
    return jsonError('Raw email body is required.', 400);
  }

  const parsed = parseRawEmail(raw);
  const block = await findActiveBlock(tenant.id, parsed);

  if (block) {
    const quarantineKey = await quarantineRawEmail(tenant.id, parsed, block);

    return Response.json(
      {
        success: true,
        quarantined: true,
        quarantineKey,
        block,
      },
      { status: 202 },
    );
  }

  const rawKey = `raw/${tenant.id}/${parsed.messageId}.eml`;

  await env.STORAGE.put(rawKey, raw, {
    httpMetadata: {
      contentType: 'message/rfc822; charset=utf-8',
    },
    customMetadata: {
      tenantId: tenant.id,
      messageId: parsed.messageId,
      status: 'received',
    },
  });

  const result = await insertInboundMessageFromParsed(tenant.id, parsed, rawKey);

  return Response.json({
    success: true,
    quarantined: false,
    messageId: result.messageId,
    mailboxId: result.mailboxId,
    unsubscribeUrl: parsed.unsubscribeUrl,
  });
}
