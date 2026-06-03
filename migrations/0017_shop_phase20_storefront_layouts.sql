PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS shop_storefront_layouts (
  tenant_id TEXT PRIMARY KEY,
  layout_json TEXT NOT NULL CHECK (json_valid(layout_json)),
  version INTEGER NOT NULL DEFAULT 1 CHECK (version = 1),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_shop_storefront_layouts_status_updated
  ON shop_storefront_layouts(status, updated_at DESC);

INSERT OR IGNORE INTO shop_storefront_layouts (
  tenant_id,
  layout_json,
  version,
  status,
  updated_by,
  created_at,
  updated_at
)
VALUES (
  'tenant_001',
  '{"version":1,"blocks":[{"id":"hero-main","type":"hero","title":"雪花セレクトを、わかりやすく。","subtitle":"ギフトと日用品を中心に、毎日にちょうどいい商品をお届けします。","ctaLabel":"商品を見る","ctaHref":"#products"},{"id":"trust-default","type":"trustBar","title":"安心して選べるストア","items":["税込価格表示","在庫状況を表示","出店者情報を明記"]},{"id":"featured-products","type":"featuredProducts","title":"おすすめ商品","subtitle":"いま購入できる公開商品を表示します。","productLimit":6}]}',
  1,
  'published',
  'phase20_seed',
  unixepoch() * 1000,
  unixepoch() * 1000
);
