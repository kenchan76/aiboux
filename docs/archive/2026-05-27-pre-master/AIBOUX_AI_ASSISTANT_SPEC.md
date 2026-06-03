# AIBOUX AI Assistant Spec

AIBOUX AI Assistant は単なるチャットではなく、業務作業を代行するAI秘書です。ただし安全性のため、原則 draft 作成までに制限します。

## Confirmed Decisions

- Core / Shop では右カラムAI Assistantを常設する。Mail は右下FABから開くフローティングAI Assistantを標準とする。
- Mail はDesktop/Tablet/Mobileすべてでデフォルト閉じた状態とし、開いたウィンドウはsafe-area内に収める。
- AIは原則 draft 作成まで。
- publish / delete / price change / marketplace listing / external send / email send / file delete は人間承認必須。
- Mailの音声操作でもAIは下書き作成まで。外部送信は右下承認UIの人間クリック後に限定する。
- Mailは新着メールの業務要約、期日・請求・注文シグナル、公私判定を音声/右カラムで扱う。
- Cloudflare Workers AI は `env.AI` binding で接続する。初期モデルは `WORKERS_AI_TEXT_MODEL=@cf/meta/llama-3.1-8b-instruct-fp8`。
- AI接続診断は `GET /api/ai/health` でbinding確認、`GET /api/ai/health?run=1` で実推論確認を行う。本番の実推論診断は `ADMIN_API_TOKEN` 必須。
- File MVPではAI補完を入れない。
- Officeはファイル本体をAIや外部APIへ無断送信しない。
- 履歴書は個人情報と顔写真を扱うため、AI処理には同意と削除導線が必須。

## Assumptions

- AI Assistantは各サービスの現在コンテキストを読み取り、候補提案・下書き・要約・抽出を行う。
- 操作ログ、信頼度、参照元、要確認項目を表示する。
- Gemini等の外部AIを使う場合は、送信データ範囲を明示する。

## TBD

- 商用APIフォールバック条件。
- Mail公私判定、音声要約、音声返信整形にWorkers AIをどこまで使うか。決定的ガードレールはfallbackとして残す。
- 履歴書の求人票解析とAI自己PRの保存期間。
- OfficeでAI補完を将来入れるか。
- FileでAI補完を将来復活させるか。

## Do Not Invent

- AIが本番公開、削除、価格変更、外部送信を自動実行しない。
- AIが音声操作を理由にメールを自動送信しない。
- プライベート判定メールをCore候補、取引先候補、横断AI参照へ混ぜない。
- Officeファイル本文を無断でAIへ送らない。
- 履歴書本文、顔写真、求人票解析結果を無断で第三者提供しない。
- AIの出力を確定情報として扱わない。

## Common UI

- Header
- Current context
- Suggested actions
- Chat / log area
- Result card
- File dropzone
- Input composer
- Progress log

## Core AI Actions

- 未入金を分析
- 在庫不足を確認
- 請求書を作成
- 発注候補を提案
- CSVを取り込む
- 商品情報補完
- 価格改定案作成
- 得意先別卸価格プレビュー

## Mail AI Actions

- 返信文を作成
- 要約する
- 添付ファイルを整理
- 下書きを作成
- タスク化する
- 取引先情報に反映する候補を作る
- メールをテンプレート化
- 音声返信メモを補正する
- 音声読み上げ用に要点を短くまとめる
- ビジネス/プライベートを自動判定する
- プライベート判定メールを隔離する

## Shop AI Actions

- 売上を分析
- 注文を分析
- 商品を分析
- 顧客を分析
- 在庫を確認
- 発注候補を提案
- 商品説明を作成
- SEO説明文を作成
- 割引施策を提案
- 3大モール同期状況を確認

## Office AI Policy

- 初期対象はAIではなくブラウザ内Office/PDF/CSV編集。
- ファイル本体のサーバー送信なしが最重要。
- AI補完を将来追加する場合も、ユーザー同意、送信範囲明示、削除導線が必須。

## 履歴書 AI Policy

対応予定:

- 求人票スクショ解析
- AI自己PR作成
- 志望動機ヒント
- 証明写真関連処理

必須:

- 個人情報の扱いを明記。
- メルマガ同意と配信停止を明確にする。
- 顔写真や履歴書情報の外部送信は同意必須。

## Human Approval Required

| Action | Approval |
|---|---|
| publish | required |
| delete | required |
| price change | required |
| marketplace listing | required |
| external send | required |
| email send | required |
| file delete | required |
| subscription state change | required |
| AI-generated public listing | required |
