PRAGMA foreign_keys = ON;

CREATE UNIQUE INDEX IF NOT EXISTS idx_shop_settings_mall_subdomain_unique
  ON shop_settings(mall_subdomain)
  WHERE deleted_at IS NULL AND mall_subdomain <> '';

ALTER TABLE shop_social_post_drafts ADD COLUMN posted_url TEXT;

CREATE TABLE IF NOT EXISTS shop_social_settings (
  tenant_id TEXT PRIMARY KEY,
  x_on_product_publish INTEGER NOT NULL DEFAULT 1 CHECK (x_on_product_publish IN (0, 1)),
  instagram_on_product_publish INTEGER NOT NULL DEFAULT 0 CHECK (instagram_on_product_publish IN (0, 1)),
  line_on_product_publish INTEGER NOT NULL DEFAULT 1 CHECK (line_on_product_publish IN (0, 1)),
  x_on_sale_start INTEGER NOT NULL DEFAULT 1 CHECK (x_on_sale_start IN (0, 1)),
  line_on_low_stock INTEGER NOT NULL DEFAULT 1 CHECK (line_on_low_stock IN (0, 1)),
  x_template TEXT NOT NULL DEFAULT '新商品「{productName}」を公開しました。価格: {price} {storeUrl}',
  instagram_template TEXT NOT NULL DEFAULT '新商品のお知らせ: {productName}\n{description}\n{storeUrl}',
  line_template TEXT NOT NULL DEFAULT '新商品「{productName}」を公開しました。{storeUrl}',
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES shop_settings(tenant_id)
);

CREATE TABLE IF NOT EXISTS shop_order_operation_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  operation_type TEXT NOT NULL CHECK (operation_type IN ('cancel_refund', 'cancel_only', 'refund_only')),
  refund_status TEXT NOT NULL DEFAULT 'not_required' CHECK (refund_status IN ('not_required', 'mock_refunded', 'stripe_refunded', 'failed')),
  refund_amount INTEGER NOT NULL DEFAULT 0 CHECK (refund_amount >= 0),
  stripe_refund_id TEXT,
  reason TEXT NOT NULL DEFAULT '',
  inventory_restore_json TEXT NOT NULL DEFAULT '[]',
  request_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_shop_order_operation_logs_tenant_order
  ON shop_order_operation_logs(tenant_id, order_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_shop_social_post_drafts_posted_url
  ON shop_social_post_drafts(tenant_id, status, posted_url);
