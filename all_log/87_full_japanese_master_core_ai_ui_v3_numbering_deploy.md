# Full Japanese Master Core AI UI v3 Numbering Deploy

## Status

DEPLOYED

## User Finding

The current public URL Bundle is still treated as old or shallow by the external checker.
The public `https://mail.aiboux.com/g/m68` did not match the local full master.

## Public m68 Before This Task

- URL: `https://mail.aiboux.com/g/m68`
- HTTP status: 200
- content-type: `text/markdown; charset=utf-8`
- public body size before this task: 58,710 bytes
- local `AIBOUX_MASTER_DOCUMENT.md` size before UI v3 addition: 93,903 bytes
- public body did not include `Core書類管理AI構想`, `Gemini Flash`, `invoice_issued_internal`, or `document_intakes`

## Added In This Task

- `29. AIBOUX Core マスターUI v3方針`
- `30. AIBOUX Core 自動採番方針`

## Master Content Required

- 省略禁止ルール
- AIBOUX全サービス詳細
- Core書類管理AI構想
- LINE / スマホ撮影 / PCアップロード取込
- Gemini Flash本命方針
- 高速ファイルプレビューUI
- 注文書 → 納品書 → 月末請求書フロー
- Mail/LINEからの注文・見積・請求依頼変換
- 商品/得意先/納品先/設定UI v3方針
- 自動採番 N/E/I/O
- URL設計
- Bark通知方針
- Worker Version ID証跡
- dirty tree状態
- 絶対禁止事項
- 次タスク

## Core Master UI v3 Recorded

- 商品マスター一覧/詳細/作成/編集
- 得意先マスター一覧/詳細/作成/編集
- 納品先マスター一覧/詳細/作成/編集
- 設定画面
- 自動採番設定
- 左サイドバーは既存から変えない
- 右細カラム詳細は禁止
- サイドバー右端から画面右端まで使う全画面スライド
- 行間、余白、テーブル行高、入力欄、ボタン配置を揃える

## Auto Numbering Recorded

| Document | Prefix |
| --- | --- |
| 納品書 | N |
| 見積書 | E |
| 請求書 | I |
| 注文書 | O |

Base format:

```text
{PREFIX}{YYYYMMDD}-{連番2桁以上}
```

Examples:

```text
N20260601-01
E20260601-01
I20260601-01
O20260601-01
```

## Files Updated

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `public/g/l68.md`
- `public/g/d68.md`
- `ops/instructions/current.md`
- `all_log/87_full_japanese_master_core_ai_ui_v3_numbering_deploy.md`

## Safety

- Bark not sent.
- reset not run.
- clean not run.
- force push not run.
- files not deleted.
- secrets not printed.

## Verification Plan

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run gate:aiboux`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `npx wrangler deploy`
- public curl verification for `https://mail.aiboux.com/g/m68`

## Verification Result

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run gate:aiboux`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npx wrangler deploy`: PASS
- final Worker Version ID: `da35f9fc-7d67-4c9f-93c7-1231ee477f80`
- `https://mail.aiboux.com/g/m68`: HTTP 200, `text/markdown; charset=utf-8`, Japanese detailed master
- `https://mail.aiboux.com/g/l68`: HTTP 200, deployment log updated
- `https://mail.aiboux.com/g/d68`: HTTP 200, screen/artifact evidence updated

## Public m68 Evidence

Public `/g/m68` includes:

- `AIBOUX Core 書類管理AI構想`
- `Gemini Flash`
- `invoice_issued_internal`
- `AIBOUX Core マスターUI v3方針`
- `右細カラム詳細は禁止`
- `AIBOUX Core 自動採番方針`
- `N20260601-01`
- `E20260601-01`
- `I20260601-01`
- `O20260601-01`
- `AIBOUX Docs 詳細仕様`
- `AIBOUX 履歴書 詳細仕様`

## Commit Scope

Commit/push should include only the files updated for this master publication task.
Existing unrelated dirty tree files must not be reset, cleaned, or included accidentally.
