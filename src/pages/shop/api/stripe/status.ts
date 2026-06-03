import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { productJson, withTenant } from "@/lib/server/productMasterApi";
import {
  DEFAULT_STRIPE_BUSINESS_DATA,
  ensureShopSettingsRow,
  fetchWithTimeout,
  getStripeBusinessData,
  normalizeStripeConnectState,
  stripeErrorMessage,
  toLegacyStripeStatus,
  type StripeConnectRow,
  type StripeConnectState,
} from "@/lib/server/shopStripeConnect";

export const prerender = false;

type StripeAccountStatusResponse = {
  id?: string;
  charges_enabled?: boolean;
  payouts_enabled?: boolean;
  details_submitted?: boolean;
  requirements?: {
    disabled_reason?: string | null;
    currently_due?: string[];
    past_due?: string[];
  };
  error?: { message?: string };
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    await ensureShopSettingsRow(env, tenant.tenantId);

    const row = await env.DB.prepare(
      `
      SELECT tenant_id, store_name, stripe_account_id, stripe_connect_state, stripe_connect_status,
             stripe_onboarding_url, stripe_onboarding_expires_at, stripe_business_data_json, stripe_last_synced_at
      FROM shop_settings
      WHERE tenant_id = ?
      LIMIT 1
      `,
    )
      .bind(tenant.tenantId)
      .first<StripeConnectRow>();

    if (!row) {
      return productJson({ success: false, error: "ショップ設定が見つかりませんでした。" }, { status: 404 });
    }

    const stripeSecret = env.STRIPE_SECRET_KEY?.trim();
    let state = normalizeStripeConnectState(row.stripe_connect_state);
    let statusNote = "";

    if (stripeSecret && row.stripe_account_id && !row.stripe_account_id.startsWith("acct_mock_")) {
      const remote = await fetchStripeAccountStatus(stripeSecret, row.stripe_account_id);
      state = deriveStripeState(remote);
      statusNote = remote.requirements?.disabled_reason || "";
      const now = Date.now();
      await env.DB.prepare(
        `
        UPDATE shop_settings
        SET stripe_connect_state = ?,
            stripe_connect_status = ?,
            stripe_last_synced_at = ?,
            updated_at = ?
        WHERE tenant_id = ?
        `,
      )
        .bind(state, toLegacyStripeStatus(state), now, now, tenant.tenantId)
        .run();
    }

    return productJson({
      success: true,
      state,
      legacyStatus: toLegacyStripeStatus(state),
      statusNote,
      accountId: row.stripe_account_id,
      onboardingUrl: row.stripe_onboarding_url,
      onboardingExpiresAt: row.stripe_onboarding_expires_at,
      businessData: await parseBusinessData(env, tenant.tenantId, row.stripe_business_data_json),
      lastSyncedAt: row.stripe_last_synced_at,
      apiMode: stripeSecret ? "stripe_api" : "mock",
    });
  } catch (error) {
    return productJson({ success: false, error: stripeErrorMessage(error) }, { status: 502 });
  }
};

async function fetchStripeAccountStatus(secret: string, accountId: string): Promise<StripeAccountStatusResponse> {
  const response = await fetchWithTimeout(`https://api.stripe.com/v1/accounts/${encodeURIComponent(accountId)}`, {
    headers: {
      authorization: `Bearer ${secret}`,
    },
  });
  const data = (await response.json()) as StripeAccountStatusResponse;
  if (!response.ok) {
    throw new Error(data.error?.message || "Stripe account status fetch failed.");
  }
  return data;
}

function deriveStripeState(account: StripeAccountStatusResponse): StripeConnectState {
  if (account.charges_enabled && account.payouts_enabled) return "active";
  if (account.requirements?.disabled_reason) return "restricted";
  return "pending";
}

async function parseBusinessData(env: Pick<Cloudflare.Env, "DB">, tenantId: string, value: string | null): Promise<typeof DEFAULT_STRIPE_BUSINESS_DATA> {
  if (!value || value === "{}") return getStripeBusinessData(env, tenantId);
  try {
    const parsed = { ...DEFAULT_STRIPE_BUSINESS_DATA, ...JSON.parse(value) };
    if (parsed.dataSource === "phase12_test_mock") return getStripeBusinessData(env, tenantId);
    return parsed;
  } catch {
    return getStripeBusinessData(env, tenantId);
  }
}
