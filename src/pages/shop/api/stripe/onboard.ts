import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { productJson, withTenant } from "@/lib/server/productMasterApi";
import {
  buildMockStripeAccountId,
  businessDataJson,
  ensureShopSettingsRow,
  fetchWithTimeout,
  getStripeBusinessData,
  stripeErrorMessage,
  toLegacyStripeStatus,
  type StripeBusinessData,
  type StripeConnectState,
} from "@/lib/server/shopStripeConnect";

export const prerender = false;

type StripeAccountResponse = {
  id?: string;
  error?: { message?: string };
};

type StripeAccountLinkResponse = {
  url?: string;
  expires_at?: number;
  error?: { message?: string };
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    await ensureShopSettingsRow(env, tenant.tenantId);

    const now = Date.now();
    const businessData = await getStripeBusinessData(env, tenant.tenantId);
    const originHeader = request.headers.get("origin");
    const origin = tenant.hostName ? `https://${tenant.hostName}` : originHeader?.startsWith("http") ? originHeader : new URL(request.url).origin;
    const stripeSecret = env.STRIPE_SECRET_KEY?.trim();
    const existing = await env.DB.prepare(
      `
      SELECT stripe_account_id
      FROM shop_settings
      WHERE tenant_id = ?
      LIMIT 1
      `,
    )
      .bind(tenant.tenantId)
      .first<{ stripe_account_id: string | null }>();

    let accountId = existing?.stripe_account_id || "";
    let onboardingUrl = "";
    let expiresAt = now + 30 * 60 * 1000;
    let mode: "stripe_api" | "mock" = "mock";
    let warning = "";

    if (businessData.dataSource !== "shop_settings") {
      accountId = buildMockStripeAccountId(tenant.tenantId);
      onboardingUrl = `${origin}/s/aiboux/admin/settings?stripe=business_required&account=${encodeURIComponent(accountId)}`;
      warning = "事業者情報が未設定のため、Stripe連携は開始していません。先に帳票・書類設定を保存してください。";
    } else if (stripeSecret) {
      mode = "stripe_api";
      try {
        if (accountId.startsWith("acct_mock_")) {
          accountId = "";
        }
        if (!accountId) {
          accountId = await createStripeAccount(stripeSecret, tenant.tenantId, businessData);
        }
        const link = await createStripeAccountLink(stripeSecret, accountId, origin);
        onboardingUrl = link.url;
        expiresAt = link.expiresAt;
      } catch (error) {
        if (accountId && !accountId.startsWith("acct_mock_")) throw error;
        mode = "mock";
        warning = "Stripe API接続に失敗したため、モック連携として状態を保存しました。APIキーとStripe設定を確認してください。";
        accountId = buildMockStripeAccountId(tenant.tenantId);
        onboardingUrl = `${origin}/s/aiboux/admin/settings?stripe=mock_onboarding&account=${encodeURIComponent(accountId)}`;
      }
    } else {
      accountId = accountId || buildMockStripeAccountId(tenant.tenantId);
      onboardingUrl = `${origin}/s/aiboux/admin/settings?stripe=mock_onboarding&account=${encodeURIComponent(accountId)}`;
    }

    const state: StripeConnectState = "pending";
    await env.DB.prepare(
      `
      UPDATE shop_settings
      SET stripe_account_id = ?,
          stripe_connect_state = ?,
          stripe_connect_status = ?,
          stripe_onboarding_url = ?,
          stripe_onboarding_expires_at = ?,
          stripe_business_data_json = ?,
          stripe_last_synced_at = ?,
          updated_at = ?
      WHERE tenant_id = ?
      `,
    )
      .bind(
        accountId,
        state,
        toLegacyStripeStatus(state),
        onboardingUrl,
        expiresAt,
        businessDataJson(businessData),
        now,
        now,
        tenant.tenantId,
      )
      .run();

    return productJson({
      success: true,
      mode,
      apiMode: mode,
      state,
      accountId,
      onboardingUrl,
      onboardingExpiresAt: expiresAt,
      businessData,
      message: warning || (mode === "mock" ? "Stripe APIキー未設定のため、モック連携として保存しました。" : "Stripe連携URLを作成しました。"),
      warning,
    });
  } catch (error) {
    return productJson({ success: false, error: stripeErrorMessage(error) }, { status: 502 });
  }
};

async function createStripeAccount(secret: string, tenantId: string, businessData: StripeBusinessData): Promise<string> {
  const body = new URLSearchParams();
  body.set("type", "express");
  body.set("country", businessData.country);
  body.set("business_type", "company");
  body.set("default_currency", businessData.currency);
  body.set("company[name]", businessData.companyName);
  body.set("company[address][country]", businessData.country);
  if (businessData.postalCode) body.set("company[address][postal_code]", businessData.postalCode);
  if (businessData.addressLine1) body.set("company[address][line1]", businessData.addressLine1);
  if (businessData.phone) body.set("company[phone]", businessData.phone);
  if (businessData.email) body.set("email", businessData.email);
  body.set("business_profile[name]", businessData.companyName);
  if (businessData.phone) body.set("business_profile[support_phone]", businessData.phone);
  if (businessData.email) body.set("business_profile[support_email]", businessData.email);
  body.set("metadata[aiboux_business_location]", businessData.location);
  body.set("metadata[aiboux_business_data_source]", businessData.dataSource);
  body.set("capabilities[card_payments][requested]", "true");
  body.set("capabilities[transfers][requested]", "true");

  const response = await fetchWithTimeout("https://api.stripe.com/v1/accounts", {
    method: "POST",
    headers: {
      authorization: `Bearer ${secret}`,
      "content-type": "application/x-www-form-urlencoded",
      "idempotency-key": `aiboux_shop_connect_${tenantId}`,
    },
    body,
  });
  const data = (await response.json()) as StripeAccountResponse;
  if (!response.ok || !data.id) {
    throw new Error(data.error?.message || "Stripe account creation failed.");
  }
  return data.id;
}

async function createStripeAccountLink(secret: string, accountId: string, origin: string): Promise<{ url: string; expiresAt: number }> {
  const body = new URLSearchParams();
  body.set("account", accountId);
  body.set("refresh_url", `${origin}/s/aiboux/admin/settings?stripe=refresh`);
  body.set("return_url", `${origin}/s/aiboux/admin/settings?stripe=return`);
  body.set("type", "account_onboarding");

  const response = await fetchWithTimeout("https://api.stripe.com/v1/account_links", {
    method: "POST",
    headers: {
      authorization: `Bearer ${secret}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = (await response.json()) as StripeAccountLinkResponse;
  if (!response.ok || !data.url) {
    throw new Error(data.error?.message || "Stripe account link creation failed.");
  }
  return {
    url: data.url,
    expiresAt: (data.expires_at ?? Math.floor(Date.now() / 1000) + 1800) * 1000,
  };
}
