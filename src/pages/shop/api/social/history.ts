import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { productError, productJson, safeLimit, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type SocialHistoryRow = {
  id: string;
  product_id: string;
  platform: string;
  post_content: string | null;
  status: string;
  scheduled_for: string | null;
  created_at: string | null;
  approved_at: string | null;
  posted_url: string | null;
  display_name: string | null;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const url = new URL(request.url);
    const limit = safeLimit(url.searchParams.get("limit"), 30, 100);
    const { results } = await env.DB.prepare(
      `
      SELECT
        d.id,
        d.product_id,
        d.platform,
        d.post_content,
        d.status,
        d.scheduled_for,
        d.created_at,
        d.approved_at,
        d.posted_url,
        sp.display_name
      FROM shop_social_post_drafts d
      LEFT JOIN shop_products sp
        ON sp.id = d.product_id
       AND sp.tenant_id = d.tenant_id
      WHERE d.tenant_id = ?
      ORDER BY COALESCE(d.approved_at, d.created_at) DESC
      LIMIT ?
      `,
    )
      .bind(tenant.tenantId, limit)
      .all<SocialHistoryRow>();

    return productJson({
      success: true,
      posts: (results ?? []).map((row) => ({
        id: row.id,
        productId: row.product_id,
        productName: row.display_name || row.product_id,
        platform: row.platform,
        content: row.post_content || "",
        status: row.status,
        scheduledFor: row.scheduled_for,
        createdAt: row.created_at,
        approvedAt: row.approved_at,
        postedUrl: row.posted_url || "",
      })),
    });
  } catch (error) {
    return productError(error);
  }
};
