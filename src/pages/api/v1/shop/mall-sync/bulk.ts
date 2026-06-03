import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

type TenantRow = {
  id: string;
};

type ProductRow = {
  id: string;
  sku: string;
  name: string;
  current_stock: number;
  selling_price: number;
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json<Record<string, unknown>>();
    const tenantId = normalizeString(body.tenantId || body.tenant_id || request.headers.get('x-tenant-id') || locals.sso?.tenantId || locals.tenantId);
    const productIds = normalizeProductIds(body.productIds || body.product_ids);

    if (!tenantId || productIds.length === 0) {
      return Response.json({ success: false, error: 'tenantId と productIds が必要です。' }, { status: 400 });
    }

    if (locals.sso?.staffPlanType !== 'premium_980') {
      return Response.json(
        {
          success: false,
          error: '全モール一括更新はプレミアム従業員アカウントで利用できます。',
        },
        { status: 402 },
      );
    }

    const tenant = await env.DB.prepare(
      "SELECT id FROM tenants WHERE id = ? AND status = 'active' AND is_active = 1 LIMIT 1",
    )
      .bind(tenantId)
      .first<TenantRow>();

    if (!tenant) {
      return Response.json({ success: false, error: '有効な店舗が見つかりません。' }, { status: 404 });
    }

    const placeholders = productIds.map(() => '?').join(',');
    const productsResult = await env.DB.prepare(
      `
      SELECT id, sku, name, current_stock, selling_price
      FROM b2b_products
      WHERE tenant_id = ?
        AND is_active = 1
        AND id IN (${placeholders})
      ORDER BY sku ASC
      `,
    )
      .bind(tenantId, ...productIds)
      .all<ProductRow>();

    const products = productsResult.results;
    if (products.length === 0) {
      return Response.json({ success: false, error: '同期対象の商品が見つかりません。' }, { status: 404 });
    }

    const syncedAt = Date.now();
    const marketplaces = ['amazon_jp', 'rakuten_ichiba', 'yahoo_shopping'];
    const resultJson = {
      syncedAt,
      productCount: products.length,
      marketplaces,
      products: products.map((product) => ({
        id: product.id,
        sku: product.sku,
        stock: Number(product.current_stock),
        price: Number(product.selling_price),
      })),
    };

    await env.DB.prepare(
      `
      INSERT INTO b2b_ai_command_logs (
        id, tenant_id, command_text, function_name, arguments_json, result_json
      )
      VALUES (?, ?, ?, 'mall_sync_bulk_push', ?, ?)
      `,
    )
      .bind(
        `mall_sync_${crypto.randomUUID()}`,
        tenantId,
        `${products.length}件の商品をAmazon/Rakuten/Yahooへ一括同期`,
        JSON.stringify({ productIds, marketplaces }),
        JSON.stringify(resultJson),
      )
      .run();

    return Response.json({
      success: true,
      syncedAt,
      productCount: products.length,
      marketplaces,
      message: `${products.length}件の商品同期キューをD1に記録しました。`,
    });
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Mall sync failed.' }, { status: 500 });
  }
};

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeProductIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const ids = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => /^[A-Za-z0-9_:-]{1,96}$/.test(item));
  return [...new Set(ids)].slice(0, 200);
}
