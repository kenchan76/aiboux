import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { productError, productJson, readJsonBody, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type OmnichannelBody = {
  googleShoppingAutoSync?: unknown;
  bingShoppingAutoSync?: unknown;
  aiImageOptimization?: unknown;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    await ensureSettingsRow(tenant.tenantId);
    const row = await env.DB.prepare(
      `
      SELECT
        google_shopping_auto_sync_enabled,
        bing_shopping_auto_sync_enabled,
        ai_image_optimization_enabled,
        omnichannel_updated_at
      FROM shop_settings
      WHERE tenant_id = ?
        AND deleted_at IS NULL
      LIMIT 1
      `,
    )
      .bind(tenant.tenantId)
      .first<{
        google_shopping_auto_sync_enabled: number;
        bing_shopping_auto_sync_enabled: number;
        ai_image_optimization_enabled: number;
        omnichannel_updated_at: number | null;
      }>();

    return productJson({
      success: true,
      settings: {
        googleShoppingAutoSync: row?.google_shopping_auto_sync_enabled !== 0,
        bingShoppingAutoSync: row?.bing_shopping_auto_sync_enabled !== 0,
        aiImageOptimization: row?.ai_image_optimization_enabled !== 0,
        updatedAt: row?.omnichannel_updated_at ?? null,
      },
    });
  } catch (error) {
    return productError(error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<OmnichannelBody>(request);
    const now = Date.now();
    await ensureSettingsRow(tenant.tenantId);
    await env.DB.prepare(
      `
      UPDATE shop_settings
      SET google_shopping_auto_sync_enabled = ?,
          bing_shopping_auto_sync_enabled = ?,
          ai_image_optimization_enabled = ?,
          omnichannel_updated_at = ?,
          updated_at = ?
      WHERE tenant_id = ?
        AND deleted_at IS NULL
      `,
    )
      .bind(
        boolToInt(body.googleShoppingAutoSync, true),
        boolToInt(body.bingShoppingAutoSync, true),
        boolToInt(body.aiImageOptimization, true),
        now,
        now,
        tenant.tenantId,
      )
      .run();

    return productJson({
      success: true,
      settings: {
        googleShoppingAutoSync: boolToInt(body.googleShoppingAutoSync, true) === 1,
        bingShoppingAutoSync: boolToInt(body.bingShoppingAutoSync, true) === 1,
        aiImageOptimization: boolToInt(body.aiImageOptimization, true) === 1,
        updatedAt: now,
      },
    });
  } catch (error) {
    return productError(error);
  }
};

async function ensureSettingsRow(tenantId: string) {
  const now = Date.now();
  await env.DB.prepare(
    `
    INSERT INTO shop_settings (
      id,
      tenant_id,
      store_name,
      store_slug,
      mall_subdomain,
      created_at,
      updated_at
    )
    VALUES (?, ?, '', '', '', ?, ?)
    ON CONFLICT(tenant_id) DO NOTHING
    `,
  )
    .bind(`shop_settings_${tenantId}`, tenantId, now, now)
    .run();
}

function boolToInt(value: unknown, defaultValue: boolean): number {
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return value === 0 ? 0 : 1;
  if (typeof value === "string") return ["1", "true", "yes", "on"].includes(value.toLowerCase()) ? 1 : 0;
  return defaultValue ? 1 : 0;
}
