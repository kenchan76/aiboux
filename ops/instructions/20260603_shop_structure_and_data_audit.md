# AIBOUX Shop Structure And Data Audit

## Status

INVESTIGATION_ONLY

## User Request

対象は AIBOUX / `shop.aboux.com` もしくは `shop.aiboux.com` 関連作業。
実装・修正に入らず、最初にリポジトリ全体のファイル構造、データ構造、現在の実装状態、ドメイン・URL混在を調査して報告する。

## Scope

- root直下
- `public/`
- `src/`
- `src/pages/`
- `src/components/`
- `src/layouts/`
- `src/assets/`
- 設定ファイル
- package / lock file
- build / deploy 関連ファイル
- `.env` 参照の有無
- 商品データ、カテゴリ、価格、画像、URL、在庫、決済、問い合わせ導線
- `aboux` / `aiboux` 混在

## Prohibited

- 実装変更しない。
- UI修正しない。
- デプロイしない。
- Bark送信しない。
- secretを表示しない。
- `reset` / `clean` / force pushしない。

## Deliverable

- ファイルツリー
- 現在のデータ構造
- 未実装箇所
- 触るべきファイル
- 実装前の注意点
- 次に作るべきShop構造案

