export const DEFAULT_STRIPE_BUSINESS_DATA = {
  representativeName: "",
  companyName: "",
  location: "",
  postalCode: "",
  addressLine1: "",
  phone: "",
  email: "",
  country: "JP",
  currency: "jpy",
  dataSource: "phase13_failsafe_mock",
};

export type StripeBusinessData = typeof DEFAULT_STRIPE_BUSINESS_DATA;

export type StripeConnectState = "not_connected" | "pending" | "active" | "restricted";

export type StripeConnectRow = {
  tenant_id: string;
  store_name: string | null;
  stripe_account_id: string | null;
  stripe_connect_state: StripeConnectState | null;
  stripe_connect_status: string | null;
  stripe_onboarding_url: string | null;
  stripe_onboarding_expires_at: number | null;
  stripe_business_data_json: string | null;
  stripe_last_synced_at: number | null;
};

export function toLegacyStripeStatus(state: StripeConnectState): "not_connected" | "pending" | "connected" {
  if (state === "active") return "connected";
  if (state === "pending" || state === "restricted") return "pending";
  return "not_connected";
}

export function normalizeStripeConnectState(value: unknown): StripeConnectState {
  if (value === "pending" || value === "active" || value === "restricted") return value;
  return "not_connected";
}

export function businessDataJson(data: StripeBusinessData = DEFAULT_STRIPE_BUSINESS_DATA): string {
  return JSON.stringify(data);
}

export function buildMockStripeAccountId(tenantId: string): string {
  const suffix = tenantId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 14) || "tenant";
  return `acct_mock_${suffix}`;
}

export function stripeErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("fetch failed") || message.includes("timed out")) {
    return "Stripeとの通信がタイムアウトしました。時間をおいてもう一度お試しください。";
  }
  if (message.trim()) {
    return "Stripe連携で確認が必要な問題が発生しました。入力内容とAPIキー設定を確認してください。";
  }
  return "Stripe連携を開始できませんでした。";
}

export async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = 12000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort("timed out"), timeoutMs);
  try {
    return await fetch(input, {
      ...init,
      signal: init.signal ?? controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function ensureShopSettingsRow(env: Pick<Cloudflare.Env, "DB">, tenantId: string): Promise<void> {
  const now = Date.now();
  await env.DB.prepare(
    `
    INSERT INTO shop_settings (
      id, tenant_id, store_name, store_slug, mall_subdomain, stripe_connect_state,
      stripe_connect_status, stripe_business_data_json, created_at, updated_at
    )
    VALUES (?, ?, '', '', '', 'not_connected', 'not_connected', ?, ?, ?)
    ON CONFLICT(tenant_id) DO NOTHING
    `,
  )
    .bind(`shopset_${tenantId}`, tenantId, businessDataJson(), now, now)
    .run();
}

type BusinessDataRow = {
  document_business_name: string | null;
  document_postal_code: string | null;
  document_address: string | null;
  document_phone: string | null;
  document_email: string | null;
  store_name: string | null;
  contact_email: string | null;
  corporate_name: string | null;
  settings_postal_code: string | null;
  address_line1: string | null;
  address_line2: string | null;
};

export async function getStripeBusinessData(env: Pick<Cloudflare.Env, "DB">, tenantId: string): Promise<StripeBusinessData> {
  const row = await env.DB.prepare(
    `
    SELECT
      d.business_name AS document_business_name,
      d.postal_code AS document_postal_code,
      d.address AS document_address,
      d.phone AS document_phone,
      d.email AS document_email,
      s.store_name,
      s.contact_email,
      s.corporate_name,
      s.postal_code AS settings_postal_code,
      s.address_line1,
      s.address_line2
    FROM shop_settings s
    LEFT JOIN shop_document_settings d ON d.tenant_id = s.tenant_id
    WHERE s.tenant_id = ?
    LIMIT 1
    `,
  )
    .bind(tenantId)
    .first<BusinessDataRow>();

  const companyName =
    firstText(row?.document_business_name, row?.corporate_name, row?.store_name);
  const postalCode = firstText(row?.document_postal_code, row?.settings_postal_code, DEFAULT_STRIPE_BUSINESS_DATA.postalCode);
  const address = firstText(row?.document_address, joinAddress(row?.address_line1, row?.address_line2));
  const phone = firstText(row?.document_phone, DEFAULT_STRIPE_BUSINESS_DATA.phone);
  const email = firstText(row?.document_email, row?.contact_email, DEFAULT_STRIPE_BUSINESS_DATA.email);
  const hasRealData = Boolean(firstText(row?.document_business_name, row?.corporate_name, row?.store_name));

  return {
    ...DEFAULT_STRIPE_BUSINESS_DATA,
    representativeName: "",
    companyName,
    location: address,
    postalCode,
    addressLine1: address,
    phone,
    email,
    dataSource: hasRealData ? "shop_settings" : "phase13_failsafe_mock",
  };
}

function firstText(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const text = value?.trim();
    if (text) return text;
  }
  return "";
}

function joinAddress(...values: Array<string | null | undefined>): string {
  return values.map((value) => value?.trim()).filter(Boolean).join(" ");
}
