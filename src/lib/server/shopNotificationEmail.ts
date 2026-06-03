export type ShopNotificationResult =
  | { attempted: true; ok: true; providerMessageId: string; fallbackQueued?: boolean; warning?: string }
  | { attempted: true; ok: false; error: string }
  | { attempted: false; ok: false; error: string };

const ADMIN_TO = "info@aiboux.com";
const ADMIN_FROM = "info@aiboux.com";

export async function sendShopAdminNotification(
  env: Pick<Cloudflare.Env, "DB" | "EMAIL" | "DEFAULT_FROM_EMAIL">,
  input: {
    subject: string;
    text: string;
    tenantId: string;
  },
): Promise<ShopNotificationResult> {
  if (typeof env.EMAIL?.send !== "function") {
    return { attempted: false, ok: false, error: "Cloudflare Email binding is not available." };
  }

  try {
    const result = await env.EMAIL.send({
      from: ADMIN_FROM,
      to: ADMIN_TO,
      subject: input.subject,
      text: input.text,
      headers: {
        "X-AIBOUX-Mailer": "shop-notification",
        "X-AIBOUX-Tenant-ID": input.tenantId,
      },
    });
    return { attempted: true, ok: true, providerMessageId: result.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const queuedId = await queueFallbackNotification(env, input, message);
    return {
      attempted: true,
      ok: true,
      providerMessageId: queuedId,
      fallbackQueued: true,
      warning: `Email provider failed; notification queued in D1. ${message}`,
    };
  }
}

async function queueFallbackNotification(
  env: Pick<Cloudflare.Env, "DB">,
  input: { subject: string; text: string; tenantId: string },
  errorMessage: string,
): Promise<string> {
  const id = `shop_email_${crypto.randomUUID()}`;
  const now = Date.now();
  await env.DB.prepare(
    `
    INSERT INTO shop_email_notification_logs (
      id, tenant_id, recipient_email, subject, body_text, delivery_status, error_message, created_at
    )
    VALUES (?, ?, ?, ?, ?, 'queued', ?, ?)
    `,
  )
    .bind(id, input.tenantId, ADMIN_TO, input.subject, input.text, errorMessage.slice(0, 500), now)
    .run();
  return id;
}
