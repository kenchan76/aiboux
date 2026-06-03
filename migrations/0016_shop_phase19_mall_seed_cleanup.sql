PRAGMA foreign_keys = ON;

UPDATE core_products
SET stock_quantity = CASE
      WHEN id = 'coreprod_tenant_001_4901234567895' THEN 24
      WHEN id = 'coreprod_tenant_001_4901234567818' THEN 18
      ELSE stock_quantity
    END,
    status = 'active',
    mall_publish_enabled = 1,
    shop_sync_enabled = 1,
    updated_at = unixepoch() * 1000
WHERE tenant_id = 'tenant_001'
  AND id IN ('coreprod_tenant_001_4901234567895', 'coreprod_tenant_001_4901234567818');

UPDATE shop_products
SET display_name = CASE
      WHEN id = 'shopprod_tenant_001_4901234567895' THEN '軽量ステンレスボトル'
      WHEN id = 'shopprod_tenant_001_4901234567818' THEN '雪花セレクト ギフトタオル'
      ELSE display_name
    END,
    description = CASE
      WHEN id = 'shopprod_tenant_001_4901234567895'
        THEN '毎日の通勤や外出に使いやすい、軽量で扱いやすいステンレスボトルです。保温保冷に対応し、バッグに入れても持ち運びやすいサイズ感です。'
      WHEN id = 'shopprod_tenant_001_4901234567818'
        THEN '贈り物にも日常使いにも向く、やわらかな肌触りのタオルセットです。清潔感のある色味で、引っ越し祝いや季節の贈答にも使いやすい商品です。'
      ELSE description
    END,
    seo_title = CASE
      WHEN id = 'shopprod_tenant_001_4901234567895' THEN '軽量ステンレスボトル 500ml'
      WHEN id = 'shopprod_tenant_001_4901234567818' THEN '雪花セレクト ギフトタオル 2枚セット'
      ELSE seo_title
    END,
    seo_description = CASE
      WHEN id = 'shopprod_tenant_001_4901234567895' THEN '保温保冷対応の軽量ステンレスボトル。AIBOUX Mallで購入できます。'
      WHEN id = 'shopprod_tenant_001_4901234567818' THEN 'ギフトにも日常使いにも適したフェイスタオル2枚セット。AIBOUX Mallで購入できます。'
      ELSE seo_description
    END,
    image_r2_keys = '[]',
    ai_alt_texts_json = '[]',
    publish_state = 'published',
    mall_enabled = 1,
    approval_required = 0,
    updated_by = 'phase19_seed_cleanup',
    updated_at = unixepoch() * 1000,
    deleted_at = NULL
WHERE tenant_id = 'tenant_001'
  AND id IN ('shopprod_tenant_001_4901234567895', 'shopprod_tenant_001_4901234567818');
