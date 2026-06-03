import { ProductApiError, id } from "@/lib/server/productMasterApi";

export type CoreInventoryOperation = "adjust" | "order" | "cancel" | "return" | "manual" | "sync";
export type CoreInventoryChannel = "core" | "shop" | "mall" | "pos" | "line" | "external";

export type CoreInventorySyncItem = {
  coreProductId?: string;
  coreSkuId?: string;
  skuCode?: string;
  shopProductId?: string;
  delta: number;
  referenceId?: string;
  referenceType?: string;
  idempotencyKey?: string;
  payload?: unknown;
};

export type CoreInventorySyncInput = {
  tenantId: string;
  items: CoreInventorySyncItem[];
  channel?: CoreInventoryChannel;
  source: string;
  operation: CoreInventoryOperation;
  actorId?: string | null;
};

export type CoreInventorySyncResult = {
  success: boolean;
  skipped?: boolean;
  coreProductId?: string;
  coreSkuId?: string | null;
  shopProductId?: string;
  skuCode?: string;
  delta: number;
  beforeStock?: number;
  afterStock?: number;
  logId?: string;
  error?: string;
};

type ProductInventoryRow = {
  core_product_id: string;
  core_sku_id: string | null;
  shop_product_id: string | null;
  sku_code: string | null;
  stock_quantity: number | null;
  sku_stock_quantity: number | null;
};

type ExistingLogRow = {
  id: string;
  core_product_id: string;
  core_sku_id: string | null;
  delta: number;
  before_stock: number;
  after_stock: number;
};

export async function syncCoreInventory(db: D1Database, input: CoreInventorySyncInput): Promise<CoreInventorySyncResult[]> {
  const tenantId = input.tenantId.trim();
  if (!tenantId) throw new ProductApiError("tenantId is required.", 400);
  if (!input.items.length) return [];

  const results: CoreInventorySyncResult[] = [];
  for (const item of input.items.slice(0, 100)) {
    results.push(await syncSingleItem(db, input, normalizeItem(item)));
  }
  return results;
}

function normalizeItem(item: CoreInventorySyncItem): CoreInventorySyncItem {
  const delta = Math.trunc(Number(item.delta));
  if (!Number.isFinite(delta) || delta === 0) throw new ProductApiError("delta must be a non-zero integer.", 400);
  return {
    ...item,
    coreProductId: cleanId(item.coreProductId),
    coreSkuId: cleanId(item.coreSkuId),
    skuCode: cleanId(item.skuCode),
    shopProductId: cleanId(item.shopProductId),
    referenceId: cleanId(item.referenceId),
    referenceType: cleanId(item.referenceType),
    idempotencyKey: cleanId(item.idempotencyKey),
    delta,
  };
}

async function syncSingleItem(
  db: D1Database,
  input: CoreInventorySyncInput,
  item: CoreInventorySyncItem,
): Promise<CoreInventorySyncResult> {
  if (item.idempotencyKey) {
    const existing = await db
      .prepare(
        `
        SELECT id, core_product_id, core_sku_id, delta, before_stock, after_stock
        FROM core_inventory_logs
        WHERE tenant_id = ?
          AND idempotency_key = ?
        LIMIT 1
        `,
      )
      .bind(input.tenantId, item.idempotencyKey)
      .first<ExistingLogRow>();

    if (existing) {
      return {
        success: true,
        skipped: true,
        coreProductId: existing.core_product_id,
        coreSkuId: existing.core_sku_id,
        delta: Number(existing.delta),
        beforeStock: Number(existing.before_stock),
        afterStock: Number(existing.after_stock),
        logId: existing.id,
      };
    }
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const row = await resolveProductRow(db, input.tenantId, item);
    if (!row) {
      return {
        success: false,
        shopProductId: item.shopProductId,
        coreProductId: item.coreProductId,
        coreSkuId: item.coreSkuId,
        skuCode: item.skuCode,
        delta: item.delta,
        error: "対象の商品またはSKUがCoreに見つかりません。",
      };
    }

    const beforeStock = Number(row.stock_quantity ?? 0);
    const afterStock = beforeStock + item.delta;
    if (afterStock < 0) {
      return {
        success: false,
        coreProductId: row.core_product_id,
        coreSkuId: row.core_sku_id,
        shopProductId: row.shop_product_id ?? item.shopProductId,
        skuCode: row.sku_code ?? item.skuCode,
        delta: item.delta,
        beforeStock,
        afterStock,
        error: "在庫数がマイナスになるため同期を中止しました。",
      };
    }

    const now = Date.now();
    const logId = id("cinv");
    const statements = [
      db
        .prepare(
          `
          UPDATE core_products
          SET stock_quantity = stock_quantity + ?,
              updated_by = ?,
              updated_at = ?
          WHERE tenant_id = ?
            AND id = ?
            AND deleted_at IS NULL
            AND stock_quantity = ?
            AND stock_quantity + ? >= 0
          `,
        )
        .bind(item.delta, input.actorId ?? null, now, input.tenantId, row.core_product_id, beforeStock, item.delta),
    ];

    if (row.core_sku_id) {
      const beforeSkuStock = Number(row.sku_stock_quantity ?? beforeStock);
      statements.push(
        db
          .prepare(
            `
            UPDATE core_product_skus
            SET stock_quantity = stock_quantity + ?,
                updated_by = ?,
                updated_at = ?
            WHERE tenant_id = ?
              AND id = ?
              AND deleted_at IS NULL
              AND stock_quantity = ?
              AND stock_quantity + ? >= 0
            `,
          )
          .bind(item.delta, input.actorId ?? null, now, input.tenantId, row.core_sku_id, beforeSkuStock, item.delta),
      );
    }

    statements.push(
      db
        .prepare(
          `
          INSERT INTO core_inventory_logs (
            id,
            tenant_id,
            core_product_id,
            core_sku_id,
            channel,
            source,
            operation,
            delta,
            before_stock,
            after_stock,
            reference_type,
            reference_id,
            idempotency_key,
            payload_json,
            actor_id,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
        )
        .bind(
          logId,
          input.tenantId,
          row.core_product_id,
          row.core_sku_id,
          input.channel ?? "core",
          input.source,
          input.operation,
          item.delta,
          beforeStock,
          afterStock,
          item.referenceType ?? "",
          item.referenceId ?? null,
          item.idempotencyKey ?? null,
          JSON.stringify(item.payload ?? {}),
          input.actorId ?? null,
          now,
        ),
    );

    if ((input.channel ?? "core") !== "core") {
      statements.push(
        db
          .prepare(
            `
            UPDATE core_channel_listings
            SET last_synced_at = ?,
                updated_by = ?,
                updated_at = ?
            WHERE tenant_id = ?
              AND core_product_id = ?
              AND channel = ?
              AND deleted_at IS NULL
            `,
          )
          .bind(now, input.actorId ?? null, now, input.tenantId, row.core_product_id, input.channel ?? "core"),
      );
    }

    const batchResults = await db.batch(statements);
    const productUpdateChanges = Number(batchResults[0]?.meta?.changes ?? 0);
    if (productUpdateChanges > 0) {
      return {
        success: true,
        coreProductId: row.core_product_id,
        coreSkuId: row.core_sku_id,
        shopProductId: row.shop_product_id ?? item.shopProductId,
        skuCode: row.sku_code ?? item.skuCode,
        delta: item.delta,
        beforeStock,
        afterStock,
        logId,
      };
    }
  }

  return {
    success: false,
    shopProductId: item.shopProductId,
    coreProductId: item.coreProductId,
    coreSkuId: item.coreSkuId,
    skuCode: item.skuCode,
    delta: item.delta,
    error: "在庫が同時更新されたため同期できませんでした。再試行してください。",
  };
}

async function resolveProductRow(db: D1Database, tenantId: string, item: CoreInventorySyncItem): Promise<ProductInventoryRow | null> {
  if (item.coreSkuId) {
    return db
      .prepare(
        `
        SELECT
          cp.id AS core_product_id,
          sku.id AS core_sku_id,
          NULL AS shop_product_id,
          sku.sku_code,
          cp.stock_quantity,
          sku.stock_quantity AS sku_stock_quantity
        FROM core_product_skus sku
        INNER JOIN core_products cp
          ON cp.tenant_id = sku.tenant_id
         AND cp.id = sku.core_product_id
         AND cp.deleted_at IS NULL
        WHERE sku.tenant_id = ?
          AND sku.id = ?
          AND sku.deleted_at IS NULL
        LIMIT 1
        `,
      )
      .bind(tenantId, item.coreSkuId)
      .first<ProductInventoryRow>();
  }

  if (item.shopProductId) {
    return db
      .prepare(
        `
        SELECT
          cp.id AS core_product_id,
          sku.id AS core_sku_id,
          sp.id AS shop_product_id,
          sku.sku_code,
          cp.stock_quantity,
          sku.stock_quantity AS sku_stock_quantity
        FROM shop_products sp
        INNER JOIN core_products cp
          ON cp.tenant_id = sp.tenant_id
         AND cp.id = sp.core_product_id
         AND cp.deleted_at IS NULL
        LEFT JOIN core_product_skus sku
          ON sku.tenant_id = cp.tenant_id
         AND sku.core_product_id = cp.id
         AND sku.deleted_at IS NULL
        WHERE sp.tenant_id = ?
          AND sp.id = ?
          AND sp.deleted_at IS NULL
        ORDER BY sku.created_at ASC
        LIMIT 1
        `,
      )
      .bind(tenantId, item.shopProductId)
      .first<ProductInventoryRow>();
  }

  if (item.skuCode) {
    return db
      .prepare(
        `
        SELECT
          cp.id AS core_product_id,
          sku.id AS core_sku_id,
          NULL AS shop_product_id,
          sku.sku_code,
          cp.stock_quantity,
          sku.stock_quantity AS sku_stock_quantity
        FROM core_product_skus sku
        INNER JOIN core_products cp
          ON cp.tenant_id = sku.tenant_id
         AND cp.id = sku.core_product_id
         AND cp.deleted_at IS NULL
        WHERE sku.tenant_id = ?
          AND sku.sku_code = ?
          AND sku.deleted_at IS NULL
        LIMIT 1
        `,
      )
      .bind(tenantId, item.skuCode)
      .first<ProductInventoryRow>();
  }

  if (item.coreProductId) {
    return db
      .prepare(
        `
        SELECT
          cp.id AS core_product_id,
          sku.id AS core_sku_id,
          NULL AS shop_product_id,
          sku.sku_code,
          cp.stock_quantity,
          sku.stock_quantity AS sku_stock_quantity
        FROM core_products cp
        LEFT JOIN core_product_skus sku
          ON sku.tenant_id = cp.tenant_id
         AND sku.core_product_id = cp.id
         AND sku.deleted_at IS NULL
        WHERE cp.tenant_id = ?
          AND cp.id = ?
          AND cp.deleted_at IS NULL
        ORDER BY sku.created_at ASC
        LIMIT 1
        `,
      )
      .bind(tenantId, item.coreProductId)
      .first<ProductInventoryRow>();
  }

  return null;
}

function cleanId(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, 240) : "";
}
