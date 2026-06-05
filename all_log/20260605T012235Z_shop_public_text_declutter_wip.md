# 2026-06-05T01:22:35Z AIBOUX Shop Public Text Declutter WIP

Status: `SHOP_PUBLIC_TEXT_DECLUTTER_WIP_NOT_FINAL`

## Objective

AIBOUX Shop 5時間販売品質スプリントを継続し、公開ストア全体の購入者向け本文から、SEO内部語、migration、DB、schema、認証基盤、成功したふり、共通テンプレート、表示確認日などの実装説明を削除する。

## Scope

- `src/pages/shop/[tenant]/[...path].astro`
- `src/lib/shopStorefrontShared.ts`
- `src/components/shop/storefront/StorefrontFooter.tsx`
- `src/components/shop/storefront/ShopStorefrontHome.tsx`
- `tests/shop-public-crawl.spec.ts`
- `tests/shop-contact-legal-public.spec.ts`
- `ops/instructions/current.md`
- `ops/instructions/20260605_shop_5h_sales_quality_sprint_continue.md`
- `ops/improvements/20260605_daily_improvement.md`

## Current Changes

- legal/privacy/shipping/returns の見出しを `AIBOUX Shop 共通テンプレート` から購入者向けの `お買い物ガイド` に変更。
- `表示確認日` を削除し、購入者向けの `最終更新日` に変更。
- `D1 migration`, `DB migration`, `SUBSCRIPTION_SCHEMA_PENDING`, `ログイン基盤`, `本番認証`, `成功したふり`, `管理画面` が購入者向け本文に出ないよう文言を調整。
- FAQ、マイページ、定期購入、checkout、問い合わせ、フッターの内部状態説明を、購入者向けの自然な準備中/受付前表現へ変更。
- public crawl と contact/legal gate に、内部語が購入者本文へ戻らないための禁止チェックを追加。

## Reference Docs Checked

- Google Search Central SEO Starter Guide.
- Google Search Central breadcrumb structured data.
- Google Search Central ecommerce structured data.
- Google Search Central ecommerce URL structure guidance.

## Verification Before Deploy

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors and existing hints only.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.

## Not Final

- `FINAL_ACCEPTED` is prohibited.
- The wider Shop sales-quality sprint remains active.
- The subscription lane remains separate until remote D1/provider-backed recurring billing is accepted.
