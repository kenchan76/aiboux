import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { productError, productJson, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  category_code: string;
  google_category_id: string;
  google_category_name: string;
  feed_enabled: number;
  sort_order: number;
  status: "active" | "hidden" | "archived";
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const { results } = await env.DB.prepare(
      `
      SELECT
        id,
        name,
        slug,
        category_code,
        google_category_id,
        google_category_name,
        feed_enabled,
        sort_order,
        status
      FROM shop_categories
      WHERE tenant_id = ? AND deleted_at IS NULL
      ORDER BY sort_order ASC, name ASC
      `,
    )
      .bind(tenant.tenantId)
      .all<CategoryRow>();

    return productJson({
      success: true,
      categories: (results ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        categoryCode: row.category_code,
        googleCategoryId: row.google_category_id,
        googleCategoryName: row.google_category_name,
        feedEnabled: row.feed_enabled === 1,
        sortOrder: row.sort_order,
        status: row.status === "hidden" ? "hidden" : "active",
      })),
    });
  } catch (error) {
    return productError(error);
  }
};
