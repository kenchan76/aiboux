ALTER TABLE shop_settings ADD COLUMN google_shopping_auto_sync_enabled INTEGER NOT NULL DEFAULT 1;
ALTER TABLE shop_settings ADD COLUMN bing_shopping_auto_sync_enabled INTEGER NOT NULL DEFAULT 1;
ALTER TABLE shop_settings ADD COLUMN ai_image_optimization_enabled INTEGER NOT NULL DEFAULT 1;
ALTER TABLE shop_settings ADD COLUMN omnichannel_updated_at INTEGER;

ALTER TABLE shop_feed_sync_jobs ADD COLUMN final_synced_at TEXT;
ALTER TABLE shop_feed_sync_jobs ADD COLUMN provider_results_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE shop_feed_sync_jobs ADD COLUMN availability TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE shop_feed_sync_jobs ADD COLUMN last_attempt_at TEXT;

CREATE INDEX IF NOT EXISTS idx_shop_feed_sync_jobs_product_latest
  ON shop_feed_sync_jobs(tenant_id, product_id, queued_at DESC);
