PRAGMA foreign_keys = ON;

ALTER TABLE shop_social_post_drafts ADD COLUMN approved_by TEXT;
ALTER TABLE shop_social_post_drafts ADD COLUMN approved_at DATETIME;

CREATE INDEX IF NOT EXISTS idx_shop_social_post_drafts_approval
  ON shop_social_post_drafts (tenant_id, status, approved_at);
