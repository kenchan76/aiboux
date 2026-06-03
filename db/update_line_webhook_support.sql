PRAGMA foreign_keys = ON;

ALTER TABLE b2b_invoices ADD COLUMN customer_id TEXT;
ALTER TABLE b2b_invoices ADD COLUMN invoice_type TEXT NOT NULL DEFAULT 'standard' CHECK (invoice_type IN ('provisional', 'delivery', 'standard'));
ALTER TABLE b2b_invoices ADD COLUMN billing_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (billing_status IN ('unpaid', 'paid', 'void'));

CREATE TABLE IF NOT EXISTS b2b_invoice_items (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  invoice_id TEXT NOT NULL,
  product_id TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  line_total INTEGER NOT NULL CHECK (line_total >= 0),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_id) REFERENCES b2b_invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES b2b_products(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_b2b_customers_line_user ON b2b_customers(line_user_id);
CREATE INDEX IF NOT EXISTS idx_b2b_invoices_tenant_customer ON b2b_invoices(tenant_id, customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_b2b_invoices_tenant_billing ON b2b_invoices(tenant_id, invoice_type, billing_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_b2b_invoice_items_tenant_invoice ON b2b_invoice_items(tenant_id, invoice_id);
