# Core Delivery Detail Preview CSS Recovery BLOCKED_DESIGN Log

作成日時: 2026-05-30 22:55 JST

## Status

BLOCKED_DESIGN

このログは `CODE_READY`、`DEPLOYED`、`FINAL_ACCEPTED`、`COMPLETED` ではありません。

## 2026-05-30 23:15 JST 差し戻し

CSS/JS読込は復旧済みですが、ユーザー実画面確認でデザインがまだ業務画面として不十分と判断されました。

理由:
- 公開プレビューはCSS/JS読込済みだが、デザインがまだ不十分。
- 上段カードがまだ大きい。
- 明細一覧が下に落ちている。
- 右上アクションが右端で詰まり、保存ボタンが見切れ気味。
- フッターが本文に近く、下部エリアを圧迫している。
- `単位` ヘッダーや明細列がまだ業務画面として最適化されていない。
- ユーザー実画面確認で「ほぼなおせていない」と指摘された。

このため、本ログの有効ステータスは `BLOCKED_DESIGN` です。デザイン修正v3完了後は `all_log/63_core_delivery_detail_design_v3_code_ready_log.md` を新規作成します。

## 差し戻し内容

ユーザー確認で、公開プレビュー `https://working-economies-edmonton-kai.trycloudflare.com/core/deliveries` が素HTML表示になっていました。AIBOUXロゴ、サイドバー、ボタン、shadcn/ui、Tailwindの見た目が崩れており、CSS/JS未読込状態でした。

このため、旧プレビューURLは無効です。`all_log/61_core_delivery_detail_design_fix_v2_code_ready_log.md` は `BLOCKED_PREVIEW` に撤回済みです。

## 原因

公開トンネル以前に、ローカルpreview server側で `/_astro/global.F-eqfWHR.css` が 404 でした。

原因は preview 用configを `dist/server` 配下に生成していたことで、Wrangler実行時の相対パス解決が曖昧になり、`dist/client` の `_astro` assets が配信されない状態になっていたことです。

## 対応

- `scripts/prepare-preview-wrangler-config.mjs` を修正し、script自身の場所からrepo rootを動的解決するようにしました。
- generated configはrepo root直下 `wrangler.preview.generated.json` に出力します。
- generated config内の `assets.directory` は `./dist/client` に統一しました。
- fixed machine pathはgenerated config、docs、all_logへ書かない方針に修正しました。
- `wrangler dev --config wrangler.preview.generated.json --ip 127.0.0.1 --port 8894 --local` をrepo rootから再起動しました。
- 古い画面トンネルを停止し、新しいQuick Tunnelを発行しました。
- 公開URLでCSS/JS assetがHTTP 200で返ることを確認しました。
- 公開URLでPlaywright style checkを追加し、Tailwind/shadcn/uiが適用済みであることを検査しました。

## 2026-05-30 23:06 JST 追記: preview assets.directory の動的化

ユーザーから、preview用 `assets.directory` を固定絶対パスで生成configへ書かないよう指摘がありました。販売・テナント化するサービスで環境固定パスを証跡やconfigへ残すことはNGです。

対応:
- `scripts/prepare-preview-wrangler-config.mjs` を再修正しました。
- repo rootはscript自身の場所から動的に解決します。
- generated configはrepo root直下 `wrangler.preview.generated.json` に作成します。
- generated config内の `assets.directory` は `./dist/client` です。
- generated config内の `main` は `./dist/server/entry.mjs` です。
- generated config内にmachine-specific absolute pathを書きません。
- `wrangler dev` はrepo rootをcwdにして `--config wrangler.preview.generated.json` で起動します。

検証:
- `PREVIEW_CONFIG_DYNAMIC_PATH_OK`: PASS
- local CSS asset HTTP 200: PASS
- local JS asset HTTP 200: PASS
- public style check: PASS
- public delivery detail print test: PASS
- latest effective files absolute path scan: PASS

補足:
- `AIBOUX_MASTER_DOCUMENT.md` 内の古い履歴スナップショットには過去の環境パス記述が残っています。
- それらはHistorical source snapshotsであり、今回の最新証跡・generated config・scripts・AGENTS・AGENT_RULES・tempLogShares・`/g` routingには固定絶対パスを残していません。
- 最新証跡では、固定絶対パスではなく `repoRoot/dist/client` を実行時に動的解決し、generated configには `assets.directory = "./dist/client"` のみを書きます。

## 2026-05-30 23:06 JST 追記: 3URL再発行

- マスター更新プレビューURL: `https://mainly-fighters-cruise-screens.trycloudflare.com/master-update-preview-config-path-20260530-2306.html`
- 実行ログプレビューURL: `https://mainly-fighters-cruise-screens.trycloudflare.com/delivery-detail-preview-css-recovery-code-ready-log-20260530-2306.html`
- 画面プレビューURL: `https://genres-variations-get-grocery.trycloudflare.com/core/deliveries`

URL確認:
- Master URL: HTTP 200, `text/html; charset=utf-8`, `cache-control: no-store`
- Log URL: HTTP 200, `text/html; charset=utf-8`, `cache-control: no-store`
- Screen preview URL: HTTP 200
- Public log UTF-8 check: PASS

Bark CODE_READY通知:

```json
{"provider":"bark","secretLogged":false,"ok":true,"delivered":true,"skipped":false,"endpointHost":"api.day.app","mode":"push-json","status":200,"responseCode":200,"responseMessage":"success","responseType":"json","probeAuth":false,"userReceiptConfirmed":false}
```

注記: CODE_READY通知として送信済みです。`userReceiptConfirmed=false` のため、これはFINAL_ACCEPTED / COMPLETEDの通知完了ゲートではありません。

## 無効URL

- 旧画面プレビューURL: `https://working-economies-edmonton-kai.trycloudflare.com/core/deliveries`

理由:
- CSS asset 404
- JS/CSS未読込
- Tailwind/shadcn/ui未適用
- ブラウザ標準表示

## 有効な3URL Bundle

- マスター更新プレビューURL: `https://mainly-fighters-cruise-screens.trycloudflare.com/master-update-css-recovery-20260530-2255.html`
- 実行ログプレビューURL: `https://mainly-fighters-cruise-screens.trycloudflare.com/delivery-detail-preview-css-recovery-code-ready-log-20260530-2255.html`
- 画面プレビューURL: `https://genres-variations-get-grocery.trycloudflare.com/core/deliveries`

## Public Preview Asset Checks

- `/core/deliveries`: HTTP 200
- `/_astro/global.EXAgQUrR.css`: HTTP 200, `content-type: text/css; charset=utf-8`
- `_astro` JavaScript assets: HTTP 200, `content-type: text/javascript; charset=utf-8`

## Playwright

- public style check: PASS
- public delivery detail print test: PASS
- print floating preview: PASS
- PDF download event: PASS
- separate window popup: PASS
- fixed footer visibility: PASS
- action column visibility: PASS
- delivery shipping time select visibility: PASS
- delivery detail compact card checks: PASS

## Verification

- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `PLAYWRIGHT_BASE_URL=https://genres-variations-get-grocery.trycloudflare.com npx playwright test tests/core-preview-style.spec.ts tests/core-delivery-detail-print.spec.ts --reporter=line`: PASS
- `npm run gate:code`: PASS

## Evidence

- `output/playwright/core-documents-redesign/delivery-detail-fixed-v3.png`
- `output/playwright/core-documents-redesign/delivery-detail-fixed-v3-1366.png`
- `output/playwright/core-documents-redesign/delivery-print-preview-open-fixed.png`
- `output/playwright/core-documents-redesign/delivery-print-window-fixed.png`
- `output/playwright/core-documents-redesign/delivery-note-download.pdf`

## Bark通知

- status: sent
- title: `AIBOUX CODE_READY`
- 3URLを本文に含める
- secretLogged: false
- result:

```json
{"provider":"bark","secretLogged":false,"ok":true,"delivered":true,"skipped":false,"endpointHost":"api.day.app","mode":"push-json","status":200,"responseCode":200,"responseMessage":"success","responseType":"json","probeAuth":false,"userReceiptConfirmed":false}
```

注記: これはCODE_READY通知です。`userReceiptConfirmed=false` のため、FINAL_ACCEPTED / COMPLETED のBark Gate達成ではありません。

## Notes

- This is CODE_READY.
- Not DEPLOYED.
- Not FINAL_ACCEPTED.
- Not COMPLETED.
- 本番 `/g/cdeliv9` はWrangler認証復旧とdeploy後に更新対象です。
