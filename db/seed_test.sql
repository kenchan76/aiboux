PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO tenants (id, slug, name, host_name, plan, status, is_active)
VALUES ('tenant_001', 'yukihana-test', 'テスト運用店舗（雪花）', 'shop.aiboux.com', 'enterprise', 'active', 1);

INSERT OR IGNORE INTO b2b_customers (
  id, tenant_id, customer_name, bank_account_kana, line_user_id, postal_code, address_line1, address_line2, phone_number, ai_confidence_threshold
) VALUES
  ('cust_01', 'tenant_001', '山田商店', 'ヤマダシヨウテン', 'U1234567890abcdef', '060-0001', '北海道札幌市中央区北一条西1-1', '山田商店 受取口', '011-000-0001', 0.90),
  ('cust_02', 'tenant_001', '鈴木フーズ', 'スズキフーズ', 'U9999999999abcdef', '060-0002', '北海道札幌市中央区北二条西2-2', '鈴木フーズ 物流担当', '011-000-0002', 0.85);

UPDATE b2b_customers
SET postal_code = '060-0001', address_line1 = '北海道札幌市中央区北一条西1-1', address_line2 = '山田商店 受取口', phone_number = '011-000-0001'
WHERE id = 'cust_01';

UPDATE b2b_customers
SET postal_code = '060-0002', address_line1 = '北海道札幌市中央区北二条西2-2', address_line2 = '鈴木フーズ 物流担当', phone_number = '011-000-0002'
WHERE id = 'cust_02';

INSERT OR IGNORE INTO b2b_products (
  id, tenant_id, jan_code, sku, name, current_stock, location_code, unit_cost, selling_price, markup_rate, rounding_mode
) VALUES
  ('prod_01', 'tenant_001', '4901234567890', 'RAMEN-01', '特製塩ラーメン 5食パック', 150, 'A-1', 320, 450, 1.35, 'floor'),
  ('prod_02', 'tenant_001', '4901234567891', 'SOUP-02', '極み醤油スープ 業務箱', 40, 'B-3', 900, 1200, 1.35, 'floor'),
  ('prod_03', 'tenant_001', '4901234567892', 'CHASU-03', '自家製冷凍チャーシュー', 15, 'FREEZER-01', 1850, 2500, 1.35, 'floor');

INSERT OR IGNORE INTO tenant_pricing_rules (
  id, tenant_id, supplier_name, markup_rate, round_type
) VALUES
  ('rule_01', 'tenant_001', '北海原材料卸', 1.35, 'floor'),
  ('rule_02', 'tenant_001', '南国スパイス社', 1.12, 'ceil');

INSERT OR IGNORE INTO b2b_sales_receipts (
  id, tenant_id, transaction_date, partner_name, amount, tax_amount, debit_account, credit_account, memo
) VALUES
  ('sale_seed_01', 'tenant_001', date('now', 'start of month'), '山田商店', 4500, 409, '売掛金', '売上高', '特製塩ラーメン 10個'),
  ('sale_seed_02', 'tenant_001', date('now', 'start of month', '+2 days'), '鈴木フーズ', 12000, 1090, '売掛金', '売上高', '極み醤油スープ 10箱');
