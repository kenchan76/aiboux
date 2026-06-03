export const prerender = false;

import { env } from 'cloudflare:workers';
import { createVoiceReplyDraft } from '../../../../lib/mail/ai';
import { getTenantContext, tenantContextErrorResponse } from '../../../../lib/mail/tenant';

type VoiceDraftRequest = {
  spokenText?: string;
  messageId?: string;
  recipientName?: string;
  subject?: string;
  contextSummary?: string;
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

  let payload: VoiceDraftRequest;

  try {
    payload = (await request.json()) as VoiceDraftRequest;
  } catch {
    return jsonError('Invalid request body.', 400);
  }

  const spokenText = payload.spokenText?.trim() ?? '';

  if (!spokenText) {
    return jsonError('spokenText is required.', 400);
  }

  const draft = createVoiceReplyDraft({
    spokenText,
    recipientName: payload.recipientName,
    subject: payload.subject,
    contextSummary: payload.contextSummary,
  });
  const artifactId = `ai_${crypto.randomUUID()}`;
  const now = Date.now();
  const messageId = payload.messageId?.trim();

  if (messageId) {
    await env.DB.prepare(
      `INSERT INTO mail_ai_artifacts (
         id, tenant_id, message_id, artifact_type, content_json, engine, created_at
       )
       VALUES (?, ?, ?, 'speech_reply_draft', ?, 'deterministic_guardrail', ?)`,
    )
      .bind(artifactId, tenant.id, messageId, JSON.stringify(draft), now)
      .run();

    await env.DB.prepare(
      `INSERT INTO mail_audit_events (
         id, tenant_id, action, target_type, target_id, metadata_json, created_at
       )
       VALUES (?, ?, 'mail.ai.voice_draft.created', 'mail_message', ?, ?, ?)`,
    )
      .bind(
        `audit_${crypto.randomUUID()}`,
        tenant.id,
        messageId,
        JSON.stringify({ artifactId, approvalRequired: true }),
        now,
      )
      .run();
  }

  return Response.json({
    success: true,
    tenantId: tenant.id,
    artifactId: messageId ? artifactId : null,
    draft,
  });
}
