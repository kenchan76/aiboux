# Current AIBOUX Task

## Task Name

Publish Full Japanese Master With Core Document AI, Core UI v3, And Numbering Policy

## Status

DEPLOYED

## Source Of Truth

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`

## User Request

The current public URL Bundle is still treated as an old or shallow master. Update `AIBOUX_MASTER_DOCUMENT.md` and `public/g/m68.md` into the full Japanese master and publish it.

## Active Route Fix

`/g/m68`、`/g/l68`、`/g/d68` は `public/g/*.md` を直接読むだけではなく、`src/pages/g/[id].ts` の `shortLogShares` と `src/lib/server/tempLogShares.ts` を経由する。

今回の追加修正では、短縮URLの参照先を旧 `service-url-migration` 系IDから次へ差し替える。

- `m68` -> `aiboux-full-japanese-master-20260601`
- `l68` -> `aiboux-full-japanese-master-log-20260601`
- `d68` -> `aiboux-full-japanese-master-screen-20260601`

これにより、外部確認経路で旧英語主体マスターへ戻る経路を閉じる。

## Required Content

- 省略禁止ルール
- AIBOUX全サービス詳細
- Core書類管理AI構想
- LINE / スマホ撮影 / PCアップロード取込
- Gemini Flash本命方針
- 高速ファイルプレビュー
- 注文書 → 納品書 → 月末請求書フロー
- Mail/LINEからの注文・見積・請求依頼変換
- 商品/得意先/納品先/設定UI v3方針
- 見積書・注文書・請求書・納品書の自動採番 N/E/I/O
- 全画面スライド詳細・作成UI方針
- rirekisho / docs / mall / file / biz / office の詳細
- URL設計
- Bark通知方針
- Worker Version ID証跡
- dirty tree状態
- 絶対禁止事項
- 次タスク

## Required Commands

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run gate:aiboux`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `npx wrangler deploy`
- `curl -sS -L -D /tmp/m68.headers https://mail.aiboux.com/g/m68 -o /tmp/m68.body`

## Prohibited Actions

- Bark送信禁止。
- reset禁止。
- clean禁止。
- force push禁止。
- 削除禁止。
- secret/PAT/API key/token表示禁止。

## Worker Version Evidence

- Deployment action in this task: deployed.
- Worker Version ID before this task: `756a7286-5335-42d7-b54b-d5d320d8bb9f`
- First deploy Worker Version ID: `f4c6f13a-371c-4af3-8f35-abcf4f13c8d2`
- Final deploy Worker Version ID after updating `/g/l68` and `/g/d68`: `da35f9fc-7d67-4c9f-93c7-1231ee477f80`
- Route fix deploy Worker Version ID: `7072f564-3d13-44e5-a6aa-ae3c77ae6f39`
- Final deploy Worker Version ID after public log/screen artifact update: `024353f8-3ab0-431e-81d7-30d5d0a533d3`
