# Core Delivery Detail Print Preview Layout Fix CODE_READY Log

作成日時: 2026-05-30 22:06:13 JST

## Status

CODE_READY

## 結論

納品書詳細画面のUI破綻修正は、ローカル実画面とPlaywright寸法検査で確認済みです。

このログはCODE_READYの証跡です。DEPLOYED、FINAL_ACCEPTED、COMPLETEDではありません。

## 修正内容

- 配送情報カードを横詰めのlabel/value配置から、ラベル上・フォーム下のフォームブロック配置へ変更。
- `配送希望時間帯` のselectが右端で切れないように、`min-w-0`、`w-full`、`min-w-[150px]` を調整。
- `納品日` inputが幅不足で崩れないように、`data-testid="delivery-detail-date-input"` と `min-w-[140px]` を付与。
- 上段3カードを1980px幅では横並び、狭いviewportでは1列に戻るレスポンシブgridへ調整。
- 納品先カードのlabel/value幅を固定し、`住所・建物名` が途中改行しないように整列。
- 明細一覧のgrid列幅を再調整し、操作列の編集/削除アイコンが右端で見切れないようにした。
- 明細行の操作列に `data-testid="delivery-line-actions"` を追加し、Playwrightで右端切れを寸法検査できるようにした。
- 固定フッターの右余白と本文下paddingを調整し、明細一覧とフッターの干渉を防止。
- フッターに `data-testid="delivery-detail-footer"` を維持し、内消費税の右端切れを寸法検査した。
- 印刷フローティングプレビュー、PDFダウンロード、別ウィンドウ帳票の既存動作を維持。

## 変更ファイル

- `src/components/core/CoreShell.tsx`
- `tests/core-delivery-detail-print.spec.ts`
- `all_log/60_core_delivery_detail_layout_fix_code_ready_log.md`

## Verification

- `npm run check:mojibake`: PASS
- `npm run astro check`: PASS
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8894 npx playwright test tests/core-delivery-detail-print.spec.ts --reporter=line`: PASS
- `npm run gate:code`: PASS

## Playwright寸法検査

確認済み:

- 配送情報カードの `配送希望時間帯` select がviewport右端からはみ出していない。
- `納品日` input が読み取れる幅を持ち、右端で切れていない。
- 明細一覧の最終操作列がviewport内に収まっている。
- 固定フッター内の `内消費税` がviewport内に収まっている。
- 最終明細行が固定フッターに隠れていない。
- 1980x1080スクリーンショットを保存済み。
- 1366x768スクリーンショットを保存済み。
- 印刷プレビュー、PDFダウンロード、別ウィンドウ帳票の実動作を維持。

## Evidence

- `output/playwright/core-documents-redesign/delivery-detail-fixed.png`
- `output/playwright/core-documents-redesign/delivery-detail-fixed-1366.png`
- `output/playwright/core-documents-redesign/delivery-print-preview-open-fixed.png`
- `output/playwright/core-documents-redesign/delivery-print-window-fixed.png`
- `output/playwright/core-documents-redesign/delivery-note-download.pdf`
- `output/playwright/core-documents-redesign/delivery-detail-fixed-dom-audit.json`

## Not Deployed

本ログ作成時点では、本番deployは実行していません。

理由:

- Cloudflare secret / Wrangler認証は今回のUI修正ゲートに含めない指示のため。
- `/g/cdeliv9` は本ログ時点では最新証跡として扱いません。
- Worker Version IDは本ログでは発行・記録していません。
- Bark、Hermes、Grok、Cloudflare AIは今回のUI修正主ゲートに含めていません。

## Remaining External Gates

FINAL_ACCEPTEDに進める場合は、別ゲートで以下が必要です。

- Cloudflare / Wrangler認証復旧
- 本番deploy
- Worker Version ID実値記録
- `/g/cdeliv9` 最新ログ反映
- Bark `userReceiptConfirmed=true`
- 必要に応じたHermes監査

## Security

- secret値はログ、docs、chat、公開URLへ記録していません。
- Bark device key、Cloudflare token、Account ID、`.env`、`bark.env`、`cloudflare.env` の内容は記録していません。

## 2026-05-30 22:11 JST 追記: 公開プレビューURL再発行

ユーザーから、直前に提示した公開プレビューURLが閲覧できないとの指摘があったため、古い `8894` 向けQuick Tunnelを停止し、新しいTEMP_PREVIEW URLを発行しました。

今回の指摘内容:

- 「みれねって公開URLにしろっていってるだろ」
- 見られないURLを提示した状態をログに残すこと。

対応:

- ローカル `http://127.0.0.1:8894/core/deliveries` が `HTTP 200` を返すことを確認。
- 古い `8894` 向けQuick Tunnelを停止。
- 新しいQuick Tunnelを `http://127.0.0.1:8894` に対して起動。
- 新しい公開プレビューURLで `/core/deliveries` が `HTTP 200` を返すことを確認。

新しいTEMP_PREVIEW URL:

- `https://working-economies-edmonton-kai.trycloudflare.com/core/deliveries`

確認結果:

- `curl -I --max-time 20 https://working-economies-edmonton-kai.trycloudflare.com/core/deliveries`: HTTP 200

注意:

- このURLはTEMP_PREVIEWです。
- 本番deploy URLではありません。
- Worker Version IDは発行されていません。
- `/g/cdeliv9` はこのログ時点では最新証跡として扱いません。

## 2026-05-30 22:11 JST 追記: Bark通知

ユーザーからBark通知も要求されたため、Bark通知を `--required --confirm-received` で実行しました。

結果:

- Bark secretファイルの存在とpermission `600` は確認済み。
- Bark送信処理は開始したが、ユーザー端末での受信確認入力が得られる前に中断。
- `userReceiptConfirmed=false` のため、Bark成功扱いにはしていません。
- Bark Gateは未完了です。

記録していないもの:

- Bark device key
- Bark endpoint完全URLにsecretが含まれる場合のURL
- `bark.env` の内容

## 2026-05-30 22:20 JST 追記: URL Bundle and Bark Notification

ユーザーから、CODE_READY報告時にも以下3URLを必ず提示し、その後にBark通知を送るよう指示がありました。

### Report URL Bundle

- Master update preview URL: `https://mainly-fighters-cruise-screens.trycloudflare.com/master-update-20260530-2219.html`
- Execution log preview URL: `https://mainly-fighters-cruise-screens.trycloudflare.com/delivery-detail-layout-code-ready-log-20260530-2219.html`
- Screen preview URL: `https://working-economies-edmonton-kai.trycloudflare.com/core/deliveries`

### URL Checks

- Master URL: HTTP 200
- Execution log URL: HTTP 200
- Screen preview URL: HTTP 200
- Master/log public response charset: `utf-8`
- Master/log public response cache policy: `no-store`

### AIBOUX_MASTER_DOCUMENT.md 更新

以下を更新しました。

- Public Preview First Policy
- Progressive Completion Status Policy
- Report URL Bundle Rule
- Bark Notification Rule

### AGENTS.md / AGENT_RULES.md 更新

以下を更新しました。

- Required Report URL Bundle
- Bark Notification After Report URL Bundle
- Report URL Bundle Rule

### Bark

3URLを揃えた後、Bark通知を送信しました。

送信内容:

- status: `CODE_READY`
- task: `納品書詳細画面`
- included URL: master update preview URL
- included URL: execution log preview URL
- included URL: screen preview URL

結果:

```json
{"provider":"bark","secretLogged":false,"ok":true,"delivered":true,"skipped":false,"endpointHost":"api.day.app","mode":"push-json","status":200,"responseCode":200,"responseMessage":"success","responseType":"json","probeAuth":false,"userReceiptConfirmed":false}
```

注意:

- このBark通知はCODE_READY通知です。
- `COMPLETED`、`FINAL_ACCEPTED`、`DEPLOYED` とは書いていません。
- `userReceiptConfirmed=false` のため、FINAL_ACCEPTED用のBark Gate成功扱いにはしていません。
- secret値はログ、docs、chat、公開URLへ記録していません。

### Status

CODE_READY remains valid.

This is not DEPLOYED, FINAL_ACCEPTED, or COMPLETED.
