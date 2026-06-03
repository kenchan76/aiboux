export const prerender = false;

import { env } from 'cloudflare:workers';
import { insertInboundMessageFromParsed, parseRawEmail } from '../../../../lib/mail/ingress';
import { getTenantContext, tenantContextErrorResponse } from '../../../../lib/mail/tenant';

interface RestoreRequest {
  quarantineKey?: string;
}

function isTenantQuarantineKey(tenantId: string, key: string): boolean {
  return key.startsWith(`quarantine/${tenantId}/`) && key.endsWith('.eml');
}

export async function POST({ request }: { request: Request }): Promise<Response> {
  let tenant;

  try {
    tenant = await getTenantContext(request);
  } catch (error) {
    return tenantContextErrorResponse(error);
  }

  const body = (await request.json().catch(() => ({}))) as RestoreRequest;
  const quarantineKey = body.quarantineKey?.trim() ?? '';

  if (!isTenantQuarantineKey(tenant.id, quarantineKey)) {
    return Response.json({ success: false, error: 'Invalid quarantine key.' }, { status: 400 });
  }

  const object = await env.STORAGE.get(quarantineKey);

  if (!object) {
    return Response.json({ success: false, error: 'Quarantined email was not found.' }, { status: 404 });
  }

  const raw = await object.text();
  const parsed = parseRawEmail(raw);
  const rawKey = `raw/${tenant.id}/${parsed.messageId}.eml`;

  await env.STORAGE.put(rawKey, raw, {
    httpMetadata: {
      contentType: 'message/rfc822; charset=utf-8',
    },
    customMetadata: {
      tenantId: tenant.id,
      messageId: parsed.messageId,
      status: 'restored',
      restoredFrom: quarantineKey,
    },
  });

  const result = await insertInboundMessageFromParsed(tenant.id, parsed, rawKey);
  await env.STORAGE.delete(quarantineKey);

  return Response.json({
    success: true,
    restored: true,
    messageId: result.messageId,
    mailboxId: result.mailboxId,
    deletedQuarantineKey: quarantineKey,
  });
}
