import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { syncCoreInventory } from "@/lib/server/coreInventorySync";
import { ProductApiError, numberValue, productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type UpdateStockBody = {
  productId?: unknown;
  stock?: unknown;
  actorId?: unknown;
};

type ProductStockRow = {
  id: string;
  core_product_id: string;
  stock_quantity: number | null;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<UpdateStockBody>(request);
    const productId = textValue(body.productId, "productId", { required: true, maxLength: 160 });
    const nextStock = Math.trunc(numberValue(body.stock, "stock", { min: 0 }));
    const actorId = textValue(body.actorId, "actorId", { maxLength: 120 }) || null;
    const now = Date.now();

    const product = await env.DB.prepare(
      `
      SELECT sp.id, sp.core_product_id, cp.stock_quantity
      FROM shop_products sp
      INNER JOIN core_products cp
        ON cp.id = sp.core_product_id
       AND cp.tenant_id = sp.tenant_id
       AND cp.deleted_at IS NULL
      WHERE sp.tenant_id = ?
        AND sp.id = ?
        AND sp.deleted_at IS NULL
      LIMIT 1
      `,
    )
      .bind(tenant.tenantId, productId)
      .first<ProductStockRow>();

    if (!product) throw new ProductApiError("商品が見つかりません。商品保存後に在庫を更新してください。", 404);

    const previousStock = Number(product.stock_quantity ?? 0);
    const delta = nextStock - previousStock;
    const syncResults =
      delta === 0
        ? []
        : await syncCoreInventory(env.DB, {
            tenantId: tenant.tenantId,
            channel: "shop",
            source: "shop.inventory.update-stock",
            operation: "manual",
            actorId,
            items: [
              {
                coreProductId: product.core_product_id,
                shopProductId: product.id,
                delta,
                referenceType: "shop_product",
                referenceId: productId,
                idempotencyKey: `shop-stock-${tenant.tenantId}-${productId}-${now}`,
                payload: { requestedStock: nextStock, previousStock },
              },
            ],
          });

    const syncResult = syncResults[0] ?? null;
    if (syncResult && !syncResult.success) throw new ProductApiError(syncResult.error || "在庫数を更新できませんでした。", 409);

    return productJson({
      success: true,
      productId,
      coreProductId: product.core_product_id,
      previousStock,
      stock: syncResult?.afterStock ?? nextStock,
      inventoryLogId: syncResult?.logId ?? null,
      updatedAt: now,
    });
  } catch (error) {
    return productError(error);
  }
};
