PRAGMA foreign_keys = OFF;

ALTER TABLE b2b_products ADD COLUMN jan_code TEXT;
ALTER TABLE b2b_products ADD COLUMN location_code TEXT;

CREATE TABLE IF NOT EXISTS b2b_customers (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  bank_account_kana TEXT,
  line_user_id TEXT,
  ai_confidence_threshold REAL NOT NULL DEFAULT 0.85 CHECK (ai_confidence_threshold >= 0 AND ai_confidence_threshold <= 1),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, customer_name)
);

CREATE TABLE IF NOT EXISTS tenant_pricing_rules (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  markup_rate REAL NOT NULL CHECK (markup_rate > 0),
  round_type TEXT NOT NULL DEFAULT 'ceil' CHECK (round_type IN ('floor', 'ceil', 'round', 'floor_10', 'ceil_10', 'round_10')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, supplier_name)
);

ALTER TABLE b2b_invoices RENAME TO b2b_invoices_legacy_seed_support;

CREATE TABLE b2b_invoices (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  order_id TEXT,
  invoice_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('provisional', 'draft', 'issued', 'void')),
  title TEXT NOT NULL DEFAULT '納品書',
  customer_name TEXT NOT NULL,
  total_amount INTEGER NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  invoice_json TEXT NOT NULL DEFAULT '{}',
  issued_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, invoice_number)
);

INSERT INTO b2b_invoices (
  id, tenant_id, order_id, invoice_number, status, title, customer_name,
  total_amount, invoice_json, issued_at, created_at, updated_at
)
SELECT
  id, tenant_id, order_id, invoice_number, status, title, customer_name,
  total_amount, invoice_json, issued_at, created_at, updated_at
FROM b2b_invoices_legacy_seed_support;

DROP TABLE b2b_invoices_legacy_seed_support;

CREATE INDEX IF NOT EXISTS idx_b2b_products_tenant_jan ON b2b_products(tenant_id, jan_code);
CREATE INDEX IF NOT EXISTS idx_b2b_customers_tenant_name ON b2b_customers(tenant_id, customer_name);
CREATE INDEX IF NOT EXISTS idx_b2b_customers_tenant_line ON b2b_customers(tenant_id, line_user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_pricing_rules_tenant_supplier ON tenant_pricing_rules(tenant_id, supplier_name);

PRAGMA foreign_keys = ON;
