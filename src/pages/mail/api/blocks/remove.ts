export const prerender = false;

import { env } from 'cloudflare:workers';
import { getTenantContext, tenantContextErrorResponse } from '../../../../lib/mail/tenant';

interface RemoveRequest {
  blockId?: string;
}

export async function POST({ request }: { request: Request }): Promise<Response> {
  let tenant;

  try {
    tenant = await getTenantContext(request);
  } catch (error) {
    return tenantContextErrorResponse(error);
  }

  const body = (await request.json().catch(() => ({}))) as RemoveRequest;
  const blockId = body.blockId?.trim();

  if (!blockId) {
    return Response.json({ success: false, error: 'blockId is required.' }, { status: 400 });
  }

  const result = await env.DB.prepare(
    `UPDATE mail_blocked_senders
     SET is_active = 0
     WHERE tenant_id = ? AND id = ?`,
  )
    .bind(tenant.id, blockId)
    .run();

  return Response.json({
    success: true,
    changed: result.meta.changes,
  });
}
