PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS shop_document_settings (
  tenant_id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL DEFAULT '',
  postal_code TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  invoice_registration_number TEXT NOT NULL DEFAULT '',
  logo_r2_key TEXT NOT NULL DEFAULT '',
  logo_url TEXT NOT NULL DEFAULT '',
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_shop_document_settings_email ON shop_document_settings(email);
