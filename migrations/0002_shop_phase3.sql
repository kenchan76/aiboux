ALTER TABLE shop_products ADD COLUMN cost_price INTEGER DEFAULT 0;
ALTER TABLE shop_products ADD COLUMN shipping_cost INTEGER DEFAULT 0;
ALTER TABLE shop_products ADD COLUMN platform_fee_rate REAL DEFAULT 0;
ALTER TABLE shop_products ADD COLUMN stripe_fee_rate REAL DEFAULT 3.6;
ALTER TABLE shop_products ADD COLUMN ai_keywords_json TEXT;
ALTER TABLE shop_products ADD COLUMN google_category_id TEXT;
ALTER TABLE shop_products ADD COLUMN image_r2_keys TEXT;
ALTER TABLE shop_products ADD COLUMN ai_alt_texts_json TEXT;
