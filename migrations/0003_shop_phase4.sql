PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS shop_social_post_drafts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('x', 'instagram', 'line', 'other')),
  post_content TEXT,
  image_keys TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'published', 'failed')),
  scheduled_for DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES shop_settings(tenant_id),
  FOREIGN KEY (product_id) REFERENCES shop_products(id)
);

CREATE INDEX IF NOT EXISTS idx_shop_social_post_drafts_tenant_status
  ON shop_social_post_drafts(tenant_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_shop_social_post_drafts_product_platform
  ON shop_social_post_drafts(product_id, platform, status);
