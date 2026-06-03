import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import {
  booleanValue,
  productError,
  productJson,
  readJsonBody,
  textValue,
  withTenant,
} from "@/lib/server/productMasterApi";

export const prerender = false;

type SocialSettingsBody = {
  xOnProductPublish?: unknown;
  instagramOnProductPublish?: unknown;
  lineOnProductPublish?: unknown;
  xOnSaleStart?: unknown;
  lineOnLowStock?: unknown;
  xTemplate?: unknown;
  instagramTemplate?: unknown;
  lineTemplate?: unknown;
  actorId?: unknown;
};

type SocialSettingsRow = {
  x_on_product_publish: number;
  instagram_on_product_publish: number;
  line_on_product_publish: number;
  x_on_sale_start: number;
  line_on_low_stock: number;
  x_template: string;
  instagram_template: string;
  line_template: string;
  updated_at: number | null;
};

const defaultSettings = {
  xOnProductPublish: false,
  instagramOnProductPublish: false,
  lineOnProductPublish: false,
  xOnSaleStart: false,
  lineOnLowStock: false,
  xTemplate: '新商品「{productName}」を公開しました。価格: {price} {storeUrl}',
  instagramTemplate: '新商品のお知らせ: {productName}\n{description}\n{storeUrl}',
  lineTemplate: '新商品「{productName}」を公開しました。{storeUrl}',
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const row = await env.DB.prepare(
      `
      SELECT
        x_on_product_publish,
        instagram_on_product_publish,
        line_on_product_publish,
        x_on_sale_start,
        line_on_low_stock,
        x_template,
        instagram_template,
        line_template,
        updated_at
      FROM shop_social_settings
      WHERE tenant_id = ?
      LIMIT 1
      `,
    )
      .bind(tenant.tenantId)
      .first<SocialSettingsRow>();

    return productJson({
      success: true,
      settings: row ? mapRow(row) : { ...defaultSettings, updatedAt: null },
    });
  } catch (error) {
    return productError(error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<SocialSettingsBody>(request);
    const actorId = textValue(body.actorId, "actorId", { maxLength: 120 }) || null;
    const now = Date.now();
    const settings = {
      xOnProductPublish: booleanValue(body.xOnProductPublish, false),
      instagramOnProductPublish: booleanValue(body.instagramOnProductPublish, false),
      lineOnProductPublish: booleanValue(body.lineOnProductPublish, false),
      xOnSaleStart: booleanValue(body.xOnSaleStart, false),
      lineOnLowStock: booleanValue(body.lineOnLowStock, false),
      xTemplate: textValue(body.xTemplate, "xTemplate", { maxLength: 500 }) || defaultSettings.xTemplate,
      instagramTemplate: textValue(body.instagramTemplate, "instagramTemplate", { maxLength: 800 }) || defaultSettings.instagramTemplate,
      lineTemplate: textValue(body.lineTemplate, "lineTemplate", { maxLength: 500 }) || defaultSettings.lineTemplate,
    };

    await env.DB.prepare(
      `
      INSERT INTO shop_social_settings (
        tenant_id,
        x_on_product_publish,
        instagram_on_product_publish,
        line_on_product_publish,
        x_on_sale_start,
        line_on_low_stock,
        x_template,
        instagram_template,
        line_template,
        updated_by,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(tenant_id) DO UPDATE SET
        x_on_product_publish = excluded.x_on_product_publish,
        instagram_on_product_publish = excluded.instagram_on_product_publish,
        line_on_product_publish = excluded.line_on_product_publish,
        x_on_sale_start = excluded.x_on_sale_start,
        line_on_low_stock = excluded.line_on_low_stock,
        x_template = excluded.x_template,
        instagram_template = excluded.instagram_template,
        line_template = excluded.line_template,
        updated_by = excluded.updated_by,
        updated_at = excluded.updated_at
      `,
    )
      .bind(
        tenant.tenantId,
        settings.xOnProductPublish ? 1 : 0,
        settings.instagramOnProductPublish ? 1 : 0,
        settings.lineOnProductPublish ? 1 : 0,
        settings.xOnSaleStart ? 1 : 0,
        settings.lineOnLowStock ? 1 : 0,
        settings.xTemplate,
        settings.instagramTemplate,
        settings.lineTemplate,
        actorId,
        now,
        now,
      )
      .run();

    return productJson({
      success: true,
      settings: { ...settings, updatedAt: now },
    });
  } catch (error) {
    return productError(error);
  }
};

function mapRow(row: SocialSettingsRow) {
  return {
    xOnProductPublish: row.x_on_product_publish === 1,
    instagramOnProductPublish: row.instagram_on_product_publish === 1,
    lineOnProductPublish: row.line_on_product_publish === 1,
    xOnSaleStart: row.x_on_sale_start === 1,
    lineOnLowStock: row.line_on_low_stock === 1,
    xTemplate: row.x_template || defaultSettings.xTemplate,
    instagramTemplate: row.instagram_template || defaultSettings.instagramTemplate,
    lineTemplate: row.line_template || defaultSettings.lineTemplate,
    updatedAt: row.updated_at,
  };
}
