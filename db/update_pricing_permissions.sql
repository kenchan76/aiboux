CREATE TABLE IF NOT EXISTS b2b_tenant_subscriptions (
  tenant_id TEXT PRIMARY KEY,
  is_aiboux_active INTEGER NOT NULL DEFAULT 1 CHECK (is_aiboux_active IN (0, 1)),
  active_shop_count INTEGER NOT NULL DEFAULT 0 CHECK (active_shop_count >= 0),
  mail_plan_type TEXT NOT NULL DEFAULT 'free_ad' CHECK (mail_plan_type IN ('free_ad', 'light_500', 'premium_980')),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_b2b_tenant_subscriptions_mail_plan
ON b2b_tenant_subscriptions(mail_plan_type);

CREATE TABLE IF NOT EXISTS b2b_staff_accounts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  staff_plan_type TEXT NOT NULL DEFAULT 'free' CHECK (staff_plan_type IN ('free', 'premium_980')),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_b2b_staff_accounts_tenant_active
ON b2b_staff_accounts(tenant_id, is_active);

CREATE INDEX IF NOT EXISTS idx_b2b_staff_accounts_plan_active
ON b2b_staff_accounts(staff_plan_type, is_active);

INSERT OR IGNORE INTO b2b_tenant_subscriptions (
  tenant_id,
  is_aiboux_active,
  active_shop_count,
  mail_plan_type
)
VALUES (
  'tenant_001',
  1,
  0,
  'free_ad'
);
