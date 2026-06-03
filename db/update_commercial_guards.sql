PRAGMA foreign_keys = off;

ALTER TABLE tenants ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1));
ALTER TABLE products ADD COLUMN is_mall_listed INTEGER NOT NULL DEFAULT 1 CHECK (is_mall_listed IN (0, 1));

ALTER TABLE ec_orders RENAME TO ec_orders_legacy_commercial_guard;

CREATE TABLE ec_orders (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'JPY',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'canceled', 'failed')),
  payment_method TEXT NOT NULL DEFAULT 'stripe' CHECK (payment_method IN ('stripe', 'komoju')),
  provider_session_id TEXT UNIQUE,
  provider_payment_id TEXT,
  checkout_url TEXT,
  tracking_code TEXT,
  shipped_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT INTO ec_orders (
  id,
  tenant_id,
  product_id,
  user_id,
  amount,
  currency,
  status,
  payment_method,
  provider_session_id,
  provider_payment_id,
  checkout_url,
  created_at,
  paid_at
)
SELECT
  id,
  tenant_id,
  product_id,
  user_id,
  amount,
  currency,
  status,
  payment_method,
  provider_session_id,
  provider_payment_id,
  checkout_url,
  created_at,
  paid_at
FROM ec_orders_legacy_commercial_guard;

DROP TABLE ec_orders_legacy_commercial_guard;

CREATE INDEX IF NOT EXISTS idx_ec_orders_tenant_id ON ec_orders (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ec_orders_status_created_at ON ec_orders (status, created_at);
CREATE INDEX IF NOT EXISTS idx_ec_orders_user_id ON ec_orders (user_id);

CREATE TABLE IF NOT EXISTS tenant_storage_assets (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL CHECK (file_size >= 0),
  file_type TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'asset' CHECK (purpose IN ('asset', 'temp', 'attachment')),
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tenant_storage_assets_tenant_id ON tenant_storage_assets (tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_storage_assets_expires_at ON tenant_storage_assets (expires_at);

PRAGMA foreign_keys = on;
