CREATE TABLE IF NOT EXISTS shop_feed_sync_jobs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  core_product_id TEXT NOT NULL,
  channels_json TEXT NOT NULL DEFAULT '[]',
  publish_state TEXT NOT NULL DEFAULT 'draft',
  reason TEXT NOT NULL DEFAULT 'product_saved',
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'received', 'succeeded', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT NOT NULL DEFAULT '',
  queued_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  received_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (product_id) REFERENCES shop_products(id)
);

CREATE INDEX IF NOT EXISTS idx_shop_feed_sync_jobs_tenant_status
  ON shop_feed_sync_jobs(tenant_id, status, queued_at);

CREATE INDEX IF NOT EXISTS idx_shop_feed_sync_jobs_product
  ON shop_feed_sync_jobs(product_id, status);
