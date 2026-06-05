import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { ProductApiError, productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";
import { sendShopAdminNotification } from "@/lib/server/shopNotificationEmail";

export const prerender = false;

type ProfileBody = {
  storeName?: unknown;
  storeUrl?: unknown;
  businessName?: unknown;
  postalCode?: unknown;
  address?: unknown;
  phone?: unknown;
  email?: unknown;
  invoiceRegistrationNumber?: unknown;
  logoR2Key?: unknown;
  logoUrl?: unknown;
  logoFileName?: unknown;
  actorId?: unknown;
};

type ProfileRow = {
  store_name: string | null;
  store_slug: string | null;
  mall_subdomain: string | null;
  contact_email: string | null;
  corporate_name: string | null;
  postal_code: string | null;
  address_line1: string | null;
  tokushoho_text: string | null;
  privacy_policy_text: string | null;
  business_name: string | null;
  document_postal_code: string | null;
  document_address: string | null;
  phone: string | null;
  document_email: string | null;
  invoice_registration_number: string | null;
  logo_r2_key: string | null;
  logo_url: string | null;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    assertTenantId(tenant.tenantId);
    const row = await env.DB.prepare(
      `
      SELECT
        ss.store_name,
        ss.store_slug,
        ss.mall_subdomain,
        ss.contact_email,
        ss.corporate_name,
        ss.postal_code,
        ss.address_line1,
        ss.tokushoho_text,
        ss.privacy_policy_text,
        ds.business_name,
        ds.postal_code AS document_postal_code,
        ds.address AS document_address,
        ds.phone,
        ds.email AS document_email,
        ds.invoice_registration_number,
        ds.logo_r2_key,
        ds.logo_url
      FROM shop_settings ss
      LEFT JOIN shop_document_settings ds
        ON ds.tenant_id = ss.tenant_id
      WHERE ss.tenant_id = ?
        AND ss.deleted_at IS NULL
      LIMIT 1
      `,
    )
      .bind(tenant.tenantId)
      .first<ProfileRow>();

    const businessName = row?.business_name || row?.corporate_name || "AIBOUX STORE";
    const email = row?.document_email || row?.contact_email || "support@shop.aiboux.com";
    const postalCode = row?.document_postal_code || row?.postal_code || "";
    const address = row?.document_address || row?.address_line1 || "";
    const phone = row?.phone || "";
    const profile = {
      storeName: row?.store_name || "AIBOUX STORE",
      storeUrl: row?.mall_subdomain ? `${row.mall_subdomain}.mall.aiboux.com` : "store.mall.aiboux.com",
      businessName,
      postalCode,
      address,
      phone,
      email,
      invoiceRegistrationNumber: row?.invoice_registration_number || "",
      logoR2Key: row?.logo_r2_key || "",
      logoUrl: row?.logo_url || "",
      logoFileName: row?.logo_r2_key ? row.logo_r2_key.split("/").pop() || "" : "",
      tokushohoText: row?.tokushoho_text || buildTokushohoText({ businessName, postalCode, address, phone, email }),
      privacyPolicyText: row?.privacy_policy_text || buildPrivacyPolicyText({ businessName, email }),
    };

    return productJson({ success: true, profile });
  } catch (error) {
    return productError(error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    assertTenantId(tenant.tenantId);
    const body = await readJsonBody<ProfileBody>(request);
    const now = Date.now();
    const actorId = textValue(body.actorId, "actorId", { maxLength: 120 }) || null;
    const storeName = textValue(body.storeName, "storeName", { required: true, maxLength: 120 });
    const businessName = textValue(body.businessName, "businessName", { required: true, maxLength: 180 });
    const postalCode = textValue(body.postalCode, "postalCode", { maxLength: 16 });
    const address = textValue(body.address, "address", { maxLength: 500 });
    const phone = textValue(body.phone, "phone", { maxLength: 40 });
    const email = textValue(body.email, "email", { maxLength: 180 });
    const invoiceRegistrationNumber = normalizeInvoiceNumber(
      textValue(body.invoiceRegistrationNumber, "invoiceRegistrationNumber", { maxLength: 20 }),
    );
    const requestedStoreUrl = textValue(body.storeUrl, "storeUrl", { required: true, maxLength: 180 });
    const storeSlug = normalizeStoreSlug(requestedStoreUrl);
    if (!storeSlug) {
      throw new ProductApiError("storeUrl must include at least one alphabet or number.", 400);
    }
    await assertMallSubdomainAvailable(tenant.tenantId, storeSlug);
    const tokushohoText = buildTokushohoText({ businessName, postalCode, address, phone, email });
    const privacyPolicyText = buildPrivacyPolicyText({ businessName, email });

    await env.DB.batch([
      env.DB.prepare(
        `
        INSERT INTO shop_settings (
          id,
          tenant_id,
          store_name,
          store_slug,
          mall_subdomain,
          contact_email,
          corporate_name,
          postal_code,
          address_line1,
          tokushoho_text,
          privacy_policy_text,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(tenant_id) DO UPDATE SET
          store_name = excluded.store_name,
          store_slug = excluded.store_slug,
          mall_subdomain = excluded.mall_subdomain,
          contact_email = excluded.contact_email,
          corporate_name = excluded.corporate_name,
          postal_code = excluded.postal_code,
          address_line1 = excluded.address_line1,
          tokushoho_text = excluded.tokushoho_text,
          privacy_policy_text = excluded.privacy_policy_text,
          updated_by = excluded.updated_by,
          updated_at = excluded.updated_at,
          deleted_at = NULL
        `,
      ).bind(
        `shopset_${tenant.tenantId}`,
        tenant.tenantId,
        storeName,
        storeSlug,
        storeSlug,
        email,
        businessName,
        postalCode,
        address,
        tokushohoText,
        privacyPolicyText,
        actorId,
        actorId,
        now,
        now,
      ),
      env.DB.prepare(
        `
        INSERT INTO shop_document_settings (
          tenant_id,
          business_name,
          postal_code,
          address,
          phone,
          email,
          invoice_registration_number,
          logo_r2_key,
          logo_url,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(tenant_id) DO UPDATE SET
          business_name = excluded.business_name,
          postal_code = excluded.postal_code,
          address = excluded.address,
          phone = excluded.phone,
          email = excluded.email,
          invoice_registration_number = excluded.invoice_registration_number,
          logo_r2_key = excluded.logo_r2_key,
          logo_url = excluded.logo_url,
          updated_by = excluded.updated_by,
          updated_at = excluded.updated_at
        `,
      ).bind(
        tenant.tenantId,
        businessName,
        postalCode,
        address,
        phone,
        email,
        invoiceRegistrationNumber,
        textValue(body.logoR2Key, "logoR2Key", { maxLength: 500 }),
        textValue(body.logoUrl, "logoUrl", { maxLength: 500 }),
        actorId,
        actorId,
        now,
        now,
      ),
    ]);

    const notification = await safeSendProfileNotification({
      tenantId: tenant.tenantId,
      storeName,
      businessName,
      email,
      savedAt: now,
    });

    return productJson({
      success: true,
      profile: {
        storeName,
        storeUrl: `${storeSlug}.mall.aiboux.com`,
        businessName,
        postalCode,
        address,
        phone,
        email,
        invoiceRegistrationNumber,
        logoR2Key: textValue(body.logoR2Key, "logoR2Key", { maxLength: 500 }),
        logoUrl: textValue(body.logoUrl, "logoUrl", { maxLength: 500 }),
        logoFileName: textValue(body.logoFileName, "logoFileName", { maxLength: 180 }),
        tokushohoText,
        privacyPolicyText,
      },
      notification,
    });
  } catch (error) {
    return productError(error);
  }
};

function assertTenantId(value: string): void {
  if (!/^[a-zA-Z0-9_-]{1,120}$/.test(value)) {
    throw new ProductApiError("Invalid tenant context.", 400);
  }
}

async function safeSendProfileNotification(input: {
  tenantId: string;
  storeName: string;
  businessName: string;
  email: string;
  savedAt: number;
}) {
  try {
    return await sendShopAdminNotification(env, {
      subject: "【AIBOUX Shop】ストア情報が保存されました",
      text: [
        "AIBOUX Shopでストア情報が保存されました。",
        "",
        `tenantId: ${input.tenantId}`,
        `店名: ${input.storeName}`,
        `事業者名: ${input.businessName}`,
        `連絡先メール: ${input.email || "連絡先確認中"}`,
        `保存日時: ${new Date(input.savedAt).toISOString()}`,
      ].join("\n"),
      tenantId: input.tenantId,
    });
  } catch (error) {
    return {
      attempted: true,
      ok: false,
      error: error instanceof Error ? error.message : "Notification failed after settings save.",
    };
  }
}

async function assertMallSubdomainAvailable(tenantId: string, mallSubdomain: string): Promise<void> {
  const existing = await env.DB.prepare(
    `
    SELECT tenant_id
    FROM shop_settings
    WHERE mall_subdomain = ?
      AND tenant_id <> ?
      AND deleted_at IS NULL
    LIMIT 1
    `,
  )
    .bind(mallSubdomain, tenantId)
    .first<{ tenant_id: string }>();

  if (existing) {
    throw new ProductApiError("このストアURLは既に使われています。別のURLを入力してください。", 409);
  }
}

function normalizeInvoiceNumber(value: string): string {
  const trimmed = value.trim().toUpperCase();
  if (!trimmed) return "";
  return trimmed.startsWith("T") ? trimmed : `T${trimmed}`;
}

function normalizeStoreSlug(value: string): string {
  const hostOrSlug = extractStoreHostOrSlug(value);
  const withoutSuffix = hostOrSlug.endsWith(".mall.aiboux.com")
    ? hostOrSlug.slice(0, -".mall.aiboux.com".length)
    : hostOrSlug;
  const slug = withoutSuffix
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  return slug;
}

function extractStoreHostOrSlug(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    return url.hostname;
  } catch {
    return trimmed;
  }
}

function buildTokushohoText(input: { businessName: string; postalCode: string; address: string; phone: string; email: string }): string {
  return [
    `販売業者: ${input.businessName}`,
    `所在地: ${[input.postalCode, input.address].filter(Boolean).join(" ") || "所在地確認中"}`,
    `連絡先: ${input.email || input.phone || "連絡先確認中"}`,
    "販売価格: 各商品ページに税込価格を表示します。",
    "商品代金以外の必要料金: 送料、決済手数料その他購入手続き画面で表示される費用。",
    "支払い方法: クレジットカードその他ストアで有効化された方法。",
    "商品の引渡時期: 決済確認後、商品ページまたは注文確認画面に記載の時期に発送します。",
    "返品・交換: 商品到着後7日以内にお問い合わせください。不良品の場合は当社負担で対応します。",
  ].join("\n");
}

function buildPrivacyPolicyText(input: { businessName: string; email: string }): string {
  return [
    `${input.businessName}は、注文処理、配送、問い合わせ対応、決済、ストア改善のために必要な範囲で個人情報を取得します。`,
    "取得する主な情報は、氏名、住所、電話番号、メールアドレス、注文内容、決済に必要な識別情報です。",
    "取得した情報は、配送会社、決済会社、システム運用委託先など業務遂行に必要な範囲で共有する場合があります。",
    "法令に基づく場合を除き、本人の同意なく目的外利用または不要な第三者提供を行いません。",
    `個人情報に関するお問い合わせ先: ${input.email || "問い合わせページから確認"}`,
  ].join("\n");
}
