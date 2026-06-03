# Core Delivery Detail Direct Preview v6

## Status

PREVIEW_READY

## Problem

Previous screen preview URLs displayed the delivery list or an intermediate page, not the delivery detail screen.

The user must be able to open the preview URL and immediately see:
- `納品書詳細`
- `N20260530-01`
- detail toolbar
- summary strip
- lines card
- footer
- save button

## Required Fix

Implement a direct detail preview URL:

`/core/deliveries?preview=delivery-detail&document=N20260530-01`

## Required Tests

- direct URL opens detail without user click
- public preview opens detail without user click
- save button not clipped
- no horizontal overflow
- CSS/JS assets loaded
- 1980/1650/1440/1366 screenshots

## Required 3URL Bundle

- Master update preview URL
- Execution log preview URL
- Direct screen preview URL

## Bark

- notification: not sent
- reason: Bark notifications are final-only by policy.
- secretLogged: false

## Done When

- PREVIEW_READY can be reported without Bark.
- `check:bark-policy` passes.
- direct screen preview URL opens delivery detail without a click.
