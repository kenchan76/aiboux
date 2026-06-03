PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS product_divisions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  color_token TEXT NOT NULL DEFAULT 'neutral',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_default INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, name)
);

CREATE TABLE IF NOT EXISTS core_products (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  division_id TEXT,
  jan_code TEXT,
  itf_code TEXT,
  product_name TEXT NOT NULL,
  case_quantity INTEGER NOT NULL DEFAULT 1 CHECK (case_quantity > 0),
  specification TEXT NOT NULL DEFAULT '',
  unit TEXT NOT NULL DEFAULT '個',
  standard_price INTEGER NOT NULL DEFAULT 0 CHECK (standard_price >= 0),
  tax_type TEXT NOT NULL DEFAULT 'taxable_10' CHECK (tax_type IN ('taxable_10', 'taxable_8', 'tax_exempt', 'non_taxable')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'discontinued', 'archived')),
  inventory_managed INTEGER NOT NULL DEFAULT 1 CHECK (inventory_managed IN (0, 1)),
  shop_sync_enabled INTEGER NOT NULL DEFAULT 0 CHECK (shop_sync_enabled IN (0, 1)),
  mall_publish_enabled INTEGER NOT NULL DEFAULT 0 CHECK (mall_publish_enabled IN (0, 1)),
  description TEXT NOT NULL DEFAULT '',
  product_width_mm REAL,
  product_height_mm REAL,
  product_depth_mm REAL,
  product_weight_g REAL,
  case_width_mm REAL,
  case_height_mm REAL,
  case_depth_mm REAL,
  case_weight_g REAL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  sales_amount INTEGER NOT NULL DEFAULT 0 CHECK (sales_amount >= 0),
  gross_margin_rate REAL NOT NULL DEFAULT 0 CHECK (gross_margin_rate >= 0),
  tags_json TEXT NOT NULL DEFAULT '[]',
  memo TEXT NOT NULL DEFAULT '',
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (division_id) REFERENCES product_divisions(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, jan_code)
);

CREATE TABLE IF NOT EXISTS favorite_product_lists (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  owner_user_id TEXT,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, owner_user_id, name)
);

CREATE TABLE IF NOT EXISTS product_favorites (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  favorite_list_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  created_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (favorite_list_id) REFERENCES favorite_product_lists(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES core_products(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, favorite_list_id, product_id)
);

CREATE TABLE IF NOT EXISTS saved_product_views (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  owner_user_id TEXT,
  name TEXT NOT NULL,
  view_type TEXT NOT NULL DEFAULT 'division' CHECK (view_type IN ('division', 'favorite', 'system', 'custom')),
  target_id TEXT,
  filters_json TEXT NOT NULL DEFAULT '{}',
  sort_key TEXT NOT NULL DEFAULT 'updated_at',
  sort_direction TEXT NOT NULL DEFAULT 'desc' CHECK (sort_direction IN ('asc', 'desc')),
  is_user_default INTEGER NOT NULL DEFAULT 0 CHECK (is_user_default IN (0, 1)),
  is_tenant_default INTEGER NOT NULL DEFAULT 0 CHECK (is_tenant_default IN (0, 1)),
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, owner_user_id, name)
);

CREATE TABLE IF NOT EXISTS product_price_schedules (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  standard_price INTEGER NOT NULL CHECK (standard_price >= 0),
  tax_type TEXT NOT NULL DEFAULT 'taxable_10' CHECK (tax_type IN ('taxable_10', 'taxable_8', 'tax_exempt', 'non_taxable')),
  effective_from TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  approval_status TEXT NOT NULL DEFAULT 'draft' CHECK (approval_status IN ('draft', 'pending', 'approved', 'rejected')),
  approved_by TEXT,
  approved_at INTEGER,
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES core_products(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, product_id, effective_from)
);

CREATE TABLE IF NOT EXISTS core_customers (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  customer_code TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  billing_name TEXT NOT NULL DEFAULT '',
  bank_account_kana TEXT NOT NULL DEFAULT '',
  base_discount_rate REAL NOT NULL DEFAULT 1.0 CHECK (base_discount_rate > 0),
  closing_day TEXT NOT NULL DEFAULT '末日',
  payment_terms TEXT NOT NULL DEFAULT '翌月末払い',
  contact_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone_number TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, customer_code),
  UNIQUE (tenant_id, customer_name)
);

CREATE TABLE IF NOT EXISTS customer_discount_rates (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  product_id TEXT,
  rate REAL NOT NULL CHECK (rate > 0),
  exception_price INTEGER CHECK (exception_price IS NULL OR exception_price >= 0),
  tax_mode TEXT NOT NULL DEFAULT 'tax_excluded' CHECK (tax_mode IN ('tax_excluded', 'tax_included')),
  rounding_mode TEXT NOT NULL DEFAULT 'round' CHECK (rounding_mode IN ('floor', 'ceil', 'round', 'floor_10', 'ceil_10', 'round_10')),
  effective_from TEXT NOT NULL DEFAULT '1900-01-01',
  effective_to TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES core_customers(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES core_products(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, customer_id, product_id, effective_from)
);

CREATE TABLE IF NOT EXISTS delivery_destinations (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  destination_code TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  postal_code TEXT NOT NULL DEFAULT '',
  address_line1 TEXT NOT NULL DEFAULT '',
  address_line2 TEXT NOT NULL DEFAULT '',
  phone_number TEXT NOT NULL DEFAULT '',
  contact_name TEXT NOT NULL DEFAULT '',
  delivery_conditions TEXT NOT NULL DEFAULT '',
  is_default INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),
  memo TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES core_customers(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, customer_id, destination_code)
);

CREATE TABLE IF NOT EXISTS shop_products (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  core_product_id TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  hero_image_asset_id TEXT,
  publish_state TEXT NOT NULL DEFAULT 'draft' CHECK (publish_state IN ('draft', 'pending_approval', 'published', 'paused', 'archived')),
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  approval_required INTEGER NOT NULL DEFAULT 1 CHECK (approval_required IN (0, 1)),
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (core_product_id) REFERENCES core_products(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, core_product_id, shop_name)
);

CREATE TABLE IF NOT EXISTS shop_sku_variants (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  shop_product_id TEXT NOT NULL,
  core_product_id TEXT NOT NULL,
  sku_code TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  set_quantity INTEGER NOT NULL DEFAULT 1 CHECK (set_quantity > 0),
  sale_price INTEGER NOT NULL CHECK (sale_price >= 0),
  jan_code TEXT,
  description TEXT NOT NULL DEFAULT '',
  image_asset_id TEXT,
  inventory_linked INTEGER NOT NULL DEFAULT 1 CHECK (inventory_linked IN (0, 1)),
  publish_state TEXT NOT NULL DEFAULT 'draft' CHECK (publish_state IN ('draft', 'pending_approval', 'published', 'paused', 'archived')),
  shipping_size TEXT NOT NULL DEFAULT '',
  marketplace_enabled INTEGER NOT NULL DEFAULT 0 CHECK (marketplace_enabled IN (0, 1)),
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (shop_product_id) REFERENCES shop_products(id) ON DELETE CASCADE,
  FOREIGN KEY (core_product_id) REFERENCES core_products(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, sku_code)
);

CREATE TABLE IF NOT EXISTS marketplace_listings (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  sku_variant_id TEXT NOT NULL,
  marketplace TEXT NOT NULL CHECK (marketplace IN ('yahoo', 'rakuten', 'amazon')),
  marketplace_product_name TEXT NOT NULL,
  marketplace_description TEXT NOT NULL DEFAULT '',
  catch_copy TEXT NOT NULL DEFAULT '',
  search_keywords TEXT NOT NULL DEFAULT '',
  category_code TEXT NOT NULL DEFAULT '',
  shipping_setting TEXT NOT NULL DEFAULT '',
  sale_price INTEGER NOT NULL CHECK (sale_price >= 0),
  sale_price_override INTEGER CHECK (sale_price_override IS NULL OR sale_price_override >= 0),
  point_rate REAL NOT NULL DEFAULT 0 CHECK (point_rate >= 0),
  image_assets_json TEXT NOT NULL DEFAULT '[]',
  publish_state TEXT NOT NULL DEFAULT 'draft' CHECK (publish_state IN ('draft', 'pending_approval', 'listed', 'paused', 'error')),
  listing_status TEXT NOT NULL DEFAULT 'draft' CHECK (listing_status IN ('draft', 'ready', 'synced', 'error', 'stopped')),
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  last_synced_at INTEGER,
  error_message TEXT NOT NULL DEFAULT '',
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (sku_variant_id) REFERENCES shop_sku_variants(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, sku_variant_id, marketplace)
);

CREATE TABLE IF NOT EXISTS product_assets (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'spec_pdf', 'catalog_pdf', 'csv', 'excel', 'manual', 'other')),
  file_name TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  public_url TEXT,
  mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  file_size INTEGER NOT NULL DEFAULT 0 CHECK (file_size >= 0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES core_products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_enrichment_jobs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  product_id TEXT,
  input_type TEXT NOT NULL CHECK (input_type IN ('image', 'pdf', 'csv', 'excel', 'jan', 'text')),
  input_summary TEXT NOT NULL DEFAULT '',
  engine TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('queued', 'running', 'pending_review', 'applied', 'discarded', 'failed')),
  confidence REAL NOT NULL DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 1),
  sources_json TEXT NOT NULL DEFAULT '[]',
  needs_review_json TEXT NOT NULL DEFAULT '[]',
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  deleted_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES core_products(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ai_suggestions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  job_id TEXT NOT NULL,
  product_id TEXT,
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('product_field', 'sku_variant', 'marketplace_listing', 'price', 'category', 'bundle')),
  field_key TEXT NOT NULL DEFAULT '',
  suggested_value_json TEXT NOT NULL,
  confidence REAL NOT NULL DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 1),
  source_urls_json TEXT NOT NULL DEFAULT '[]',
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'applied', 'edited', 'discarded')),
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES ai_enrichment_jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES core_products(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  actor_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  before_json TEXT NOT NULL DEFAULT '{}',
  after_json TEXT NOT NULL DEFAULT '{}',
  request_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS integration_events (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'succeeded', 'failed', 'skipped')),
  payload_json TEXT NOT NULL DEFAULT '{}',
  result_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  processed_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_product_divisions_tenant_status ON product_divisions(tenant_id, status, sort_order);
CREATE INDEX IF NOT EXISTS idx_core_products_tenant_division ON core_products(tenant_id, division_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_core_products_tenant_jan ON core_products(tenant_id, jan_code);
CREATE INDEX IF NOT EXISTS idx_core_products_tenant_itf ON core_products(tenant_id, itf_code);
CREATE INDEX IF NOT EXISTS idx_core_products_tenant_shop ON core_products(tenant_id, shop_sync_enabled, mall_publish_enabled);
CREATE INDEX IF NOT EXISTS idx_favorite_lists_tenant_owner ON favorite_product_lists(tenant_id, owner_user_id);
CREATE INDEX IF NOT EXISTS idx_product_favorites_tenant_product ON product_favorites(tenant_id, product_id);
CREATE INDEX IF NOT EXISTS idx_saved_product_views_tenant_default ON saved_product_views(tenant_id, owner_user_id, is_user_default, is_tenant_default);
CREATE INDEX IF NOT EXISTS idx_product_price_schedules_tenant_product_date ON product_price_schedules(tenant_id, product_id, effective_from DESC);
CREATE INDEX IF NOT EXISTS idx_core_customers_tenant_status ON core_customers(tenant_id, status, customer_name);
CREATE INDEX IF NOT EXISTS idx_customer_discount_rates_tenant_customer ON customer_discount_rates(tenant_id, customer_id, product_id, status);
CREATE INDEX IF NOT EXISTS idx_delivery_destinations_tenant_customer ON delivery_destinations(tenant_id, customer_id, is_default DESC);
CREATE INDEX IF NOT EXISTS idx_shop_products_tenant_core ON shop_products(tenant_id, core_product_id, publish_state);
CREATE INDEX IF NOT EXISTS idx_shop_sku_variants_tenant_shop ON shop_sku_variants(tenant_id, shop_product_id, publish_state);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_tenant_marketplace ON marketplace_listings(tenant_id, marketplace, listing_status, approval_status);
CREATE INDEX IF NOT EXISTS idx_product_assets_tenant_product ON product_assets(tenant_id, product_id, asset_type, sort_order);
CREATE INDEX IF NOT EXISTS idx_ai_enrichment_jobs_tenant_status ON ai_enrichment_jobs(tenant_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_tenant_job ON ai_suggestions(tenant_id, job_id, review_status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_entity ON audit_logs(tenant_id, entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_integration_events_tenant_status ON integration_events(tenant_id, status, created_at DESC);
