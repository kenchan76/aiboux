PRAGMA foreign_keys = ON;

ALTER TABLE b2b_customers ADD COLUMN postal_code TEXT;
ALTER TABLE b2b_customers ADD COLUMN address_line1 TEXT;
ALTER TABLE b2b_customers ADD COLUMN address_line2 TEXT;
ALTER TABLE b2b_customers ADD COLUMN phone_number TEXT;

UPDATE b2b_customers
SET
  postal_code = COALESCE(postal_code, '000-0000'),
  address_line1 = COALESCE(address_line1, 'お届け先住所サンプルフラット文字列'),
  address_line2 = COALESCE(address_line2, ''),
  phone_number = COALESCE(phone_number, '090-0000-0000')
WHERE tenant_id = 'tenant_001';

CREATE INDEX IF NOT EXISTS idx_b2b_customers_tenant_delivery
ON b2b_customers(tenant_id, postal_code, phone_number);
