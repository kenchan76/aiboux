export const prerender = false;

import { env } from 'cloudflare:workers';
import { getTenantContext, tenantContextErrorResponse } from '../../../lib/mail/tenant';

interface SendRequestBody {
  to: string;
  subject: string;
  body: string;
  attachmentAssetIds?: string[];
}

interface MailboxRow {
  id: string;
  address: string;
}

interface StoredAttachment {
  id: string;
  key: string;
  fileName: string;
  contentType: string;
  size: number;
  content: ArrayBuffer;
}

function jsonError(message: string, status: number): Response {
  return Response.json({ success: false, error: message }, { status });
}

function parseAddressList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function isValidEmailAddress(address: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address);
}

async function parseSendRequest(request: Request): Promise<SendRequestBody> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as Partial<SendRequestBody>;

    return {
      to: String(body.to ?? ''),
      subject: String(body.subject ?? ''),
      body: String(body.body ?? ''),
      attachmentAssetIds: Array.isArray(body.attachmentAssetIds)
        ? body.attachmentAssetIds.map(String).filter(Boolean)
        : [],
    };
  }

  const formData = await request.formData();
  const attachmentAssetIds = formData
    .getAll('attachmentAssetIds')
    .flatMap((value) => String(value).split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  return {
    to: String(formData.get('to') ?? ''),
    subject: String(formData.get('subject') ?? ''),
    body: String(formData.get('body') ?? ''),
    attachmentAssetIds,
  };
}

function getDefaultMailboxParts(): { localPart: string; domain: string; address: string } {
  const fallback = env.DEFAULT_FROM_EMAIL || 'noreply@aiboux.com';
  const [localPart, domain] = fallback.split('@');

  return {
    localPart: localPart || 'noreply',
    domain: domain || 'aiboux.com',
    address: `${localPart || 'noreply'}@${domain || 'aiboux.com'}`,
  };
}

async function ensureSenderMailbox(tenantId: string): Promise<MailboxRow> {
  const existing = await env.DB.prepare(
    `SELECT id, address
     FROM mail_addresses
     WHERE tenant_id = ? AND status = 'active'
     ORDER BY created_at ASC
     LIMIT 1`,
  )
    .bind(tenantId)
    .first<MailboxRow>();

  if (existing) {
    return existing;
  }

  const mailbox = getDefaultMailboxParts();
  const mailboxId = `mailbox_${crypto.randomUUID()}`;
  const now = Date.now();

  await env.DB.prepare(
    `INSERT INTO mail_addresses (
       id, tenant_id, local_part, domain, address, display_name, status, created_at, updated_at
     )
     VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)
     ON CONFLICT(address) DO NOTHING`,
  )
    .bind(
      mailboxId,
      tenantId,
      mailbox.localPart,
      mailbox.domain,
      mailbox.address,
      'AIBOUX Mail',
      now,
      now,
    )
    .run();

  const created = await env.DB.prepare(
    `SELECT id, address
     FROM mail_addresses
     WHERE tenant_id = ? AND address = ?
     LIMIT 1`,
  )
    .bind(tenantId, mailbox.address)
    .first<MailboxRow>();

  if (!created) {
    throw new Error('Failed to resolve sender mailbox.');
  }

  return created;
}

function assertTenantScopedAssetId(tenantId: string, assetId: string): void {
  if (!assetId.startsWith(`${tenantId}/`)) {
    throw new Error('Attachment does not belong to the active tenant.');
  }
}

async function loadAttachments(tenantId: string, attachmentAssetIds: string[]): Promise<StoredAttachment[]> {
  const attachments: StoredAttachment[] = [];

  for (const assetId of attachmentAssetIds) {
    assertTenantScopedAssetId(tenantId, assetId);
    const object = await env.STORAGE.get(assetId);

    if (!object) {
      throw new Error(`Attachment was not found: ${assetId}`);
    }

    const fileName = assetId.split('/').pop()?.replace(/^\d+_[0-9a-f-]+_/i, '') || 'attachment';

    attachments.push({
      id: `att_${crypto.randomUUID()}`,
      key: assetId,
      fileName,
      contentType: object.httpMetadata?.contentType ?? 'application/octet-stream',
      size: object.size,
      content: await object.arrayBuffer(),
    });
  }

  return attachments;
}

export async function POST({ request }: { request: Request }): Promise<Response> {
  let tenant;

  try {
    tenant = await getTenantContext(request);
  } catch (error) {
    return tenantContextErrorResponse(error);
  }

  let payload: SendRequestBody;

  try {
    payload = await parseSendRequest(request);
  } catch {
    return jsonError('Invalid request body.', 400);
  }

  const recipients = parseAddressList(payload.to);

  if (recipients.length === 0 || recipients.some((address) => !isValidEmailAddress(address))) {
    return jsonError('A valid recipient email address is required.', 400);
  }

  const subject = payload.subject.trim() || '(no subject)';
  const body = payload.body.trim();

  if (!body) {
    return jsonError('body is required.', 400);
  }

  try {
    const [senderMailbox, attachments] = await Promise.all([
      ensureSenderMailbox(tenant.id),
      loadAttachments(tenant.id, payload.attachmentAssetIds ?? []),
    ]);
    const sentAt = Date.now();
    const messageId = `msg_${crypto.randomUUID()}`;

    const result = await env.EMAIL.send({
      from: senderMailbox.address,
      to: recipients,
      subject,
      text: body,
      headers: {
        'X-AIBOUX-Tenant-ID': tenant.id,
      },
      attachments: attachments.map((attachment) => ({
        disposition: 'attachment' as const,
        filename: attachment.fileName,
        type: attachment.contentType,
        content: attachment.content,
      })),
    });

    const statements: D1PreparedStatement[] = [
      env.DB.prepare(
        `INSERT INTO mail_messages (
           id, tenant_id, mailbox_id, direction, provider_message_id, from_address, to_json,
           subject, body_text, preview_text, status, sent_at, created_at, updated_at
         )
         VALUES (?, ?, ?, 'outbound', ?, ?, ?, ?, ?, ?, 'sent', ?, ?, ?)`,
      ).bind(
        messageId,
        tenant.id,
        senderMailbox.id,
        result.messageId,
        senderMailbox.address,
        JSON.stringify(recipients),
        subject,
        body,
        body.slice(0, 180),
        sentAt,
        sentAt,
        sentAt,
      ),
      env.DB.prepare(
        `INSERT INTO mail_audit_events (
           id, tenant_id, action, target_type, target_id, metadata_json, created_at
         )
         VALUES (?, ?, 'mail.send', 'mail_message', ?, ?, ?)`,
      ).bind(
        `audit_${crypto.randomUUID()}`,
        tenant.id,
        messageId,
        JSON.stringify({ providerMessageId: result.messageId, recipients }),
        sentAt,
      ),
    ];

    for (const attachment of attachments) {
      statements.push(
        env.DB.prepare(
          `INSERT INTO mail_attachments (
             id, tenant_id, message_id, r2_key, file_name, mime_type, byte_size, optimizer_status, created_at
           )
           VALUES (?, ?, ?, ?, ?, ?, ?, 'client_optimized', ?)`,
        ).bind(
          attachment.id,
          tenant.id,
          messageId,
          attachment.key,
          attachment.fileName,
          attachment.contentType,
          attachment.size,
          sentAt,
        ),
      );
    }

    await env.DB.batch(statements);

    return Response.json({
      success: true,
      messageId,
      providerMessageId: result.messageId,
      tenantId: tenant.id,
      attachmentCount: attachments.length,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to send email.', 500);
  }
}
