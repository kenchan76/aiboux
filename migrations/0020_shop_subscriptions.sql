PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS shop_subscription_plans (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  interval_unit TEXT NOT NULL DEFAULT 'month' CHECK (interval_unit IN ('day', 'week', 'month')),
  interval_count INTEGER NOT NULL DEFAULT 1 CHECK (interval_count >= 1),
  price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
  discount_rate REAL NOT NULL DEFAULT 0 CHECK (discount_rate >= 0),
  first_order_price INTEGER CHECK (first_order_price IS NULL OR first_order_price >= 0),
  minimum_cycles INTEGER NOT NULL DEFAULT 0 CHECK (minimum_cycles >= 0),
  can_skip INTEGER NOT NULL DEFAULT 1 CHECK (can_skip IN (0, 1)),
  can_pause INTEGER NOT NULL DEFAULT 1 CHECK (can_pause IN (0, 1)),
  can_cancel INTEGER NOT NULL DEFAULT 1 CHECK (can_cancel IN (0, 1)),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'archived')),
  notice_text TEXT NOT NULL DEFAULT '',
  cancellation_policy TEXT NOT NULL DEFAULT '',
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES shop_products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_shop_subscription_plans_tenant_product
  ON shop_subscription_plans(tenant_id, product_id, status, updated_at DESC);

CREATE TABLE IF NOT EXISTS shop_subscriptions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  customer_id TEXT,
  customer_name TEXT NOT NULL DEFAULT '',
  customer_email TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending_payment_setup' CHECK (status IN ('active', 'pending_payment_setup', 'paused', 'canceled', 'payment_failed', 'completed')),
  plan_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  unit_price INTEGER NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  interval_unit TEXT NOT NULL DEFAULT 'month' CHECK (interval_unit IN ('day', 'week', 'month')),
  interval_count INTEGER NOT NULL DEFAULT 1 CHECK (interval_count >= 1),
  next_billing_at INTEGER,
  next_delivery_at INTEGER,
  payment_provider TEXT,
  payment_subscription_id TEXT,
  memo TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  canceled_at INTEGER,
  paused_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES shop_subscription_plans(id) ON DELETE RESTRICT,
  FOREIGN KEY (product_id) REFERENCES shop_products(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_shop_subscriptions_tenant_status_next
  ON shop_subscriptions(tenant_id, status, next_billing_at, next_delivery_at);

CREATE INDEX IF NOT EXISTS idx_shop_subscriptions_tenant_product
  ON shop_subscriptions(tenant_id, product_id, created_at DESC);

CREATE TABLE IF NOT EXISTS shop_subscription_events (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  subscription_id TEXT,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES shop_subscriptions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_shop_subscription_events_tenant_time
  ON shop_subscription_events(tenant_id, created_at DESC);

