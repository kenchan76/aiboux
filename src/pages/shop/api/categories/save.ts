import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import {
  ProductApiError,
  booleanValue,
  numberValue,
  productError,
  productJson,
  readJsonBody,
  textValue,
  withTenant,
} from "@/lib/server/productMasterApi";

export const prerender = false;

type SaveCategoryBody = {
  id?: unknown;
  name?: unknown;
  slug?: unknown;
  googleCategoryId?: unknown;
  googleCategoryName?: unknown;
  feedEnabled?: unknown;
  sortOrder?: unknown;
  status?: unknown;
  actorId?: unknown;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<SaveCategoryBody>(request);
    const name = textValue(body.name, "name", { required: true, maxLength: 120 });
    const slug = normalizeSlug(textValue(body.slug, "slug", { required: true, maxLength: 80 }));
    const googleCategoryId = textValue(body.googleCategoryId, "googleCategoryId", { required: true, maxLength: 40 }).replace(/\D/g, "");
    if (!googleCategoryId) throw new ProductApiError("googleCategoryId is required.", 400);

    const googleCategoryName = textValue(body.googleCategoryName, "googleCategoryName", { maxLength: 300 });
    const status = normalizeStatus(textValue(body.status, "status"));
    const feedEnabled = booleanValue(body.feedEnabled, true) ? 1 : 0;
    const sortOrder = Math.trunc(numberValue(body.sortOrder, "sortOrder", { min: 0, defaultValue: 100 }));
    const actorId = textValue(body.actorId, "actorId", { maxLength: 120 }) || null;
    const now = Date.now();
    const id = textValue(body.id, "id", { maxLength: 120 }) || `shopcat_${tenant.tenantId}_${slug}`;

    await env.DB.prepare(
      `
      INSERT INTO shop_categories (
        id,
        tenant_id,
        category_code,
        name,
        slug,
        description,
        sort_order,
        status,
        google_category_id,
        google_category_name,
        feed_enabled,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(tenant_id, category_code) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        sort_order = excluded.sort_order,
        status = excluded.status,
        google_category_id = excluded.google_category_id,
        google_category_name = excluded.google_category_name,
        feed_enabled = excluded.feed_enabled,
        updated_by = excluded.updated_by,
        updated_at = excluded.updated_at,
        deleted_at = NULL
      `,
    )
      .bind(
        id,
        tenant.tenantId,
        slug,
        name,
        slug,
        googleCategoryName ? `Google Shopping: ${googleCategoryName}` : "",
        sortOrder,
        status,
        googleCategoryId,
        googleCategoryName,
        feedEnabled,
        actorId,
        actorId,
        now,
        now,
      )
      .run();

    return productJson({
      success: true,
      category: {
        id,
        name,
        slug,
        categoryCode: slug,
        googleCategoryId,
        googleCategoryName,
        feedEnabled: feedEnabled === 1,
        sortOrder,
        status,
      },
    });
  } catch (error) {
    return productError(error);
  }
};

function normalizeSlug(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  if (!slug) throw new ProductApiError("slug is required.", 400);
  return slug;
}

function normalizeStatus(value: string): "active" | "hidden" {
  if (!value || value === "active") return "active";
  if (value === "hidden") return "hidden";
  throw new ProductApiError("status must be active or hidden.", 400);
}
