# AIBOUX Shop Phase 20 Final Log

作業日時: 2026-05-28

## 実装概要

AIBOUX Shopに、JSONスキーマ駆動の公開ストアフロントSSRと、出店者向けのクリック選択式ストアデザインビルダーを実装した。

## 主な変更

- `shop_storefront_layouts` テーブルを追加。
- ストアフロント用の厳格なJSONスキーマとサニタイザーを追加。
- `/shop/api/storefront/layout` を追加し、テナント単位でレイアウトを取得・保存できるようにした。
- `/shop/settings/design` を追加し、中央キャンバスと右サイドバーで編集するビルダーを実装。
- Shopサイドバーに `ストアデザイン` を追加。
- `/shop/storefront/[tenant]` を追加し、D1のレイアウトJSONと公開商品からAstro SSRでHTMLを生成するようにした。

## デザイン制約

- カラーピッカーなし。
- フォントサイズ変更なし。
- 余白調整なし。
- 任意CSS入力なし。
- キャンバス上での直接WYSIWYG編集なし。
- 出店者は内容と順序だけを編集し、AIBOUX側の固定デザインシステムで品質を担保する。

## 追加・変更ファイル

- `migrations/0017_shop_phase20_storefront_layouts.sql`
- `src/lib/shopStorefrontLayout.ts`
- `src/pages/shop/api/storefront/layout.ts`
- `src/components/shop/StorefrontDesignBuilder.tsx`
- `src/pages/shop/settings/design.astro`
- `src/pages/shop/storefront/[tenant].astro`
- `src/components/shop/ShopClientShell.tsx`
- `src/data/shop-sample-data.ts`
- `AIBOUX_MASTER_DOCUMENT.md`

## D1適用

- ローカルD1: 成功。
- リモートD1 `aiboux-b2b-db`: 成功。
- リモート結果:
  - 4 queries executed
  - 3 rows read
  - 7 rows written

## Tripartite AI Workflow

### Codex

- 実装、型検査、ビルド、ローカルHTTPスモーク、D1適用を実行。
- Astroテンプレート内にReact風の関数宣言が残る問題を検出し、純粋なAstroテンプレート分岐へ修正した。

### Cloudflare AI

- 監査ログ: `all_log/23_phase20_cloudflare_ai_audit.json`
- 結果:
  - テナント分離、JSONスキーマ安全性、SSRクエリ構成、Cache-Controlについて概ね承認。
- 補足:
  - Cloudflare AIは色・フォント・WYSIWYG編集の追加を提案したが、これはPhase 20の「自由度を排除し、誰が作っても崩れない」仕様に反するため不採用。

### Grok

- 監査ログ: `all_log/23_phase20_grok_ux_review.md`
- 結果:
  - Grok CLIは90秒でタイムアウト。
  - 外部Grok承認は取得できていない。
  - Codexが代替UXゲートを実施し、Phase 20要件に対するブロッカーは見つからなかった。

## 検証結果

- `npm run astro check`
  - 0 errors
- `ESBUILD_WORKER_THREADS=0 npm run build`
  - 成功
- ローカルHTTPスモーク:
  - `HEAD /shop/storefront/tenant_001`: 200
  - `GET /shop/storefront/tenant_001`: `雪花セレクト`, `おすすめ商品`, `在庫あり`, `購入へ` を確認
  - `HEAD /shop/settings/design`: 200
  - `GET /shop/api/storefront/layout?tenant_id=tenant_001`: published layout JSONを確認

## 注意点

- Grokは今回もタイムアウトしたため、TripartiteのうちGrokだけは外部承認を取得できていない。
- 公開ストアフロントのキャッシュは短期TTLで開始している。将来、レイアウト保存時の明示的なパージまたはrevalidationを追加するとより堅牢になる。

## 公開URL

- 管理画面: `https://shop.aiboux.com/shop/settings/design`
- 公開ストアフロント: `https://shop.aiboux.com/shop/storefront/tenant_001`
