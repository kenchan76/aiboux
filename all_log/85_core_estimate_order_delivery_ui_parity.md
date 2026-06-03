# Core Estimate And Order Delivery UI Parity

## Status

CODE_READY

## Scope

- Targeted: 見積書一覧、見積書詳細、見積書作成、見積書編集
- Targeted: 注文書一覧、注文書詳細、注文書作成、注文書編集
- Reference: 納品書一覧、納品書詳細、納品書作成、納品書編集
- Explicitly not targeted: 請求書
- Deployment: not performed
- Bark: not sent

## Source Of Truth Read

- `AIBOUX_MASTER_DOCUMENT.md`
- `ops/instructions/current.md`
- `ops/instructions/20260601_core_estimate_purchase_order_delivery_ui_parity.md`

## Investigation

- The active document routing maps `/core/estimates` to `quote`, `/core/orders` to `order`, and `/core/deliveries` to `delivery`.
- The existing `/core/orders` screen is labelled `注文書`; `/core/purchase-orders` is labelled `発注書`.
- The requested `注文書` target was therefore treated as `/core/orders`, not `/core/purchase-orders`.
- Delivery note list/create/detail UI is implemented through shared Core document primitives:
  - `src/components/core/CoreShell.tsx`
  - `src/components/core/forms/DocumentEntryForm.tsx`
  - `src/components/core/CoreDataTable.tsx`
  - `src/lib/coreDocumentUiConfig.ts`
- Existing create UI already used the delivery note full-screen Sheet structure for document types. The missing parity was detail/edit behavior from list context and edit initialization.

## Implementation

- Kept the list screen mounted when a document detail is opened.
- Added `DocumentDetailWorkspaceSheet` so detail opens in the same full-screen in-page Sheet/window style as the delivery note create workspace.
- Reused `DeliveryDocumentDetailWorkspace` for delivery, estimate, and order details with `documentUiConfig` labels.
- Added edit handoff from detail to `DocumentEntryForm` without route navigation.
- Added `initialDocument` support to `DocumentEntryForm` so edit mode uses the selected row's existing document number, customer, date, and status.
- Added list refresh key update after save so the list refetches/updates like the delivery note behavior.
- Changed non-delivery detail labels away from delivery-only text while preserving the same card grid, spacing, input height, footer, table, and action layout.

## CSS And Layout Parity

The delivery note UI remains the layout template. Estimate and order now reuse the same:

- list header layout
- list table component
- KPI row spacing
- create Sheet width/height/max-width
- create Sheet fixed header and fixed footer behavior
- create form grid, card, label, input, and line table classes
- detail Sheet width/height/max-width
- detail toolbar layout
- detail top-card grid
- detail line table layout
- detail footer summary bar
- action button size and placement

No new estimate-only or order-only CSS file was added.

## Navigation Check

Searched target implementation and test files for forbidden navigation patterns:

```text
rg -n "window\.location\.href|location\.reload|router\.push|Navigate" src/components/core/CoreShell.tsx src/components/core/forms/DocumentEntryForm.tsx tests/core-document-delivery-parity.spec.ts
```

Result: no matches.

## Invoice Non-Change Evidence

- No patch was applied to invoice-specific pages or invoice create content.
- `src/components/core/CoreShell.tsx` contains existing invoice branches, but this task did not modify the invoice-specific `InvoiceCreateContent`.
- Playwright loaded `/core/invoices` and verified the `請求書` list header and `請求書を作成` button still render.

## Screenshots

Playwright saved 1980x1080 evidence under:

```text
output/playwright/core-document-delivery-parity/
```

Generated screenshot set:

- `delivery-list-1980.png`
- `delivery-create-window-1980.png`
- `delivery-detail-window-1980.png`
- `delivery-edit-window-1980.png`
- `estimate-list-1980.png`
- `estimate-create-window-1980.png`
- `estimate-detail-window-1980.png`
- `estimate-edit-window-1980.png`
- `order-list-1980.png`
- `order-create-window-1980.png`
- `order-detail-window-1980.png`
- `order-edit-window-1980.png`

## Verification

```text
npm run astro check
Result: PASS, 0 errors, 34 hints

npx playwright test tests/core-document-delivery-parity.spec.ts
Result: PASS, 4 passed

npm run check:control-chars
Result: CONTROL_CHAR_CHECK_OK

npm run check:mojibake
Result: MOJIBAKE_CHECK_OK files=276

ESBUILD_WORKER_THREADS=0 npm run build
Result: PASS
```

`npm run gate:aiboux` initially failed only because the current task evidence did not include an actual Worker Version ID. This task did not deploy. The current production Worker Version ID was then checked and recorded for gate evidence.

```text
npm run gate:aiboux
Result: AIBOUX_GATE_PASS
```

```text
npm run gate:design
Result: AIBOUX_DESIGN_GATE_BLOCKED
Reason: stale public preview URL in all_log/preview_url.txt returned curl exit=6. Local screenshots and Playwright evidence were generated for this task, but no new public preview tunnel or deployment was created because this task explicitly avoids deploy/Bark.
```

## Worker Version Evidence

- Deployment action in this task: not deployed
- Actual current Worker Version ID: `756a7286-5335-42d7-b54b-d5d320d8bb9f`
- Command used: `npx wrangler versions list --name aiboux --json`
- Secret values were not printed.

## Remaining Items

- No production deploy was performed in this task.
- If PREVIEW_READY is required, issue a fresh public preview URL and rerun `npm run gate:design`.
