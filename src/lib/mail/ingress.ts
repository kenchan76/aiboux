import { env } from 'cloudflare:workers';
import { processNotification } from './notifier';

export interface ParsedEmail {
  messageId: string;
  from: string;
  fromDomain: string;
  to: string[];
  subject: string;
  bodyText: string;
  raw: string;
  headers: Record<string, string>;
  unsubscribeUrl: string | null;
}

export interface BlockMatch {
  id: string;
  block_type: 'email' | 'domain';
  block_pattern: string;
}

interface MailboxRow {
  id: string;
  address: string;
}

interface RestoredMessageResult {
  messageId: string;
  mailboxId: string;
}

function unfoldHeaderLines(headerText: string): string[] {
  const lines = headerText.split(/\r?\n/);
  const unfolded: string[] = [];

  for (const line of lines) {
    if (/^[\t ]/.test(line) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += ` ${line.trim()}`;
    } else {
      unfolded.push(line);
    }
  }

  return unfolded;
}

function parseHeaders(raw: string): { headers: Record<string, string>; bodyText: string } {
  const separator = raw.includes('\r\n\r\n') ? '\r\n\r\n' : '\n\n';
  const [headerText, ...bodyParts] = raw.split(separator);
  const headers: Record<string, string> = {};

  for (const line of unfoldHeaderLines(headerText)) {
    const index = line.indexOf(':');

    if (index > 0) {
      const key = line.slice(0, index).trim().toLowerCase();
      const value = line.slice(index + 1).trim();
      headers[key] = headers[key] ? `${headers[key]}, ${value}` : value;
    }
  }

  return {
    headers,
    bodyText: bodyParts.join(separator).trim(),
  };
}

function extractEmailAddress(value: string): string {
  const angleMatch = value.match(/<([^<>@\s]+@[^<>\s]+)>/);

  if (angleMatch) {
    return angleMatch[1].trim().toLowerCase();
  }

  const plainMatch = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return plainMatch ? plainMatch[0].trim().toLowerCase() : value.trim().toLowerCase();
}

function extractEmailAddresses(value: string): string[] {
  const matches = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi);
  return matches ? matches.map((email) => email.toLowerCase()) : [];
}

function extractHttpsListUnsubscribe(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const bracketedLinks = [...value.matchAll(/<([^<>]+)>/g)].map((match) => match[1].trim());
  const candidates = bracketedLinks.length > 0 ? bracketedLinks : value.split(',').map((part) => part.trim());
  const httpsUrl = candidates.find((candidate) => /^https:\/\//i.test(candidate));

  return httpsUrl ?? null;
}

function normalizeSubject(value: string | undefined): string {
  return value?.trim() || '(件名なし)';
}

function normalizeMessageId(value: string | undefined): string {
  const clean = value?.replace(/[<>]/g, '').trim();
  return clean ? `in_${clean.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180)}` : `in_${crypto.randomUUID()}`;
}

function getDefaultMailboxParts(address: string): { localPart: string; domain: string; address: string } {
  const [localPart, domain] = address.split('@');

  return {
    localPart: localPart || 'inbox',
    domain: domain || 'aiboux.com',
    address: `${localPart || 'inbox'}@${domain || 'aiboux.com'}`,
  };
}

export function parseRawEmail(raw: string): ParsedEmail {
  const { headers, bodyText } = parseHeaders(raw);
  const from = extractEmailAddress(headers.from ?? '');
  const fromDomain = from.includes('@') ? from.split('@').pop() ?? '' : '';
  const to = extractEmailAddresses(headers.to ?? '');

  return {
    messageId: normalizeMessageId(headers['message-id']),
    from,
    fromDomain: fromDomain.toLowerCase(),
    to,
    subject: normalizeSubject(headers.subject),
    bodyText,
    raw,
    headers,
    unsubscribeUrl: extractHttpsListUnsubscribe(headers['list-unsubscribe']),
  };
}

export async function findActiveBlock(tenantId: string, parsed: ParsedEmail): Promise<BlockMatch | null> {
  const directEmail = parsed.from.toLowerCase();
  const domain = parsed.fromDomain.toLowerCase();

  return env.DB.prepare(
    `SELECT id, block_type, block_pattern
     FROM mail_blocked_senders
     WHERE tenant_id = ?
       AND is_active = 1
       AND (
         (block_type = 'email' AND lower(block_pattern) = ?)
         OR
         (block_type = 'domain' AND lower(block_pattern) = ?)
       )
     LIMIT 1`,
  )
    .bind(tenantId, directEmail, domain)
    .first<BlockMatch>();
}

export async function ensureInboundMailbox(tenantId: string, toAddresses: string[]): Promise<MailboxRow> {
  const preferredAddress = toAddresses[0] || env.DEFAULT_FROM_EMAIL || 'inbox@aiboux.com';
  const parts = getDefaultMailboxParts(preferredAddress);
  const existing = await env.DB.prepare(
    `SELECT id, address
     FROM mail_addresses
     WHERE tenant_id = ? AND address = ?
     LIMIT 1`,
  )
    .bind(tenantId, parts.address)
    .first<MailboxRow>();

  if (existing) {
    return existing;
  }

  const mailboxId = `mailbox_${crypto.randomUUID()}`;
  const now = Date.now();

  await env.DB.prepare(
    `INSERT INTO mail_addresses (
       id, tenant_id, local_part, domain, address, display_name, status, created_at, updated_at
     )
     VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)
     ON CONFLICT(address) DO NOTHING`,
  )
    .bind(mailboxId, tenantId, parts.localPart, parts.domain, parts.address, 'AIBOUX Inbox', now, now)
    .run();

  const created = await env.DB.prepare(
    `SELECT id, address
     FROM mail_addresses
     WHERE tenant_id = ? AND address = ?
     LIMIT 1`,
  )
    .bind(tenantId, parts.address)
    .first<MailboxRow>();

  if (!created) {
    throw new Error('Failed to resolve inbound mailbox.');
  }

  return created;
}

export async function quarantineRawEmail(
  tenantId: string,
  parsed: ParsedEmail,
  block: BlockMatch,
): Promise<string> {
  const key = `quarantine/${tenantId}/${parsed.messageId}.eml`;
  const quarantinedAt = Date.now();
  const rescueExpiresAt = quarantinedAt + 14 * 24 * 60 * 60 * 1000;

  await env.STORAGE.put(key, parsed.raw, {
    httpMetadata: {
      contentType: 'message/rfc822; charset=utf-8',
    },
    customMetadata: {
      status: 'quarantined',
      tenantId,
      messageId: parsed.messageId,
      blockId: block.id,
      blockType: block.block_type,
      blockPattern: block.block_pattern,
      quarantinedAt: String(quarantinedAt),
      rescueExpiresAt: String(rescueExpiresAt),
    },
  });

  return key;
}

export async function insertInboundMessageFromParsed(
  tenantId: string,
  parsed: ParsedEmail,
  rawR2Key: string | null,
): Promise<RestoredMessageResult> {
  const mailbox = await ensureInboundMailbox(tenantId, parsed.to);
  const now = Date.now();

  await env.DB.prepare(
    `INSERT INTO mail_messages (
       id, tenant_id, mailbox_id, direction, provider_message_id, from_address, to_json,
       subject, body_text, preview_text, unsubscribe_url, raw_r2_key,
       status, is_read, received_at, created_at, updated_at
     )
     VALUES (?, ?, ?, 'inbound', ?, ?, ?, ?, ?, ?, ?, ?, 'received', 0, ?, ?, ?)
     ON CONFLICT(tenant_id, provider_message_id) DO UPDATE SET
       body_text = excluded.body_text,
       preview_text = excluded.preview_text,
       unsubscribe_url = excluded.unsubscribe_url,
       raw_r2_key = excluded.raw_r2_key,
       updated_at = excluded.updated_at`,
  )
    .bind(
      parsed.messageId,
      tenantId,
      mailbox.id,
      parsed.headers['message-id'] ?? parsed.messageId,
      parsed.from,
      JSON.stringify(parsed.to),
      parsed.subject,
      parsed.bodyText,
      parsed.bodyText.slice(0, 180),
      parsed.unsubscribeUrl,
      rawR2Key,
      now,
      now,
      now,
    )
    .run();

  await processNotification(
    {
      subject: parsed.subject,
      body: parsed.bodyText,
      from: parsed.from,
      to: parsed.to,
      messageId: parsed.messageId,
    },
    'otp_reply_only',
  );

  return {
    messageId: parsed.messageId,
    mailboxId: mailbox.id,
  };
}
