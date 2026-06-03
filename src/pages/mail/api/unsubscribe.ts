export const prerender = false;

import { env } from 'cloudflare:workers';
import { getTenantContext, tenantContextErrorResponse } from '../../../lib/mail/tenant';

interface UnsubscribeRequest {
  messageId?: string;
  unsubscribeUrl?: string;
}

interface MessageRow {
  unsubscribe_url: string | null;
}

function isSafeHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export async function POST({ request }: { request: Request }): Promise<Response> {
  let tenant;

  try {
    tenant = await getTenantContext(request);
  } catch (error) {
    return tenantContextErrorResponse(error);
  }

  const body = (await request.json().catch(() => ({}))) as UnsubscribeRequest;
  let unsubscribeUrl = body.unsubscribeUrl?.trim() ?? '';

  if (body.messageId) {
    const row = await env.DB.prepare(
      `SELECT unsubscribe_url
       FROM mail_messages
       WHERE tenant_id = ? AND id = ?
       LIMIT 1`,
    )
      .bind(tenant.id, body.messageId)
      .first<MessageRow>();

    unsubscribeUrl = row?.unsubscribe_url ?? unsubscribeUrl;
  }

  if (!unsubscribeUrl || !isSafeHttpsUrl(unsubscribeUrl)) {
    return Response.json({ success: false, error: 'A valid HTTPS unsubscribe URL is required.' }, { status: 400 });
  }

  const upstream = await fetch(unsubscribeUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'AIBOUX-Unsubscribe-Proxy/1.0',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    redirect: 'follow',
  });

  return Response.json({
    success: upstream.ok,
    status: upstream.status,
    finalUrl: upstream.url,
  });
}
