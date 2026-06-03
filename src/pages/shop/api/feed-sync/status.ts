import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { productError, productJson, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type FeedSyncStatusRow = {
  product_id: string;
  status: string;
  availability: string;
  provider_results_json: string;
  final_synced_at: string | null;
  updated_at: string;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const rows = await env.DB.prepare(
      `
      SELECT
        product_id,
        status,
        availability,
        provider_results_json,
        final_synced_at,
        updated_at
      FROM shop_feed_sync_jobs
      WHERE tenant_id = ?
      ORDER BY queued_at DESC
      LIMIT 100
      `,
    )
      .bind(tenant.tenantId)
      .all<FeedSyncStatusRow>();

    const latestByProduct = new Map<string, FeedSyncStatusRow>();
    for (const row of rows.results ?? []) {
      if (!latestByProduct.has(row.product_id)) latestByProduct.set(row.product_id, row);
    }

    return productJson({
      success: true,
      products: Array.from(latestByProduct.entries()).map(([productId, row]) => ({
        productId,
        status: row.status,
        availability: row.availability,
        providers: parseProviderResults(row.provider_results_json),
        finalSyncedAt: row.final_synced_at,
        updatedAt: row.updated_at,
      })),
    });
  } catch (error) {
    return productError(error);
  }
};

function parseProviderResults(value: string): unknown[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
