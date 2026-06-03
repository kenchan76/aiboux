# Core Delivery Detail Direct Preview Fix Log

作成日時: 2026-05-31 08:37 JST

## Status

BLOCKED_PREVIEW

このログは `DEPLOYED`、`FINAL_ACCEPTED`、`COMPLETED` ではありません。

## Instruction File

- `ops/instructions/20260531_core_delivery_detail_design_v5.md`
- `ops/instructions/current.md`

## 差し戻し理由

前回の画面プレビューURLは無効でした。

- `d66.html` と `d67.html` は中継ページであり、納品書詳細画面そのものではありませんでした。
- 直接画面URLとして提示した `/core/deliveries` は納品書一覧を表示していました。
- ユーザーがURLを開いた時点で `納品書詳細` が表示されないため、画面プレビューURLとして不合格でした。

## 修正内容

- `/core/deliveries?preview=delivery-detail&document=N20260530-01` で納品書詳細ワークスペースを直接開くように修正。
- 一覧行クリックなしで `納品書詳細` が表示されるPlaywright検査を追加。
- public style checkも直接詳細URLを開くように変更。
- v5 visual screenshot検査も直接詳細URLを基準に更新。
- `d66.html` / `d67.html` は無効URLとして表示するよう差し替え。
- `all_log/65` / `all_log/66` / `all_log/67` のPREVIEW_READY証跡を `BLOCKED_PREVIEW` として撤回。

## Invalidated 3 Required URLs

- マスター更新プレビューURL: https://mainly-fighters-cruise-screens.trycloudflare.com/m68.html
- 実行ログプレビューURL: https://mainly-fighters-cruise-screens.trycloudflare.com/l68.html
- 画面プレビューURL: https://incentives-scale-uri-clocks.trycloudflare.com/core/deliveries?preview=delivery-detail&document=N20260530-01

## BLOCKED_PREVIEW reason

- ユーザー確認で、画面プレビューURLが納品書詳細ではなく一覧画面を表示していると報告された。
- m68/l68のPREVIEW_READY証跡は実画面と矛盾したため無効。
- direct previewはSSR初期表示から詳細を出す必要がある。
- Bark final-only policyにより、中間ステータスではBarkを送らない。

## Verification

- `npm run check:control-chars`: PASS
- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- local Playwright direct detail URL: PASS
- public Playwright direct detail URL: PASS
- public style check: PASS
- `npm run gate:design`: PASS
- `npm run gate:code`: PASS
- `npm run gate:preview`: PASS

## Direct Screen URL Check

- URL: `https://incentives-scale-uri-clocks.trycloudflare.com/core/deliveries?preview=delivery-detail&document=N20260530-01`
- HTTP: 200
- Result: URL open時点で `納品書詳細` と `delivery-detail-workspace` が表示される。
- User click required: false

## Bark

- notification: not sent
- reason: Bark notifications are final-only by policy.
- secretLogged: false

注記: このログはv2 final-only policy適用後の有効証跡です。中間ステータスではBarkを送信しません。

## Notes

- This is `BLOCKED_PREVIEW`.
- This is not `DEPLOYED`.
- This is not `FINAL_ACCEPTED`.
- This is not `COMPLETED`.
