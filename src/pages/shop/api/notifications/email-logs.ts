import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { productError, productJson, safeLimit, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type EmailLogRow = {
  id: string;
  recipient_email: string;
  subject: string;
  provider: string | null;
  delivery_status: "queued" | "sent" | "failed";
  error_message: string;
  created_at: number;
  sent_at: number | null;
  delivery_attempts: number | null;
  last_attempt_at: number | null;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const url = new URL(request.url);
    const limit = safeLimit(url.searchParams.get("limit"), 50, 50);
    const rows =
      (
        await env.DB.prepare(
          `
          SELECT
            id,
            recipient_email,
            subject,
            provider,
            delivery_status,
            error_message,
            created_at,
            sent_at,
            delivery_attempts,
            last_attempt_at
          FROM shop_email_notification_logs
          WHERE tenant_id = ?
          ORDER BY created_at DESC
          LIMIT ?
          `,
        )
          .bind(tenant.tenantId, limit)
          .all<EmailLogRow>()
      ).results ?? [];

    return productJson({
      success: true,
      tenantId: tenant.tenantId,
      logs: rows.map((row) => ({
        id: row.id,
        recipientEmail: row.recipient_email,
        subject: row.subject,
        provider: row.provider || "resend",
        status: row.delivery_status,
        errorMessage: row.error_message,
        createdAt: row.created_at,
        sentAt: row.sent_at,
        attempts: row.delivery_attempts ?? 0,
        lastAttemptAt: row.last_attempt_at,
      })),
    });
  } catch (error) {
    return productError(error);
  }
};
