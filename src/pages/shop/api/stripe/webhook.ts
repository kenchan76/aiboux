import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { productJson } from "@/lib/server/productMasterApi";
import { normalizeStripeConnectState, toLegacyStripeStatus, type StripeConnectState } from "@/lib/server/shopStripeConnect";

export const prerender = false;

type StripeWebhookEvent = {
  type?: string;
  data?: {
    object?: {
      id?: string;
      charges_enabled?: boolean;
      payouts_enabled?: boolean;
      requirements?: {
        disabled_reason?: string | null;
      };
    };
  };
};

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") || "";
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!webhookSecret) {
    return productJson({ success: false, error: "Stripe Webhook secret is not configured." }, { status: 503 });
  }

  if (!(await verifyStripeSignature(payload, signature, webhookSecret))) {
    return productJson({ success: false, error: "Stripe署名を確認できませんでした。" }, { status: 401 });
  }

  let event: StripeWebhookEvent;
  try {
    event = JSON.parse(payload) as StripeWebhookEvent;
  } catch {
    return productJson({ success: false, error: "Webhook payload is invalid." }, { status: 400 });
  }

  if (event.type !== "account.updated") {
    return productJson({ success: true, ignored: true });
  }

  const account = event.data?.object;
  if (!account?.id) {
    return productJson({ success: false, error: "StripeアカウントIDが見つかりませんでした。" }, { status: 400 });
  }

  const state = deriveState(account);
  const now = Date.now();
  const result = await env.DB.prepare(
    `
    UPDATE shop_settings
    SET stripe_connect_state = ?,
        stripe_connect_status = ?,
        stripe_last_synced_at = ?,
        updated_at = ?
    WHERE stripe_account_id = ?
    `,
  )
    .bind(state, toLegacyStripeStatus(state), now, now, account.id)
    .run();

  return productJson({
    success: true,
    state,
    updated: result.meta.changes ?? 0,
  });
};

function deriveState(account: NonNullable<StripeWebhookEvent["data"]>["object"]): StripeConnectState {
  if (account?.charges_enabled && account.payouts_enabled) return "active";
  if (account?.requirements?.disabled_reason) return "restricted";
  return normalizeStripeConnectState("pending");
}

async function verifyStripeSignature(payload: string, signatureHeader: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(
    signatureHeader
      .split(",")
      .map((part) => part.split("="))
      .filter((part): part is [string, string] => part.length === 2),
  );
  const timestamp = parts.t;
  const v1 = parts.v1;
  if (!timestamp || !v1) return false;

  const data = new TextEncoder().encode(`${timestamp}.${payload}`);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, data);
  return timingSafeEqual(hex(signature), v1);
}

function hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return diff === 0;
}
