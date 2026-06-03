type QueuedEmailRow = {
  id: string;
  tenant_id: string;
  recipient_email: string;
  subject: string;
  body_text: string;
  delivery_attempts: number | null;
};

export type ShopEmailQueueResult = {
  scanned: number;
  sent: number;
  failed: number;
  mocked: number;
  deletedOldLogs: number;
};

type ResendResponse = {
  id?: string;
  message?: string;
  error?: { message?: string };
};

const BATCH_LIMIT = 20;
const RETRY_DELAY_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_TIMEOUT_MS = 12000;
const LOG_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const CLEANUP_LIMIT = 500;

export async function runShopEmailQueue(env: Pick<Cloudflare.Env, "DB" | "RESEND_API_KEY" | "RESEND_FROM_EMAIL" | "DEFAULT_FROM_EMAIL">): Promise<ShopEmailQueueResult> {
  const retryBefore = Date.now() - RETRY_DELAY_MS;
  const deletedOldLogs = await cleanupOldEmailLogs(env);
  const rows = (
    await env.DB.prepare(
      `
      SELECT id, tenant_id, recipient_email, subject, body_text, delivery_attempts
      FROM shop_email_notification_logs
      WHERE delivery_status = 'queued'
         OR (delivery_status = 'failed' AND COALESCE(delivery_attempts, 0) < ? AND COALESCE(last_attempt_at, 0) <= ?)
      ORDER BY created_at ASC
      LIMIT ?
      `,
    )
      .bind(MAX_ATTEMPTS, retryBefore, BATCH_LIMIT)
      .all<QueuedEmailRow>()
  ).results ?? [];

  let sent = 0;
  let failed = 0;
  let mocked = 0;

  for (const row of rows) {
    const now = Date.now();
    try {
      const result = await deliverEmail(env, row);
      await env.DB.prepare(
        `
        UPDATE shop_email_notification_logs
        SET delivery_status = 'sent',
            provider_message_id = ?,
            error_message = ?,
            provider = 'resend',
            delivery_attempts = COALESCE(delivery_attempts, 0) + 1,
            last_attempt_at = ?,
            sent_at = ?
        WHERE id = ?
          AND tenant_id = ?
        `,
      )
        .bind(result.providerMessageId, result.mocked ? "mock_send_without_resend_api_key" : "", now, now, row.id, row.tenant_id)
        .run();
      sent += 1;
      if (result.mocked) mocked += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await env.DB.prepare(
        `
        UPDATE shop_email_notification_logs
        SET delivery_status = 'failed',
            error_message = ?,
            provider = 'resend',
            delivery_attempts = COALESCE(delivery_attempts, 0) + 1,
            last_attempt_at = ?
        WHERE id = ?
          AND tenant_id = ?
        `,
      )
        .bind(message.slice(0, 500), now, row.id, row.tenant_id)
        .run();
      failed += 1;
    }
  }

  return {
    scanned: rows.length,
    sent,
    failed,
    mocked,
    deletedOldLogs,
  };
}

async function cleanupOldEmailLogs(env: Pick<Cloudflare.Env, "DB">): Promise<number> {
  const cutoff = Date.now() - LOG_RETENTION_MS;
  const result = await env.DB.prepare(
    `
    DELETE FROM shop_email_notification_logs
    WHERE id IN (
      SELECT id
      FROM shop_email_notification_logs
      WHERE created_at < ?
      ORDER BY created_at ASC
      LIMIT ?
    )
    `,
  )
    .bind(cutoff, CLEANUP_LIMIT)
    .run();

  return result.meta.changes ?? 0;
}

async function deliverEmail(
  env: Pick<Cloudflare.Env, "RESEND_API_KEY" | "RESEND_FROM_EMAIL" | "DEFAULT_FROM_EMAIL">,
  row: QueuedEmailRow,
): Promise<{ providerMessageId: string; mocked: boolean }> {
  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured. Email was not sent.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort("resend_timeout"), RESEND_TIMEOUT_MS);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    signal: controller.signal,
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      "idempotency-key": row.id,
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL || env.DEFAULT_FROM_EMAIL || "AIBOUX Shop <info@aiboux.com>",
      to: [row.recipient_email],
      subject: row.subject,
      text: row.body_text,
      headers: {
        "X-AIBOUX-Tenant-ID": row.tenant_id,
        "X-AIBOUX-Queue-ID": row.id,
      },
    }),
  }).finally(() => clearTimeout(timeout));

  const data = (await response.json().catch(() => ({}))) as ResendResponse;
  if (!response.ok || !data.id) {
    throw new Error(data.error?.message || data.message || "Resend email delivery failed.");
  }

  return { providerMessageId: data.id, mocked: false };
}
