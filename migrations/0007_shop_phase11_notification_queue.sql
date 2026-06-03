CREATE TABLE IF NOT EXISTS shop_email_notification_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL DEFAULT '',
  provider_message_id TEXT,
  delivery_status TEXT NOT NULL DEFAULT 'queued' CHECK (delivery_status IN ('queued', 'sent', 'failed')),
  error_message TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  sent_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_shop_email_notification_logs_tenant_status
  ON shop_email_notification_logs(tenant_id, delivery_status, created_at DESC);
