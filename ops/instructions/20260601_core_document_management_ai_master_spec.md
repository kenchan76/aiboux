# AIBOUX Core Document Management AI Master Spec

## Status

CODE_READY

## User Goal

AIBOUX Coreに「書類管理AI構想」をマスターへ詳細追記する。今回は実装ではなく、仕様設計として記録する。

## Scope

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`
- `ops/instructions/current.md`
- `all_log/85_core_document_management_ai_research_and_design.md`

## Fixed Design

- 第一採用AIはGemini Flash系。
- 初期実装はGemini Flash一本で開始する。
- Document AI、Mistral OCR、Azure Document Intelligence、AWS Textractは補助候補、比較候補として記録する。
- AIは候補を作る。
- AIBOUX Coreが人間レビュー、マスター照合、突合、確定、納品書作成、月末請求、仕訳候補、CSV/API連携を担当する。

## Prohibited Actions

- Bark送信禁止。
- deploy禁止。
- push禁止。
- reset/clean/force push禁止。
- secret/PAT/API key/token表示禁止。
- 既存マスターの履歴書、Docs、Mall、File、Biz、Office仕様を省略しない。
