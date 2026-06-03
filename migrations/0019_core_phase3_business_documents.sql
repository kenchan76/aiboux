PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS core_documents (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('quote', 'delivery', 'invoice')),
  document_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  subtotal_amount INTEGER NOT NULL DEFAULT 0 CHECK (subtotal_amount >= 0),
  tax_amount INTEGER NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount INTEGER NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'sent', 'accepted', 'delivered', 'void')),
  memo TEXT NOT NULL DEFAULT '',
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, type, document_number)
);

CREATE TABLE IF NOT EXISTS core_document_lines (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  document_id TEXT NOT NULL,
  line_no INTEGER NOT NULL CHECK (line_no > 0),
  product_name TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price INTEGER NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  line_total INTEGER NOT NULL DEFAULT 0 CHECK (line_total >= 0),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (document_id) REFERENCES core_documents(id) ON DELETE CASCADE,
  UNIQUE (document_id, line_no)
);

CREATE INDEX IF NOT EXISTS idx_core_documents_tenant_type_number
  ON core_documents(tenant_id, type, document_number, deleted_at);

CREATE INDEX IF NOT EXISTS idx_core_documents_tenant_status_issue
  ON core_documents(tenant_id, status, issue_date DESC, deleted_at);

CREATE INDEX IF NOT EXISTS idx_core_document_lines_document
  ON core_document_lines(tenant_id, document_id, line_no);
