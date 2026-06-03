CREATE TABLE IF NOT EXISTS b2b_line_tenant_mappings (
  line_user_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  is_admin INTEGER NOT NULL DEFAULT 1 CHECK (is_admin IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_b2b_line_tenant_mappings_tenant_admin
ON b2b_line_tenant_mappings(tenant_id, is_admin);

INSERT OR IGNORE INTO b2b_line_tenant_mappings (
  line_user_id,
  tenant_id,
  is_admin
)
VALUES (
  'U1234567890abcdef',
  'tenant_001',
  1
);
