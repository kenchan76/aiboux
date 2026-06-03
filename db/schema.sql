PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  host_name TEXT UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'standard', 'premium', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'canceled')),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE TABLE IF NOT EXISTS b2b_products (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  jan_code TEXT,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  location_code TEXT,
  unit_cost INTEGER NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
  selling_price INTEGER NOT NULL DEFAULT 0 CHECK (selling_price >= 0),
  markup_rate REAL NOT NULL DEFAULT 1.3 CHECK (markup_rate > 0),
  rounding_mode TEXT NOT NULL DEFAULT 'ceil_10' CHECK (rounding_mode IN ('floor', 'ceil', 'round', 'floor_10', 'ceil_10', 'round_10')),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, sku)
);

CREATE TABLE IF NOT EXISTS b2b_orders (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  order_source TEXT NOT NULL CHECK (order_source IN ('b2b', 'line', 'shop', 'regi', 'manual')),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'paid', 'fulfilled', 'canceled')),
  total_amount INTEGER NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS b2b_customers (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  bank_account_kana TEXT,
  line_user_id TEXT,
  postal_code TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  phone_number TEXT,
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

CREATE TABLE IF NOT EXISTS b2b_order_items (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  line_total INTEGER NOT NULL CHECK (line_total >= 0),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES b2b_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES b2b_products(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS b2b_invoices (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  order_id TEXT,
  customer_id TEXT,
  invoice_number TEXT NOT NULL,
  invoice_type TEXT NOT NULL DEFAULT 'standard' CHECK (invoice_type IN ('provisional', 'delivery', 'standard')),
  billing_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (billing_status IN ('unpaid', 'paid', 'void')),
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

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('b2b', 'line', 'shop', 'regi', 'manual', 'migration')),
  delta INTEGER NOT NULL,
  before_stock INTEGER NOT NULL CHECK (before_stock >= 0),
  after_stock INTEGER NOT NULL CHECK (after_stock >= 0),
  reason TEXT NOT NULL DEFAULT '',
  reference_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES b2b_products(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS b2b_sales_receipts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  transaction_date TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  tax_amount INTEGER NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  debit_account TEXT NOT NULL DEFAULT '売掛金',
  credit_account TEXT NOT NULL DEFAULT '売上高',
  memo TEXT NOT NULL DEFAULT '',
  source_file_key TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS b2b_historical_sales (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  source_file_name TEXT NOT NULL,
  transaction_date TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  confidence REAL NOT NULL DEFAULT 1.0 CHECK (confidence >= 0 AND confidence <= 1),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS b2b_ai_command_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  command_text TEXT NOT NULL,
  function_name TEXT NOT NULL,
  arguments_json TEXT NOT NULL DEFAULT '{}',
  result_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tenants_host_active ON tenants(host_name, is_active, status);
CREATE INDEX IF NOT EXISTS idx_b2b_products_tenant_sku ON b2b_products(tenant_id, sku);
CREATE INDEX IF NOT EXISTS idx_b2b_products_tenant_jan ON b2b_products(tenant_id, jan_code);
CREATE INDEX IF NOT EXISTS idx_b2b_products_tenant_active ON b2b_products(tenant_id, is_active);
CREATE INDEX IF NOT EXISTS idx_b2b_customers_tenant_name ON b2b_customers(tenant_id, customer_name);
CREATE INDEX IF NOT EXISTS idx_b2b_customers_tenant_line ON b2b_customers(tenant_id, line_user_id);
CREATE INDEX IF NOT EXISTS idx_b2b_customers_tenant_delivery ON b2b_customers(tenant_id, postal_code, phone_number);
CREATE INDEX IF NOT EXISTS idx_tenant_pricing_rules_tenant_supplier ON tenant_pricing_rules(tenant_id, supplier_name);
CREATE INDEX IF NOT EXISTS idx_b2b_orders_tenant_status_time ON b2b_orders(tenant_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_b2b_order_items_tenant_order ON b2b_order_items(tenant_id, order_id);
CREATE INDEX IF NOT EXISTS idx_b2b_invoices_tenant_status ON b2b_invoices(tenant_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_b2b_invoices_tenant_customer ON b2b_invoices(tenant_id, customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_b2b_invoices_tenant_billing ON b2b_invoices(tenant_id, invoice_type, billing_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_b2b_invoice_items_tenant_invoice ON b2b_invoice_items(tenant_id, invoice_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_tenant_product_time ON inventory_transactions(tenant_id, product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_b2b_sales_receipts_tenant_date ON b2b_sales_receipts(tenant_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_b2b_historical_sales_tenant_date ON b2b_historical_sales(tenant_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_b2b_ai_command_logs_tenant_time ON b2b_ai_command_logs(tenant_id, created_at DESC);
