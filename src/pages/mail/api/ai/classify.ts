export const prerender = false;

import { env } from 'cloudflare:workers';
import { classifyMailPrivacy } from '../../../../lib/mail/ai';
import { getTenantContext, tenantContextErrorResponse } from '../../../../lib/mail/tenant';

type ClassifyRequest = {
  messageId?: string;
  senderName?: string;
  senderEmail?: string;
  subject?: string;
  body?: string | string[];
};

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

  let payload: ClassifyRequest;

  try {
    payload = (await request.json()) as ClassifyRequest;
  } catch {
    return jsonError('Invalid request body.', 400);
  }

  const senderEmail = payload.senderEmail?.trim() ?? '';
  const subject = payload.subject?.trim() ?? '';
  const body = Array.isArray(payload.body) ? payload.body.map(String) : [String(payload.body ?? '')];

  if (!senderEmail || !subject) {
    return jsonError('senderEmail and subject are required.', 400);
  }

  const classification = classifyMailPrivacy({
    senderName: payload.senderName?.trim() ?? '',
    senderEmail,
    subject,
    body,
  });
  const messageId = payload.messageId?.trim();
  const artifactId = `ai_${crypto.randomUUID()}`;

  if (messageId) {
    await env.DB.prepare(
      `INSERT INTO mail_ai_artifacts (
         id, tenant_id, message_id, artifact_type, content_json, engine, created_at
       )
       VALUES (?, ?, ?, 'classification', ?, 'deterministic_guardrail', ?)`,
    )
      .bind(artifactId, tenant.id, messageId, JSON.stringify(classification), Date.now())
      .run();
  }

  return Response.json({
    success: true,
    tenantId: tenant.id,
    artifactId: messageId ? artifactId : null,
    classification,
  });
}
