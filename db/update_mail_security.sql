ALTER TABLE mail_messages ADD COLUMN unsubscribe_url TEXT;

CREATE TABLE IF NOT EXISTS mail_blocked_senders (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  block_type TEXT NOT NULL CHECK (block_type IN ('email', 'domain')),
  block_pattern TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, block_type, block_pattern)
);

CREATE INDEX IF NOT EXISTS idx_mail_blocked_senders_lookup
ON mail_blocked_senders(tenant_id, block_type, block_pattern, is_active);
