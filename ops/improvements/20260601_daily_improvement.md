# 2026-06-01 Daily Improvement

## Topic

AIBOUX Core書類管理AI構想の仕様化前に、公式一次情報を確認した。

## Improvement

AIモデル名と価格をコードや恒久仕様へ直書きしない運用を強化する。
Gemini Flash系を第一採用にする場合でも、実モデルIDは環境変数で差し替える。

## Practical Rule Added

- `AIBOUX_AI_PROVIDER`
- `AIBOUX_AI_MODEL_FAST`
- `AIBOUX_AI_MODEL_STRONG`
- `AIBOUX_AI_MODEL_FALLBACK`

価格は2026-06-01時点の確認メモとして扱い、実装値にはしない。
Document AI、Mistral OCR、Azure Document Intelligence、AWS Textractは初期実装に入れず、比較候補として記録する。

## Sources Checked

- Gemini API document processing
- Gemini API structured output
- Gemini API pricing
- Google Document AI processor list
- Mistral pricing
- Azure Document Intelligence overview
- AWS Textract AnalyzeExpense
- Astro endpoints
- Cloudflare R2
- Cloudflare Images Transformations
- LINE Messaging API webhook
- PDF.js
