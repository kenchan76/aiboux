# AIBOUX Production Deployment Rule Update Final Log

作成日: 2026-05-30

## 実装概要

- `AIBOUX_MASTER_DOCUMENT.md` に Production Deployment Rule を追加した。
- 通常のコード/UI/API修正は、必要な検証を通過した場合、追加の人間承認なしで `npx wrangler deploy --keep-vars` を実行してよい運用へ変更した。
- `AGENTS.md` の最小ルールから、通常デプロイを人間承認必須に読める記述を削除し、高リスク操作のみ人間承認必須と明確化した。
- `AIBOUX_MASTER_DOCUMENT.md` 内の旧文言を更新し、通常デプロイと高リスク操作の承認境界を分離した。
- `AGENT_RULES.md` は、デプロイ承認必須の直接記述がなく、Completion Report Rule の参照先として整合しているため変更しなかった。

## 新しい通常デプロイルール

- 通常のコード/UI/API修正は、検証通過後に追加承認なしで本番デプロイ可能。
- 通常デプロイコマンドは `npx wrangler deploy --keep-vars`。
- 検証省略は不可。検証通過後の追加承認待ちだけを不要にする。

## 通常デプロイ前の検証

- `npm run astro check`
- `npm run build` または `ESBUILD_WORKER_THREADS=0 npm run build`
- 対象機能のPlaywright確認
- 必要に応じたGrok Buildレビュー
- 必要に応じたCloudflare AI監査
- 主要公開URLのHTTP 200確認
- UI変更では1980x1080スクリーンショット保存

## 引き続き人間承認必須

- `git push`
- 破壊的DB migration
- D1テーブル/本番データの削除
- `rm -rf` などの破壊的ファイル削除
- 秘密情報、APIキー、token、`.env`、`.dev.vars` の表示・転送
- メール実送信
- FAX実送信
- SNS実投稿
- 価格変更
- 課金状態変更
- 外部マーケットプレイスへの実公開
- 顧客データ、メール本文、ファイル本文、個人情報の外部送信
- 法務・料金・契約・返金など高リスク仕様の確定
- ユーザーが明示的に「デプロイしないで」と言った作業

## 変更ファイル

- `AIBOUX_MASTER_DOCUMENT.md`
- `AGENTS.md`
- `all_log/48_production_deployment_rule_update_final_log.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`

## 検証結果

- `npm run astro check`: 0 errors, 0 warnings, 27 hints
- `ESBUILD_WORKER_THREADS=0 npm run build`: success
- `npx wrangler deploy --keep-vars`: success
- Worker Version ID: `4e09c217-000a-427f-a30d-c04d8a6038b4`

## 共有URL

- 24時間URL: `https://core.aiboux.com/api/temp/log/production-deployment-rule-update-final-20260530?token=7c27ec1862ad3d8443b6b2272a9d35e46a05560dfe342a41`
- 短縮URL: `https://core.aiboux.com/g/deployrule`

## 引継ぎ

- 今後のAIBOUX通常開発では、必要な検証が通ったら追加承認なしで本番デプロイしてよい。
- 高リスク操作は従来どおり人間承認必須。
- 完了時は Worker Version ID、公開URL確認、24時間URL、短縮URLを報告する。
