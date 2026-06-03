**PASS**

- All 6 actual 1980x1080 create screenshots (estimate/order/delivery/invoice/payment/purchase-order) satisfy every acceptance criterion vs reference + checklist.
- No A4プレビュー/ライブプレビュー/印刷時の配置を確認できます, no right preview pane, no right-bottom action area (actions exclusively in top header).
- Header: status dropdown + right actions exactly as specified (CSV only for delivery: B2/飛伝; all have メール送信/FAX送信/コピー/キャンセル/保存 blue).
- Top cards (basic/destination/third): compact/natural heights, grid `items-start` + no h-full/min-height on sections (DocumentEntryForm.tsx:404-645), no stretching/empty tall cards.
- No status field inside 基本情報 (only 帳票種別 + number + partner etc.).
- Wide line table (spans full below 3-col grid, 5 seeded rows, correct column header per type), pure amount summary as bottom footer (4-col 小計/消費税/合計/内消費税, no buttons).
- Per-type third cards exact per coreDocumentUiConfig.ts + screenshots: 提出先/管理情報, 納入先/注文情報, 納品先/配送情報, 請求先/支払情報, 入金元/消込情報, 納入先/発注情報.
- Code (DocumentEntryForm.tsx + config) + screenshots + audit forbidden/essentials all align; no mismatches or forbidden elements.
GROK_EXIT:0
