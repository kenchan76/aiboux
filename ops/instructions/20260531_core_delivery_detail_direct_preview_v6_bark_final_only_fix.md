# Core Delivery Detail Direct Preview v6 Bark Final-Only Fix

作成日: 2026-05-31

## Status

BLOCKED_PREVIEW

## Problem

- Previous m68/l68 evidence claimed direct preview was fixed.
- The user reported the screen preview still showed the delivery list instead of the delivery detail screen.
- PREVIEW_READY evidence must not rely on a hydration-time row click or list screen.
- Bark must not be sent for PREVIEW_READY.

## Required Direct URL

`/core/deliveries?preview=delivery-detail&document=N20260530-01`

The URL must directly display:
- `納品書詳細`
- `N20260530-01`
- `delivery-detail-toolbar`
- `delivery-detail-summary-strip`
- `delivery-detail-lines-card`
- footer
- save button

## Required 3URL Bundle

1. Master update preview URL
2. Execution log preview URL
3. Direct screen preview URL

## Required Tests

- direct detail URL: PASS
- public direct detail URL: PASS
- `check:control-chars`: PASS
- `check:mojibake`: PASS
- `check:bark-policy`: PASS
- public style check: PASS
- Playwright 1980/1650/1440/1366 screenshots: PASS

## Bark

- notification: not sent
- reason: Bark notifications are final-only by policy.
- secretLogged: false

## Forbidden

- list URL as screen preview
- intermediate page as screen preview
- Bark during PREVIEW_READY
- m68/l68 as valid evidence
- NUL/control characters
- mojibake
