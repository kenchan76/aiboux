# Current AIBOUX Task

## Task Name

Publish Full Japanese Master With Core Document AI, Core UI v3, And Numbering Policy

## Status

DEPLOY_READY

## Source Of Truth

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`

## User Request

The current public URL Bundle is still treated as an old or shallow master. Update `AIBOUX_MASTER_DOCUMENT.md` and `public/g/m68.md` into the full Japanese master and publish it.

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
