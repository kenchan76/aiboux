# Bark Final-Only Contract v2 and Direct Preview v6 Log

作成日時: 2026-05-31 08:50 JST

## Status

PREVIEW_READY

このログは `DEPLOYED`、`FINAL_ACCEPTED`、`COMPLETED` ではありません。

## Instruction Files

- `ops/instructions/20260531_codex_execution_contract_v2_bark_final_only.md`
- `ops/instructions/20260531_core_delivery_detail_direct_preview_v6.md`
- `ops/instructions/current.md`

## 反映内容

- Bark final-only contract v2を保存。
- `notify-bark.mjs` を `--stage final` 必須に変更。
- 中間ステータスのBark送信を禁止。
- `scripts/check-bark-policy.mjs` を追加。
- `package.json` に `check:bark-policy` を追加。
- `gate:code` / `gate:preview` / `gate:deploy` にBark policy checkを追加。
- `AIBOUX_MASTER_DOCUMENT.md` / `AGENTS.md` / `AGENT_RULES.md` / AIBOUX Skillをfinal-onlyへ更新。
- Core Delivery Detail direct preview v6指示書を作成。
- 画面プレビューURLは、一覧ではなく納品書詳細を直接表示するURLに固定。

## 3 Required URLs

- マスター更新プレビューURL: https://mainly-fighters-cruise-screens.trycloudflare.com/m69.html
- 実行ログプレビューURL: https://mainly-fighters-cruise-screens.trycloudflare.com/l69.html
- 画面プレビューURL: https://incentives-scale-uri-clocks.trycloudflare.com/core/deliveries?preview=delivery-detail&document=N20260530-01

## Bark

- notification: not sent
- reason: Bark notifications are final-only by policy.
- secretLogged: false

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run check:bark-policy`: PASS
- `notify-bark.mjs` non-final policy check: PASS (`BARK_FINAL_ONLY_POLICY`)
- `npm run gate:preview`: PASS

## Notes

- This is `PREVIEW_READY`.
- This is not `DEPLOYED`.
- This is not `FINAL_ACCEPTED`.
- This is not `COMPLETED`.
