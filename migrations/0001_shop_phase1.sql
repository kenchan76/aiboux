PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS shop_settings (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  store_name TEXT NOT NULL DEFAULT '',
  store_slug TEXT NOT NULL DEFAULT '',
  mall_subdomain TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  invoice_registered INTEGER NOT NULL DEFAULT 0 CHECK (invoice_registered IN (0, 1)),
  corporate_number TEXT NOT NULL DEFAULT '',
  corporate_name TEXT NOT NULL DEFAULT '',
  postal_code TEXT NOT NULL DEFAULT '',
  address_line1 TEXT NOT NULL DEFAULT '',
  address_line2 TEXT NOT NULL DEFAULT '',
  tokushoho_text TEXT NOT NULL DEFAULT '',
  privacy_policy_text TEXT NOT NULL DEFAULT '',
  stripe_connect_status TEXT NOT NULL DEFAULT 'not_connected' CHECK (stripe_connect_status IN ('not_connected', 'pending', 'connected')),
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id)
);

CREATE TABLE IF NOT EXISTS shop_categories (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  parent_id TEXT,
  category_code TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'archived')),
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES shop_categories(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, category_code),
  UNIQUE (tenant_id, slug)
);

CREATE TABLE IF NOT EXISTS shop_products (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  core_product_id TEXT NOT NULL,
  category_id TEXT,
  shop_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  hero_image_asset_id TEXT,
  publish_state TEXT NOT NULL DEFAULT 'draft' CHECK (publish_state IN ('draft', 'pending_approval', 'published', 'paused', 'archived')),
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  sale_price INTEGER NOT NULL DEFAULT 0 CHECK (sale_price >= 0),
  tax_rate REAL NOT NULL DEFAULT 0.1 CHECK (tax_rate >= 0),
  stock_policy TEXT NOT NULL DEFAULT 'core_linked' CHECK (stock_policy IN ('core_linked', 'manual', 'untracked')),
  mall_enabled INTEGER NOT NULL DEFAULT 0 CHECK (mall_enabled IN (0, 1)),
  line_notify_enabled INTEGER NOT NULL DEFAULT 0 CHECK (line_notify_enabled IN (0, 1)),
  approval_required INTEGER NOT NULL DEFAULT 1 CHECK (approval_required IN (0, 1)),
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (core_product_id) REFERENCES core_products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES shop_categories(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, core_product_id, shop_name)
);

CREATE TABLE IF NOT EXISTS line_notification_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  shop_product_id TEXT,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('order_created', 'payment_received', 'shipment_ready', 'stock_alert', 'mall_sync', 'manual')),
  recipient_line_user_id TEXT NOT NULL DEFAULT '',
  message_summary TEXT NOT NULL DEFAULT '',
  payload_json TEXT NOT NULL DEFAULT '{}',
  delivery_status TEXT NOT NULL DEFAULT 'queued' CHECK (delivery_status IN ('queued', 'sent', 'failed', 'skipped')),
  error_message TEXT NOT NULL DEFAULT '',
  sent_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (shop_product_id) REFERENCES shop_products(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_shop_settings_tenant ON shop_settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shop_categories_tenant_parent ON shop_categories(tenant_id, parent_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_shop_products_tenant_category ON shop_products(tenant_id, category_id, publish_state);
CREATE INDEX IF NOT EXISTS idx_shop_products_tenant_core_phase1 ON shop_products(tenant_id, core_product_id, publish_state);
CREATE INDEX IF NOT EXISTS idx_line_notification_logs_tenant_time ON line_notification_logs(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_line_notification_logs_tenant_status ON line_notification_logs(tenant_id, delivery_status, created_at DESC);
