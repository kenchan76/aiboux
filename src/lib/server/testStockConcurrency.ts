export type StockUpdateChannel = 'b2b_order' | 'b2b_purchase' | 'shop_ec' | 'regi_pos' | 'stock_take';

export interface StockUpdateRequest {
  tenantId: string;
  productId: string;
  channel: StockUpdateChannel;
  referenceId: string;
  quantityChange: number;
}

export type StockUpdateResult =
  | {
      success: true;
      transactionId: string;
      productId: string;
      productName: string;
      channel: StockUpdateChannel;
      referenceId: string;
      previousStock: number;
      updatedStock: number;
      quantityChange: number;
      attempts: number;
    }
  | {
      success: false;
      productId?: string;
      productName?: string;
      channel: StockUpdateChannel;
      referenceId: string;
      quantityChange: number;
      currentStock?: number;
      attempts: number;
      error: string;
    };

type ProductStockRow = {
  id: string;
  name: string;
  current_stock: number;
};

const maxRetryAttempts = 8;

export async function processStockUpdate(db: D1Database, req: StockUpdateRequest): Promise<StockUpdateResult> {
  const normalized = normalizeRequest(req);
  const transactionId = `tx_inv_${crypto.randomUUID()}`;

  for (let attempt = 1; attempt <= maxRetryAttempts; attempt += 1) {
    const product = await db.prepare(
      'SELECT id, name, current_stock FROM b2b_products WHERE tenant_id = ? AND id = ? AND is_active = 1 LIMIT 1',
    )
      .bind(normalized.tenantId, normalized.productId)
      .first<ProductStockRow>();

    if (!product) {
      return {
        success: false,
        channel: normalized.channel,
        referenceId: normalized.referenceId,
        quantityChange: normalized.quantityChange,
        attempts: attempt,
        error: '該当商品がマスタに存在しません',
      };
    }

    const previousStock = Number(product.current_stock);
    const updatedStock = previousStock + normalized.quantityChange;

    if (updatedStock < 0) {
      return {
        success: false,
        productId: product.id,
        productName: product.name,
        channel: normalized.channel,
        referenceId: normalized.referenceId,
        quantityChange: normalized.quantityChange,
        currentStock: previousStock,
        attempts: attempt,
        error: `在庫不足です。現在庫: ${previousStock}, 要求: ${Math.abs(normalized.quantityChange)}`,
      };
    }

    const updateResult = await db.prepare(
      `
      UPDATE b2b_products
      SET current_stock = ?, updated_at = unixepoch() * 1000
      WHERE tenant_id = ?
        AND id = ?
        AND current_stock = ?
        AND current_stock + ? >= 0
      `,
    )
      .bind(updatedStock, normalized.tenantId, normalized.productId, previousStock, normalized.quantityChange)
      .run();

    if ((updateResult.meta.changes ?? 0) !== 1) {
      await jitter(attempt);
      continue;
    }

    await db.prepare(
      `
      INSERT INTO inventory_transactions (
        id, tenant_id, product_id, source, delta, before_stock, after_stock, reason, reference_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
      .bind(
        transactionId,
        normalized.tenantId,
        normalized.productId,
        mapChannelToSource(normalized.channel),
        normalized.quantityChange,
        previousStock,
        updatedStock,
        normalized.channel,
        normalized.referenceId,
      )
      .run();

    return {
      success: true,
      transactionId,
      productId: product.id,
      productName: product.name,
      channel: normalized.channel,
      referenceId: normalized.referenceId,
      previousStock,
      updatedStock,
      quantityChange: normalized.quantityChange,
      attempts: attempt,
    };
  }

  return {
    success: false,
    productId: normalized.productId,
    channel: normalized.channel,
    referenceId: normalized.referenceId,
    quantityChange: normalized.quantityChange,
    attempts: maxRetryAttempts,
    error: '在庫更新の競合が解消できませんでした。再試行してください。',
  };
}

export async function runTripleSyncSimulation(db: D1Database, tenantId: string, productId: string): Promise<{
  success: true;
  results: StockUpdateResult[];
  finalStockInDatabase: number | null;
  transactionCount: number;
}> {
  const suffix = crypto.randomUUID().slice(0, 8);
  const simulatedRequests: StockUpdateRequest[] = [
    { tenantId, productId, channel: 'shop_ec', referenceId: `ec_ord_001_${suffix}`, quantityChange: -1 },
    { tenantId, productId, channel: 'shop_ec', referenceId: `ec_ord_002_${suffix}`, quantityChange: -2 },
    { tenantId, productId, channel: 'regi_pos', referenceId: `pos_tx_777_${suffix}`, quantityChange: -1 },
    { tenantId, productId, channel: 'b2b_order', referenceId: `yamato_csv_out_${suffix}`, quantityChange: -5 },
  ];

  const results = await Promise.all(simulatedRequests.map((request) => processStockUpdate(db, request)));
  const finalProduct = await db.prepare(
    'SELECT current_stock FROM b2b_products WHERE tenant_id = ? AND id = ? LIMIT 1',
  )
    .bind(tenantId, productId)
    .first<{ current_stock: number }>();

  const transactionCount = results.filter((result) => result.success).length;

  return {
    success: true,
    results,
    finalStockInDatabase: typeof finalProduct?.current_stock === 'number' ? finalProduct.current_stock : null,
    transactionCount,
  };
}

function normalizeRequest(req: StockUpdateRequest): StockUpdateRequest {
  const quantityChange = Number(req.quantityChange);
  if (!req.tenantId || !req.productId || !req.referenceId || !Number.isSafeInteger(quantityChange) || quantityChange === 0) {
    throw new Error('tenantId, productId, referenceId, and non-zero integer quantityChange are required.');
  }

  return {
    tenantId: req.tenantId.trim(),
    productId: req.productId.trim(),
    channel: req.channel,
    referenceId: req.referenceId.trim(),
    quantityChange,
  };
}

function mapChannelToSource(channel: StockUpdateChannel): 'b2b' | 'shop' | 'regi' | 'manual' {
  if (channel === 'shop_ec') return 'shop';
  if (channel === 'regi_pos') return 'regi';
  if (channel === 'stock_take') return 'manual';
  return 'b2b';
}

function jitter(attempt: number): Promise<void> {
  const delayMs = Math.min(20, attempt * 2);
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}
