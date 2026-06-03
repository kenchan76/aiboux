PRAGMA foreign_keys = ON;

ALTER TABLE b2b_orders ADD COLUMN shipping_carrier TEXT;
ALTER TABLE b2b_orders ADD COLUMN tracking_number TEXT;
ALTER TABLE b2b_orders ADD COLUMN shipped_at INTEGER;
