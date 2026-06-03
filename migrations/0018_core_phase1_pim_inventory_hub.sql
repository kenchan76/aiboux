PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS core_product_skus (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  core_product_id TEXT NOT NULL,
  sku_code TEXT NOT NULL,
  sku_name TEXT NOT NULL DEFAULT '',
  jan_code TEXT,
  unit_quantity INTEGER NOT NULL DEFAULT 1 CHECK (unit_quantity > 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  source_channel TEXT NOT NULL DEFAULT 'core',
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (core_product_id) REFERENCES core_products(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, sku_code),
  UNIQUE (tenant_id, core_product_id, sku_code)
);

CREATE TABLE IF NOT EXISTS core_channel_listings (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  core_product_id TEXT NOT NULL,
  core_sku_id TEXT,
  channel TEXT NOT NULL CHECK (channel IN ('shop', 'mall', 'pos', 'line', 'external')),
  channel_product_id TEXT,
  channel_sku_id TEXT,
  listing_status TEXT NOT NULL DEFAULT 'draft' CHECK (listing_status IN ('draft', 'ready', 'published', 'paused', 'error', 'archived')),
  inventory_sync_enabled INTEGER NOT NULL DEFAULT 1 CHECK (inventory_sync_enabled IN (0, 1)),
  last_synced_at INTEGER,
  error_message TEXT NOT NULL DEFAULT '',
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (core_product_id) REFERENCES core_products(id) ON DELETE CASCADE,
  FOREIGN KEY (core_sku_id) REFERENCES core_product_skus(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS core_inventory_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  core_product_id TEXT NOT NULL,
  core_sku_id TEXT,
  channel TEXT NOT NULL DEFAULT 'core',
  source TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('adjust', 'order', 'cancel', 'return', 'manual', 'sync')),
  delta INTEGER NOT NULL,
  before_stock INTEGER NOT NULL,
  after_stock INTEGER NOT NULL,
  reference_type TEXT NOT NULL DEFAULT '',
  reference_id TEXT,
  idempotency_key TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}',
  actor_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (core_product_id) REFERENCES core_products(id) ON DELETE CASCADE,
  FOREIGN KEY (core_sku_id) REFERENCES core_product_skus(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_core_channel_listings_unique_channel
  ON core_channel_listings(tenant_id, channel, channel_product_id, channel_sku_id)
  WHERE channel_product_id IS NOT NULL AND deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_core_inventory_logs_tenant_idempotency
  ON core_inventory_logs(tenant_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL AND idempotency_key != '';

CREATE INDEX IF NOT EXISTS idx_core_product_skus_tenant_product
  ON core_product_skus(tenant_id, core_product_id, status);

CREATE INDEX IF NOT EXISTS idx_core_product_skus_tenant_sku
  ON core_product_skus(tenant_id, sku_code, deleted_at);

CREATE INDEX IF NOT EXISTS idx_core_channel_listings_tenant_product
  ON core_channel_listings(tenant_id, core_product_id, channel, listing_status);

CREATE INDEX IF NOT EXISTS idx_core_channel_listings_tenant_status
  ON core_channel_listings(tenant_id, channel, listing_status, updated_at);

CREATE INDEX IF NOT EXISTS idx_core_inventory_logs_tenant_product_time
  ON core_inventory_logs(tenant_id, core_product_id, created_at DESC);

INSERT OR IGNORE INTO core_product_skus (
  id,
  tenant_id,
  core_product_id,
  sku_code,
  sku_name,
  jan_code,
  unit_quantity,
  stock_quantity,
  status,
  source_channel,
  created_by,
  updated_by,
  created_at,
  updated_at
)
SELECT
  'csku_' || lower(hex(randomblob(16))),
  cp.tenant_id,
  cp.id,
  COALESCE(NULLIF(cp.jan_code, ''), cp.id),
  cp.product_name,
  cp.jan_code,
  1,
  cp.stock_quantity,
  CASE WHEN cp.status IN ('active', 'paused', 'archived') THEN cp.status ELSE 'active' END,
  'migration',
  'system',
  'system',
  unixepoch() * 1000,
  unixepoch() * 1000
FROM core_products cp
WHERE cp.deleted_at IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM core_product_skus sku
    WHERE sku.tenant_id = cp.tenant_id
      AND sku.core_product_id = cp.id
      AND sku.deleted_at IS NULL
  );

INSERT OR IGNORE INTO core_channel_listings (
  id,
  tenant_id,
  core_product_id,
  core_sku_id,
  channel,
  channel_product_id,
  channel_sku_id,
  listing_status,
  inventory_sync_enabled,
  last_synced_at,
  metadata_json,
  created_by,
  updated_by,
  created_at,
  updated_at
)
SELECT
  'ccl_' || lower(hex(randomblob(16))),
  sp.tenant_id,
  sp.core_product_id,
  sku.id,
  'shop',
  sp.id,
  NULL,
  CASE sp.publish_state
    WHEN 'published' THEN 'published'
    WHEN 'paused' THEN 'paused'
    WHEN 'archived' THEN 'archived'
    ELSE 'draft'
  END,
  1,
  unixepoch() * 1000,
  json_object('shop_name', sp.shop_name, 'display_name', sp.display_name),
  'system',
  'system',
  unixepoch() * 1000,
  unixepoch() * 1000
FROM shop_products sp
LEFT JOIN core_product_skus sku
  ON sku.tenant_id = sp.tenant_id
 AND sku.core_product_id = sp.core_product_id
 AND sku.deleted_at IS NULL
WHERE sp.deleted_at IS NULL;

UPDATE core_products
SET shop_sync_enabled = 1,
    updated_at = unixepoch() * 1000
WHERE deleted_at IS NULL
  AND EXISTS (
    SELECT 1
    FROM shop_products sp
    WHERE sp.tenant_id = core_products.tenant_id
      AND sp.core_product_id = core_products.id
      AND sp.deleted_at IS NULL
  );
