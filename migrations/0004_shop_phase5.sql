PRAGMA foreign_keys = ON;

ALTER TABLE shop_categories ADD COLUMN google_category_id TEXT NOT NULL DEFAULT '';
ALTER TABLE shop_categories ADD COLUMN google_category_name TEXT NOT NULL DEFAULT '';
ALTER TABLE shop_categories ADD COLUMN feed_enabled INTEGER NOT NULL DEFAULT 1 CHECK (feed_enabled IN (0, 1));

CREATE INDEX IF NOT EXISTS idx_shop_categories_tenant_google
  ON shop_categories(tenant_id, google_category_id, status);
