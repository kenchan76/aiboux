import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import {
  productError,
  productJson,
  readJsonBody,
  textValue,
  withTenant,
} from "@/lib/server/productMasterApi";
import {
  defaultStorefrontLayout,
  parseStorefrontLayoutJson,
  sanitizeStorefrontLayout,
  stringifyStorefrontLayout,
  type StorefrontLayout,
} from "@/lib/shopStorefrontLayout";

export const prerender = false;

type LayoutRow = {
  layout_json: string;
  version: number;
  status: string;
  updated_at: number;
};

type SaveLayoutBody = {
  layout?: unknown;
  actorId?: unknown;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const row = await env.DB.prepare(
      `
      SELECT layout_json, version, status, updated_at
      FROM shop_storefront_layouts
      WHERE tenant_id = ?
      LIMIT 1
      `,
    )
      .bind(tenant.tenantId)
      .first<LayoutRow>();

    return productJson({
      success: true,
      tenantId: tenant.tenantId,
      layout: row ? parseStorefrontLayoutJson(row.layout_json) : defaultStorefrontLayout,
      version: row?.version ?? 1,
      status: row?.status ?? "draft",
      updatedAt: row?.updated_at ?? null,
    });
  } catch (error) {
    return productError(error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<SaveLayoutBody>(request);
    const actorId = textValue(body.actorId, "actorId", { maxLength: 120 }) || null;
    const layout: StorefrontLayout = sanitizeStorefrontLayout(body.layout);
    const now = Date.now();

    await env.DB.prepare(
      `
      INSERT INTO shop_storefront_layouts (
        tenant_id,
        layout_json,
        version,
        status,
        updated_by,
        created_at,
        updated_at
      )
      VALUES (?, ?, 1, 'published', ?, ?, ?)
      ON CONFLICT(tenant_id) DO UPDATE SET
        layout_json = excluded.layout_json,
        version = 1,
        status = 'published',
        updated_by = excluded.updated_by,
        updated_at = excluded.updated_at
      `,
    )
      .bind(tenant.tenantId, stringifyStorefrontLayout(layout), actorId, now, now)
      .run();

    return productJson({
      success: true,
      tenantId: tenant.tenantId,
      layout,
      updatedAt: now,
    });
  } catch (error) {
    return productError(error);
  }
};
