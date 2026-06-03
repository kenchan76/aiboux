CREATE TABLE IF NOT EXISTS b2b_stripe_subscription_events (
  session_id TEXT PRIMARY KEY,
  stripe_event_id TEXT NOT NULL UNIQUE,
  tenant_id TEXT NOT NULL,
  staff_id TEXT,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('aiboux_core', 'shop_site', 'staff_premium')),
  amount_total INTEGER NOT NULL DEFAULT 0 CHECK (amount_total >= 0),
  currency TEXT NOT NULL DEFAULT 'jpy',
  payment_status TEXT NOT NULL DEFAULT 'unknown',
  processing_status TEXT NOT NULL DEFAULT 'processing' CHECK (processing_status IN ('processing', 'applied', 'skipped', 'failed')),
  error_message TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  applied_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES b2b_staff_accounts(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_b2b_stripe_subscription_events_tenant_created
ON b2b_stripe_subscription_events(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_b2b_stripe_subscription_events_purchase_type
ON b2b_stripe_subscription_events(purchase_type, processing_status);
