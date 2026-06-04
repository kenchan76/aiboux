# AIBOUX Shop SEO/UI Checklist WIP Status

## Status
DEPLOYED_NOT_FINAL

## Summary
- 全公開ストアページへ共通SEO/UIチェックリスト部品を追加し、TOP、商品詳細、商品一覧、カテゴリ、カート、チェックアウト、問い合わせ、法務、配送返品、FAQ、マイページ系へ展開しました。
- 商品詳細の重複タイトルは禁止のまま維持し、商品名H1は1つ、Product/Offer確認、青色で視認できるcrawlable link、ItemList/ListItem microdataをPlaywrightで検証しました。
- WIP deploy済みです。FINAL_ACCEPTEDではありません。定期購入gateはD1/永続化レーンでBLOCKED_NOT_FINALです。

## Verification
- npm run check:control-chars: PASS
- npm run check:mojibake: PASS
- ESBUILD_WORKER_THREADS=0 npm run build: PASS
- PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/shop-public-crawl.spec.ts tests/shop-product-detail-public.spec.ts: PASS, 12 tests
- PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-sales-quality: PASS
- PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npm run gate:shop-subscriptions: BLOCKED_NOT_FINAL
- https://mail.aiboux.com/g/m68: HTTP 200 / text/markdown
- https://mail.aiboux.com/g/l68: HTTP 200 / text/markdown
- https://mail.aiboux.com/g/d68: HTTP 200 / text/markdown
- https://shop.aiboux.com/s/aiboux/: HTTP 200 / x-aiboux-worker-version 341958fe-ee6d-4020-9379-c33b626a20cd / storefront-seo-checklist present
- https://shop.aiboux.com/s/aiboux/product/shopprod_tenant_001_4580000232621: HTTP 200 / x-aiboux-worker-version 341958fe-ee6d-4020-9379-c33b626a20cd / storefront-seo-checklist present

## Bark
- notification: progress delivered
- reason: Progress Bark sent for DEPLOYED_NOT_FINAL WIP evidence publication. FINAL_ACCEPTED is still prohibited.

## Notes
- Worker Version ID: 341958fe-ee6d-4020-9379-c33b626a20cd
- WIP commits: ef20149, f4f1dd8, 874175b
- Progress Bark: delivered=true, skipped=false, secretLogged=false, finalGate=false
- Unresolved: gate:shop-subscriptions did not observe the active test plan persisted in the public response; remote D1 subscription migration and provider-backed recurring billing remain not accepted.

## URLs
- マスター: https://mail.aiboux.com/g/m68
- ログ: https://mail.aiboux.com/g/l68
- 画面: https://mail.aiboux.com/g/d68
