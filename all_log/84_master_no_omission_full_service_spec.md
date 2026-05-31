# AIBOUX m68 日本語正本フルサービス仕様反映ログ

## Status

DEPLOYED

## Instruction

ユーザー指定の日本語正本マスターを省略せず、次のファイルへ反映する。

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`
- `all_log/84_master_no_omission_full_service_spec.md`

## Scope

この作業はドキュメントと公開m68の正本化のみを対象にする。
URL routing、tenant_id、shop_id、mailbox_id、user_id、Cloudflare route、D1、KV、R2、ソースコード挙動は変更しない。

## Required Master Content

`AIBOUX_MASTER_DOCUMENT.md` と `public/g/m68.md` は同一内容として更新した。

必須セクション:

- 省略禁止
- 現在の確定状態
- AIBOUX全体思想
- AIBOUX全サービス一覧
- URL設計の正仕様
- URL移行判定表
- AIBOUX Series Site 詳細仕様
- AIBOUX Core 詳細仕様
- AIBOUX Mail 詳細仕様
- AIBOUX Shop 詳細仕様
- AIBOUX Mall 詳細仕様
- AIBOUX File 詳細仕様
- AIBOUX Biz 詳細仕様
- Aiboux Office 詳細仕様
- AIBOUX 履歴書 詳細仕様
- AIBOUX Docs 詳細仕様
- MCP / API 方針
- UI / ロゴ / Badge 方針
- Bark通知方針
- Gate分離方針
- Worker Version ID証跡
- 公開URL検証
- Dirty Tree状態
- 絶対禁止事項
- 次タスク
- 公開m68反映証跡
- Codexへの反映指示

## Local File Evidence

- `AIBOUX_MASTER_DOCUMENT.md` sha256: `cb5b05bfb9e7266d81bbf562b729942c2746877d2e354373c85d94706ada25eb`
- `public/g/m68.md` sha256: `cb5b05bfb9e7266d81bbf562b729942c2746877d2e354373c85d94706ada25eb`
- source files match: 一致

## Verification Commands

- `npm run check:control-chars`: `CONTROL_CHAR_CHECK_OK`
- `npm run check:mojibake`: `MOJIBAKE_CHECK_OK files=276`
- `npm run gate:aiboux`: `AIBOUX_GATE_PASS`
- `npm run astro check`: 0 errors
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npx wrangler deploy`: PASS

## Public M68 Evidence

- URL: `https://mail.aiboux.com/g/m68`
- HTTP status: `200`
- content-type: `text/markdown; charset=utf-8`
- cache-control: `no-store, max-age=0`
- public body sha256: `6fff5138368726040cfd5accb444435e23dab6fa86302bdcfcf61f35ddcce608`
- public/source match: 不一致。理由は `public/g/m68.md` 内の `__WORKER_VERSION_ID__` placeholder をCloudflare Worker runtimeが実Worker Version IDへ置換して返すため。
- Worker Version ID after deploy: `4a242156-127f-421f-aa57-e3c2c431a02e`

## Required Public Keyword Checks

- `省略禁止`: PASS
- `AIBOUX全サービス一覧`: PASS
- `AIBOUX Core 詳細仕様`: PASS
- `AIBOUX Mail 詳細仕様`: PASS
- `AIBOUX Shop 詳細仕様`: PASS
- `AIBOUX Mall 詳細仕様`: PASS
- `AIBOUX File 詳細仕様`: PASS
- `AIBOUX Biz 詳細仕様`: PASS
- `Aiboux Office 詳細仕様`: PASS
- `AIBOUX 履歴書 詳細仕様`: PASS
- `AIBOUX Docs 詳細仕様`: PASS
- `rirekisho.aiboux.com`: PASS
- `docs.aiboux.com`: PASS
- `URL移行判定表`: PASS
- `Bark通知方針`: PASS
- `Worker Version ID`: PASS
- `Dirty Tree状態`: PASS
- `絶対禁止事項`: PASS
- `次タスク`: PASS

## Prohibited Actions Evidence

- Bark送信: なし
- reset: なし
- clean: なし
- force push: なし
- 削除: なし
- secret表示: なし
