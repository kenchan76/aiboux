# AIBOUX Core Master Full Japanese Specification Update

## Status

DEPLOYED

## Purpose

現行の `https://mail.aiboux.com/g/m68` が、外部確認経路で英語主体の旧マスターまたは浅いマスターとして扱われる問題を修正する。

今回の対象は、AIBOUX正本マスターを日本語詳細版として公開URLへ固定することである。

## Root Cause

`public/g/m68.md` は日本語詳細正本へ更新済みだったが、実リクエストの `/g/{id}` は `src/pages/g/[id].ts` の `shortLogShares` と `src/lib/server/tempLogShares.ts` の共有IDを経由していた。

そのため、`m68`、`l68`、`d68` の短縮URLが旧サービスURL移行証跡IDを参照し続けると、公開URLで旧本文へ戻る可能性があった。

## Fix

- `AIBOUX_MASTER_DOCUMENT.md` を日本語詳細正本にする。
- `public/g/m68.md` を同じ日本語詳細正本にする。
- `ops/instructions/current.md` に今回の短縮URL解決修正を反映する。
- `/g/m68` を `aiboux-full-japanese-master-20260601` に向ける。
- `/g/l68` を `aiboux-full-japanese-master-log-20260601` に向ける。
- `/g/d68` を `aiboux-full-japanese-master-screen-20260601` に向ける。
- 旧 `service-url-migration` 系IDへ戻らないよう、`shortLogShares` の m68/l68/d68 を差し替える。

## Required Public URLs

- マスター: `https://mail.aiboux.com/g/m68`
- ログ: `https://mail.aiboux.com/g/l68`
- 画面: `https://mail.aiboux.com/g/d68`

## Required Content Checks

公開m68には次を含める。

- 省略禁止
- AIBOUX全サービス一覧
- Core書類管理AI構想
- Gemini Flash
- LINE取込
- スマホ写真撮影
- PCアップロード
- 商品マスター
- 得意先マスター
- 納品先マスター
- 自動採番
- N/E/I/O
- rirekisho.aiboux.com
- docs.aiboux.com
- 絶対禁止事項

## Prohibited Actions

- Bark送信なし。
- resetなし。
- cleanなし。
- force pushなし。
- 削除なし。
- secret表示なし。

## Verification Results

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run gate:aiboux`: PASS / `AIBOUX_GATE_PASS`
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npx wrangler deploy`: PASS
- Current Version ID: `024353f8-3ab0-431e-81d7-30d5d0a533d3`
- `https://mail.aiboux.com/g/m68`: HTTP 200
- `https://mail.aiboux.com/g/m68`: `content-type: text/markdown; charset=utf-8`
- `https://mail.aiboux.com/g/l68`: HTTP 200
- `https://mail.aiboux.com/g/l68`: `content-type: text/markdown; charset=utf-8`
- `https://mail.aiboux.com/g/d68`: HTTP 200
- `https://mail.aiboux.com/g/d68`: `content-type: text/markdown; charset=utf-8`

## Public m68 Grep Evidence

公開m68本文で次を確認した。

- `省略禁止`: found
- `AIBOUX全サービス一覧`: found
- `Core書類管理AI構想`: found
- `Gemini Flash`: found
- `LINE取込`: found
- `スマホ写真撮影`: found
- `PCアップロード`: found
- `商品マスター`: found
- `得意先マスター`: found
- `納品先マスター`: found
- `自動採番`: found
- `N/E/I/O`: found
- `rirekisho.aiboux.com`: found
- `docs.aiboux.com`: found
- `絶対禁止事項`: found

## SHA256 Evidence

- `public/g/m68.md`: `1a127fa37cf794a206232af3ae3d9a5dc55e5bcf37ec30f53ad1b751eb730caa`
- 公開 `/g/m68` body: `29427746912336857d613499c242ec9820dad02de0fab5b6d5211f5bdcecd59a`

sha256は一致しない。理由は、Workerが公開時に `__WORKER_VERSION_ID__`、`__WORKER_VERSION_TAG__`、`__WORKER_VERSION_TIMESTAMP__` を実値へ置換するためである。

## Safety Result

- Bark送信なし。
- resetなし。
- cleanなし。
- force pushなし。
- 削除なし。
- secret表示なし。

## Final Public Bundle

- マスター: `https://mail.aiboux.com/g/m68`
- ログ: `https://mail.aiboux.com/g/l68`
- 画面: `https://mail.aiboux.com/g/d68`

最終公開確認では、旧英語タイトル `AIBOUX Master State: Service URL Migration` の出現数は0だった。
