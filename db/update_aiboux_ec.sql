PRAGMA foreign_keys = ON;

ALTER TABLE tenants ADD COLUMN logo_url TEXT;
ALTER TABLE tenants ADD COLUMN point_rate REAL NOT NULL DEFAULT 0.03 CHECK (point_rate >= 0);
ALTER TABLE tenants ADD COLUMN storefront_status TEXT NOT NULL DEFAULT 'active' CHECK (storefront_status IN ('active', 'paused', 'closed'));
ALTER TABLE tenants ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1));

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  description TEXT,
  image_url TEXT,
  google_metadata TEXT NOT NULL DEFAULT '{}',
  is_mall_listed INTEGER NOT NULL DEFAULT 1 CHECK (is_mall_listed IN (0, 1)),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE (tenant_id, name)
);

CREATE TABLE IF NOT EXISTS product_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  rating REAL NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ec_orders (
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

CREATE TABLE IF NOT EXISTS point_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  order_id TEXT,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'use')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS email_campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent')),
  sent_at TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON UPDATE CASCADE ON DELETE SET NULL
);

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

CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products (tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at);
CREATE INDEX IF NOT EXISTS idx_products_google_category ON products (json_extract(google_metadata, '$.google_product_category'));
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews (rating);
CREATE INDEX IF NOT EXISTS idx_ec_orders_tenant_id ON ec_orders (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ec_orders_product_id ON ec_orders (product_id);
CREATE INDEX IF NOT EXISTS idx_ec_orders_user_id ON ec_orders (user_id);
CREATE INDEX IF NOT EXISTS idx_ec_orders_status ON ec_orders (status);
CREATE INDEX IF NOT EXISTS idx_point_logs_user_id ON point_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_point_logs_tenant_id_created_at ON point_logs (tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_point_logs_order_id ON point_logs (order_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_tenant_id ON subscribers (tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_tenant_id ON email_campaigns (tenant_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns (status);
CREATE INDEX IF NOT EXISTS idx_tenant_storage_assets_tenant_id ON tenant_storage_assets (tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_storage_assets_expires_at ON tenant_storage_assets (expires_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_unique_target_email
ON subscribers (COALESCE(tenant_id, ''), lower(email));

CREATE UNIQUE INDEX IF NOT EXISTS idx_point_logs_order_id_type
ON point_logs (order_id, type)
WHERE order_id IS NOT NULL;
