**PASS**

- 配送情報 card (delivery-create.png + DocumentEntryForm.tsx:538-605): exactly 配送業者/サービス種別/お問い合わせ番号/納品日/配送希望時間帯 (5 fields); 配送備考 absent (0 per DOM audit + screenshot); matches criteria.
- 備考・メモ card present below lines (delivery-create.png + code:816-836): contains 社外向け文面 + 納品時メモ; 納品時メモ value = exact "搬入口は西側です。置き配不可。納品日指定あり。" (hardcoded default for delivery).
- B2 CSV + 飛伝CSV: only for delivery (config:119 csvActions, header render 255-260, CoreShell detail 801-812, audit deliveryMemo/b2/hiden=1 only for deliveries create; 0 for others).
- Layout: top 3-card grid (code:404, compact minmax cols) dense/no large blanks; 明細一覧 starts immediately below with normal spacing (visual match to reference-create.png height/positioning; no stretch/push-down in delivery-create.png). 

All 5 criteria satisfied in specified public screenshots + code. (Reference image itself shows 配送備考 in shipping card, but criteria + actual override.)
GROK_EXIT:0
