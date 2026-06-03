CREATE TABLE IF NOT EXISTS b2b_staff_social_identities (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  staff_id TEXT NOT NULL,
  provider_name TEXT NOT NULL CHECK (provider_name IN ('rakuten', 'google', 'microsoft', 'apple', 'line', 'yahoo', 'x', 'instagram')),
  provider_user_id TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES b2b_staff_accounts(id) ON DELETE CASCADE,
  UNIQUE(provider_name, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_social_auth_lookup
ON b2b_staff_social_identities(provider_name, provider_user_id);

CREATE INDEX IF NOT EXISTS idx_social_auth_staff
ON b2b_staff_social_identities(tenant_id, staff_id);
