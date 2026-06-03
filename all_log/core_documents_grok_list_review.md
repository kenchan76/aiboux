**PASS**

All 6 list screenshots (estimate, order, delivery, invoice, payment, purchase-order at 1980x1080) + code/config + audit summary pass visual + structural acceptance.

- Light/white dense shadcn UI with thin borders, left CORE sidebar + active nav, full-width tables present in all.
- No breadcrumbs ("Core / ..."), no page descriptions under h1, no in-list search duplication, no persistent right detail panel (detail replaces list on row click).
- Exactly 4 KPI icon cards with required labels (今月の件数 / 今月の下書き / 今月の発行済 / 今月の対象金額); "表示期間 2026年5月", "すべての状態", "すべての担当者", "詳細フィルタ", "CSV出力", "一括送付を準備" + "選択 n件" count + blue create button on title row right (no カスタマイズ).
- Checkbox selection (select-all + per-row), visible count, enabled "一括送付を準備" (external send is prep-only with approval toasts) implemented and visible.
- Per-type columns semantically correct and leak-free (estimate: 提出先/見積日; order: 納入先/注文日; delivery: 納品先/納品日; invoice: 請求先/請求日; payment: 対象請求書/入金日; purchase-order: 仕入先/納入先/入荷予定日). Matches coreDocumentUiConfig.ts + CoreDataTable.tsx + CoreShell.tsx:600.
- Reference visual match (updated for required bulk/checkbox per audit note); no forbidden elements.

Minor non-blocking: KPI cards omit parenthetical date present in reference (date lives on 表示期間 button; criteria + latest intent satisfied). No other defects.
GROK_EXIT:0
