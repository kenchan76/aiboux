PRAGMA foreign_keys = ON;

ALTER TABLE b2b_orders ADD COLUMN payment_provider TEXT;
ALTER TABLE b2b_orders ADD COLUMN provider_payment_id TEXT;
ALTER TABLE b2b_orders ADD COLUMN stripe_payment_intent_id TEXT;
ALTER TABLE b2b_orders ADD COLUMN stripe_charge_id TEXT;
ALTER TABLE b2b_orders ADD COLUMN refund_status TEXT;
ALTER TABLE b2b_orders ADD COLUMN refunded_at INTEGER;

CREATE INDEX IF NOT EXISTS idx_b2b_orders_tenant_provider_payment
  ON b2b_orders(tenant_id, payment_provider, provider_payment_id);

CREATE INDEX IF NOT EXISTS idx_shop_products_mall_published
  ON shop_products(publish_state, mall_enabled, updated_at DESC)
  WHERE deleted_at IS NULL;
