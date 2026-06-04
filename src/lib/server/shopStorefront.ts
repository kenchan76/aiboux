import { env } from "cloudflare:workers";
import { defaultStorefrontLayout, parseStorefrontLayoutJson, type StorefrontLayout } from "@/lib/shopStorefrontLayout";

export type ShopStorefrontProfile = {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  storeName: string;
  contactEmail: string;
  businessName: string;
  postalCode: string;
  address: string;
  phone: string;
  tokushohoText: string;
  privacyPolicyText: string;
};

export type ShopStorefrontProduct = {
  id: string;
  tenantId: string;
  displayName: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  salePrice: number;
  imageUrl: string;
  imageAlt: string;
  categoryName: string;
  sku: string;
  stockQuantity: number;
  inStock: boolean;
  updatedAt: number;
};

export type ShopStorefrontCategory = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
};

type TenantProfileRow = {
  tenant_id: string;
  tenant_slug: string;
  tenant_name: string;
  store_name: string | null;
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
};

type ProductRow = {
  id: string;
  tenant_id: string;
  display_name: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  sale_price: number | null;
  image_r2_keys: string | null;
  ai_alt_texts_json: string | null;
  google_category_id: string | null;
  category_name: string | null;
  jan_code: string | null;
  stock_quantity: number | null;
  core_status: string | null;
  updated_at: number | null;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  product_count: number;
};

type LayoutRow = {
  layout_json: string;
};

export async function getShopStorefrontProfile(tenantSlug: string): Promise<ShopStorefrontProfile | null> {
  try {
    const row = await env.DB.prepare(
      `
      SELECT
        t.id AS tenant_id,
        t.slug AS tenant_slug,
        t.name AS tenant_name,
        ss.store_name,
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
        ds.email AS document_email
      FROM tenants t
      LEFT JOIN shop_settings ss
        ON ss.tenant_id = t.id
       AND ss.deleted_at IS NULL
      LEFT JOIN shop_document_settings ds
        ON ds.tenant_id = t.id
      WHERE t.slug = ?
        AND t.status = 'active'
        AND t.is_active = 1
      LIMIT 1
      `,
    )
      .bind(tenantSlug)
      .first<TenantProfileRow>();

    if (row) return mapProfileRow(row);

    if (tenantSlug !== "aiboux") return null;

    const fallbackRow = await env.DB.prepare(
      `
      SELECT
        t.id AS tenant_id,
        t.slug AS tenant_slug,
        t.name AS tenant_name,
        ss.store_name,
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
        ds.email AS document_email
      FROM tenants t
      LEFT JOIN shop_settings ss
        ON ss.tenant_id = t.id
       AND ss.deleted_at IS NULL
      LEFT JOIN shop_document_settings ds
        ON ds.tenant_id = t.id
      WHERE t.status = 'active'
        AND t.is_active = 1
      ORDER BY t.created_at ASC
      LIMIT 1
      `,
    ).first<TenantProfileRow>();

    if (fallbackRow) return mapProfileRow({ ...fallbackRow, tenant_slug: "aiboux" });

    return {
      tenantId: "tenant_001",
      tenantSlug: "aiboux",
      tenantName: "AIBOUX Store",
      storeName: "AIBOUX Store",
      contactEmail: "",
      businessName: "AIBOUX Store",
      postalCode: "",
      address: "",
      phone: "",
      tokushohoText: buildTokushohoText({ businessName: "AIBOUX Store", postalCode: "", address: "", phone: "", email: "" }),
      privacyPolicyText: buildPrivacyPolicyText({ businessName: "AIBOUX Store", email: "" }),
    };
  } catch {
    return {
      tenantId: "tenant_001",
      tenantSlug: "aiboux",
      tenantName: "AIBOUX Store",
      storeName: "AIBOUX Store",
      contactEmail: "",
      businessName: "AIBOUX Store",
      postalCode: "",
      address: "",
      phone: "",
      tokushohoText: buildTokushohoText({ businessName: "AIBOUX Store", postalCode: "", address: "", phone: "", email: "" }),
      privacyPolicyText: buildPrivacyPolicyText({ businessName: "AIBOUX Store", email: "" }),
    };
  }
}

function mapProfileRow(row: TenantProfileRow): ShopStorefrontProfile {
    const businessName = row.business_name || row.corporate_name || row.store_name || row.tenant_name || "AIBOUX Store";
    const email = row.document_email || row.contact_email || "";
    const postalCode = row.document_postal_code || row.postal_code || "";
    const address = row.document_address || row.address_line1 || "";
    const phone = row.phone || "";

    return {
      tenantId: row.tenant_id,
      tenantSlug: row.tenant_slug,
      tenantName: row.tenant_name,
      storeName: row.store_name || row.tenant_name || "AIBOUX Store",
      contactEmail: email,
      businessName,
      postalCode,
      address,
      phone,
      tokushohoText: row.tokushoho_text || buildTokushohoText({ businessName, postalCode, address, phone, email }),
      privacyPolicyText: row.privacy_policy_text || buildPrivacyPolicyText({ businessName, email }),
    };
}

export async function listShopStorefrontProducts(tenantId: string): Promise<ShopStorefrontProduct[]> {
  try {
    const rows = (await env.DB.prepare(
      `
      SELECT
        sp.id,
        sp.tenant_id,
        sp.display_name,
        sp.description,
        sp.seo_title,
        sp.seo_description,
        sp.sale_price,
        sp.image_r2_keys,
        sp.ai_alt_texts_json,
        sp.google_category_id,
        sc.name AS category_name,
        cp.jan_code,
        cp.stock_quantity,
        cp.status AS core_status,
        sp.updated_at
      FROM shop_products sp
      LEFT JOIN shop_categories sc
        ON sc.tenant_id = sp.tenant_id
       AND sc.id = sp.category_id
       AND sc.deleted_at IS NULL
      LEFT JOIN core_products cp
        ON cp.tenant_id = sp.tenant_id
       AND cp.id = sp.core_product_id
       AND cp.deleted_at IS NULL
      WHERE sp.tenant_id = ?
        AND sp.publish_state = 'published'
        AND sp.deleted_at IS NULL
      ORDER BY sp.updated_at DESC
      LIMIT 120
      `,
    )
      .bind(tenantId)
      .all<ProductRow>()).results ?? [];

    return rows.map(mapProductRow);
  } catch {
    return [];
  }
}

export async function getShopStorefrontProduct(tenantId: string, productId: string): Promise<ShopStorefrontProduct | null> {
  try {
    const row = await env.DB.prepare(
      `
      SELECT
        sp.id,
        sp.tenant_id,
        sp.display_name,
        sp.description,
        sp.seo_title,
        sp.seo_description,
        sp.sale_price,
        sp.image_r2_keys,
        sp.ai_alt_texts_json,
        sp.google_category_id,
        sc.name AS category_name,
        cp.jan_code,
        cp.stock_quantity,
        cp.status AS core_status,
        sp.updated_at
      FROM shop_products sp
      LEFT JOIN shop_categories sc
        ON sc.tenant_id = sp.tenant_id
       AND sc.id = sp.category_id
       AND sc.deleted_at IS NULL
      LEFT JOIN core_products cp
        ON cp.tenant_id = sp.tenant_id
       AND cp.id = sp.core_product_id
       AND cp.deleted_at IS NULL
      WHERE sp.tenant_id = ?
        AND sp.id = ?
        AND sp.publish_state = 'published'
        AND sp.deleted_at IS NULL
      LIMIT 1
      `,
    )
      .bind(tenantId, productId)
      .first<ProductRow>();

    return row ? mapProductRow(row) : null;
  } catch {
    return null;
  }
}

export async function listShopStorefrontCategories(tenantId: string): Promise<ShopStorefrontCategory[]> {
  try {
    const rows = (await env.DB.prepare(
      `
      SELECT
        sc.id,
        sc.name,
        sc.slug,
        COUNT(sp.id) AS product_count
      FROM shop_categories sc
      LEFT JOIN shop_products sp
        ON sp.tenant_id = sc.tenant_id
       AND sp.category_id = sc.id
       AND sp.publish_state = 'published'
       AND sp.deleted_at IS NULL
      WHERE sc.tenant_id = ?
        AND sc.status = 'active'
        AND sc.deleted_at IS NULL
      GROUP BY sc.id, sc.name, sc.slug
      ORDER BY sc.sort_order ASC, sc.name ASC
      LIMIT 80
      `,
    )
      .bind(tenantId)
      .all<CategoryRow>()).results ?? [];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      productCount: Number(row.product_count ?? 0),
    }));
  } catch {
    return [];
  }
}

export async function getShopStorefrontLayout(tenantId: string): Promise<StorefrontLayout> {
  try {
    const row = await env.DB.prepare(
      `
      SELECT layout_json
      FROM shop_storefront_layouts
      WHERE tenant_id = ?
        AND status = 'published'
      LIMIT 1
      `,
    )
      .bind(tenantId)
      .first<LayoutRow>();

    return row ? parseStorefrontLayoutJson(row.layout_json) : defaultStorefrontLayout;
  } catch {
    return defaultStorefrontLayout;
  }
}

export function formatShopPrice(value: number): string {
  return `¥${Math.max(0, Number(value) || 0).toLocaleString("ja-JP")}`;
}

export function buildShippingText(profile: ShopStorefrontProfile): string {
  return [
    "配送方法と送料は、注文内容と配送先に応じてチェックアウト画面で確認します。",
    "決済設定が完了していない場合、購入者に誤解を与える注文確定画面は表示しません。",
    `発送元または販売者: ${profile.businessName}`,
    `問い合わせ先: ${profile.contactEmail || profile.phone || "未設定"}`,
  ].join("\n");
}

export function buildReturnsText(profile: ShopStorefrontProfile): string {
  return [
    "返品・交換は商品到着後7日以内にお問い合わせください。",
    "不良品または誤配送の場合は、販売者確認後に交換または返金を案内します。",
    "購入者都合の返品可否、返送料、対象外条件は商品状態と注文内容により確認します。",
    `問い合わせ先: ${profile.contactEmail || profile.phone || "未設定"}`,
  ].join("\n");
}

function mapProductRow(row: ProductRow): ShopStorefrontProduct {
  const imageKeys = parseStringArray(row.image_r2_keys);
  const altTexts = parseStringArray(row.ai_alt_texts_json);
  const stockQuantity = Number(row.stock_quantity ?? 0);
  return {
    id: row.id,
    tenantId: row.tenant_id,
    displayName: row.display_name,
    description: row.description || row.seo_description || "",
    seoTitle: row.seo_title || row.display_name,
    seoDescription: row.seo_description || row.description || "",
    salePrice: Number(row.sale_price ?? 0),
    imageUrl: imageKeys[0] ? `/shop/api/assets/${imageKeys[0]}` : "",
    imageAlt: altTexts[0] || row.display_name,
    categoryName: row.category_name || row.google_category_id || "未分類",
    sku: row.jan_code || row.id,
    stockQuantity,
    inStock: row.core_status !== "paused" && stockQuantity > 0,
    updatedAt: Number(row.updated_at ?? 0),
  };
}

function parseStringArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
  } catch {
    return [];
  }
}

function buildTokushohoText(input: { businessName: string; postalCode: string; address: string; phone: string; email: string }): string {
  return [
    `販売業者: ${input.businessName}`,
    `所在地: ${[input.postalCode, input.address].filter(Boolean).join(" ") || "未設定"}`,
    `連絡先: ${input.email || input.phone || "未設定"}`,
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
    `個人情報に関するお問い合わせ先: ${input.email || "未設定"}`,
  ].join("\n");
}
