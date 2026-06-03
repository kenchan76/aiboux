# AIBOUX Master Spec

> Archive note: This file is retained for historical traceability only. The active Source of Truth is `/home/pkkatsu/aiboux/AIBOUX_MASTER_DOCUMENT.md`.
> Any old deployment-approval wording in this archived snapshot is superseded by the current Production Deployment Rule: normal code/UI/API production deployment may run after required verification passes; `git push`, destructive operations, secret exposure/transfer, real external sending, pricing/billing changes, marketplace publication, customer/personal-data external transfer, and high-risk legal/pricing/contract/refund decisions still require human approval.

この文書は AIBOUX 全体の Source of Truth です。開発 AI は実装前に必ずこの文書を読み、不明点を推測で埋めず `TBD` として扱います。

## Confirmed Decisions

| 項目 | 決定 |
|---|---|
| 全体思想 | 1人でも会社業務を回せる、高密度・高速・実務特化の統合業務OS |
| 本体サイト | `https://aiboux.com` はシリーズ紹介・入口・ポータルであり、アプリ本体ではない |
| Core URL | `https://core.aiboux.com/` |
| Mail URL | `https://mail.aiboux.com` |
| Shop URL | `https://shop.aiboux.com` |
| Mall URL | `https://mall.aiboux.com` |
| File URL | `https://file.aiboux.com` |
| Biz URL | `https://biz.aiboux.com` |
| Office URL | `https://office.aiboux.com` |
| 履歴書 URL | `https://rirekisho.aiboux.com` |
| Docs URL | `https://docs.aiboux.com` |
| UI共通方針 | Light mode only、Notion風、白背景、細い罫線、高密度、余白20%削減 |
| ロゴ | 小文字 `aiboux` のみ。Aマークや不要ロゴは禁止 |
| Core/Mail/Shop | shadcn/ui 方針 |
| File/Biz/Office/履歴書 | Starwind UI 方針 |
| AI Assistant | 原則 draft 作成まで。本番反映・削除・価格変更・公開は人間承認必須 |
| Mail音声操作 | 読み上げ要約、音声返信メモ補正、返信下書き承認UIを扱う。外部送信は人間承認必須 |
| Dev Monitor | Workersのエラー要約をXServer VPSへ渡し、開発AIが修正案と検証結果を起草する。デプロイは人間承認必須 |

## Assumptions

- AIBOUX は Core を正本として、周辺サービスへ商品・得意先・納品先・価格・在庫・ファイル・履歴を連携する。
- 無料系サービスである File / Biz / Office / 履歴書は、SEO入口、広告収益入口、会員登録入口、Core / Mail / Shop への送客導線を兼ねる。
- Cloudflare Pages / Workers / D1 / R2 / KV / Queues / Cron / Turnstile を組み合わせる構成を基本とする。
- Mailの業務/プライベート判定はAIバックグラウンド自動分類を基本にし、プライベート判定メールはCore横断参照へ流さない。

## TBD

| 項目 | 状態 |
|---|---|
| AIBOUX Public Site UI Library | Starwind UI candidate。最終確定は実装時に確認 |
| Docs UI Library | TBD |
| Mall UI Library | TBD |
| Biz CTA最終色 | purple案とgreen案の経緯あり。最新版の確定色はTBD |
| Workers AI 最終モデル | Mail公私判定、要約、下書き生成の最終モデルと商用APIフォールバック条件はTBD |
| Dev Monitor管理画面 | `dev.aiboux.com` 等の管理者承認URLはTBD |

## Do Not Invent

- 未確定URLを勝手に確定しない。なお `mail.aiboux.com` と `mall.aiboux.com` は確定済み。
- 未確定料金・保存容量・保存期間を勝手に決めない。
- 競合サービスの文言、テンプレート本文、UIをコピーしない。
- AdSenseポリシーを無視しない。
- Officeファイルがサーバーに送信される設計にしない。
- PDF/Office完全互換を勝手に謳わない。
- AIBOUX 履歴書で `RIREKISHO` 表記を使わない。
- Aマークや不要ロゴマークを追加しない。
- ダークモードを勝手に入れない。
- AIがメールを自動外部送信しない。音声操作でも必ず下書きと人間承認を挟む。
- プライベート判定メールをCore販売管理、取引先候補、横断AI参照へ混ぜない。
- VPS常駐エージェントに本番デプロイ、秘密情報送信、リポジトリ外削除を自動実行させない。

## Service Universe

### AIBOUX Series Site

- URL: `https://aiboux.com`
- 役割: AIBOUX全サービスの紹介・入口・シリーズポータル。
- アプリ本体ではなく、思想、料金、ユースケース、関連サービス導線を伝えるマーケティングサイト。

### AIBOUX Core

- URL: `https://core.aiboux.com/`
- 役割: 基幹業務、帳票、商品マスタ、在庫、得意先、納品先、卸価格の正本。
- UI: Astro 6 + shadcn/ui。Notion × Stripe Dashboard × ERP。
- 右AI Assistant常設。

Core管理対象:

- 帳票: 見積書、注文書、納品書、請求書、入金伝票
- 仕入: 発注書
- 在庫: 在庫一覧、入出庫履歴・調整、アラート・適正在庫
- マスタ: 取引先、商品・SKU、従業員・権限

Core商品マスタは AIBOUX 全体の商品正本です。任意の商品区分、お気に入り区分、得意先別卸価格、価格改定予約、納品先マスタ、Shop商品/SKU連携を扱います。

### AIBOUX Mail

- URL: `https://mail.aiboux.com`
- 役割: 業務処理特化メール。
- UI: Astro 6 + shadcn/ui。Gmail風だがCoreの密度と白背景に統一。
- 左上: `aiboux MAIL`
- Coreメニューを表示しない。
- 右下FABから開くフローティングAI Assistant。
- 2026-05-27例外: MailのAI Assistantは、ユーザー明示指示によりAIBOUXブランドの深いパープルから鮮やかなシアンへ変化する薄いすりガラス表現を許可する。本文カードや要約カードは白基調・高コントラストを維持する。最下部のAI依頼入力エリアと「よく使う依頼」ボタンは、視認性を担保できる場合に限り高コントラストのグラス表現を許可する。
- 音声要約、音声返信メモ補正、公私判定、返信下書き承認UIを持つ。
- 受信トレイ、未読メール、分割表示、PC向け1行リスト表示を持つ。PC向け1行リスト表示では、メール行クリックで対象メールを選択し、本文詳細を読める分割表示へ復帰する。
- 設定画面では独自ドメイン設定ウィザード、IMAP/POPヘルプ、アドレス別表示名/署名UIを扱う。実DNS検証とD1永続化はTBD。

### AIBOUX Shop

- URL: `https://shop.aiboux.com`
- 役割: Shopify風の店舗運営バックオフィス。
- UI: Astro 6 + shadcn/ui。
- 左上: `aiboux SHOP`
- Core商品を正本としてShop親商品、SKUバリエーション、モール別設定へ展開する。

### AIBOUX Mall

- URL: `https://mall.aiboux.com`
- 役割: 一般顧客向け集客モール。
- UI方向: Amazonライクな検索とファセット、Yahoo!風の購買CTA。
- CTA色: purchase `#FF9933`、warning `#FF4D4D`、point `#FFCC00`。

### AIBOUX File

- URL: `https://file.aiboux.com`
- 役割: ファイル転送、PDF、画像、背景切り抜き、QR/バーコード作成。
- UI: Astro 6 + Starwind UI。blue CTA。
- File MVPではAI補完を入れない。
- 無料枠は iLove 系の約1.2倍目安。3倍案は撤回。

### AIBOUX Biz

- URL: `https://biz.aiboux.com`
- 役割: ビジネス文書、テンプレート、Webエディタ、履歴保存。
- UI: Astro 6 + Starwind UI。
- TemplateBank / bizocean を参考にするが、文言・本文・UIコピーは禁止。

### Aiboux Office

- URL: `https://office.aiboux.com`
- 役割: アプリ不要、サーバー送信なし、ブラウザだけでOffice/PDF/CSVを軽く編集するミニマルOfficeツール。
- UI: Astro 6 + Starwind UI + React Islands。黄色CTA、黒文字。
- 対応予定: CSV、XLSX、XLSM、DOCX、PPTX、PDF。
- 最重要原則: ファイル本体をサーバーへ送信しない。
- AdSense: TOP配置、30秒後に一度だけ非モーダルのフローティング枠。ポリシー順守必須。

### AIBOUX 履歴書

- URL: `https://rirekisho.aiboux.com`
- 役割: 履歴書、職務経歴書、退職届、送付状、チェックリスト、求人票解析、AI自己PR、証明写真作成。
- UI: Astro 6 + Starwind UI。薄めグリーンCTA。
- 左上: `aiboux 履歴書`
- 英字 `RIREKISHO` badgeは禁止。
- 原則フル機能無料。無料会員登録で保存・再編集・再DL・AI/写真機能を開放する方針。

### AIBOUX Docs

- URL: `https://docs.aiboux.com`
- 役割: AIBOUX全体のヘルプ・操作ガイド。
- `doc.aiboux.com` ではない。
- 左ツリーナビ、中央Markdown本文、右目次、上部検索を想定。

## Global Development Workflow

User trigger rule: if the user says AIBOUX development is starting/continuing (`AIBOUXの開発をやる`, `AIBOUXを進める`, `AIBOUX実装`, or similar), first read the handoff/spec documents. Do not start from memory alone.

1. `AGENTS.md` を読む。
2. `docs/AIBOUX_MASTER_SPEC.md` を読む。
3. `docs/AIBOUX_SERVICE_MAP.md` を読む。
4. 対象サービス仕様書を読む。
5. Astro / Starwind / shadcn / Cloudflare / AdSense 等の公式ドキュメントを確認する。
6. 実装計画を出す。
7. 実装する。
8. build/check/lint を実行する。
9. Playwright等で desktop / tablet / mobile を確認する。
10. 変更内容と未完了を報告する。
11. 作業終了時に仕様変更・URL変更・Cloudflare設定変更・UI方針変更・データ/API/AI方針変更の有無を確認し、必要なら docs を更新する。
