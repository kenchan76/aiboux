# Delivery Detail Design v5 Image-To-Code Review Placeholder

## Status

REFERENCE_OPTIONAL

## Current State

No installed `imagegen-frontend-web` or `image-to-code-skill` local skill was found.

## Fallback Review Basis

- Public preview screenshot: `output/playwright/core-documents-redesign/delivery-detail-design-v5-public.png`
- Viewport screenshots:
  - `output/playwright/core-documents-redesign/delivery-detail-design-v5-1980.png`
  - `output/playwright/core-documents-redesign/delivery-detail-design-v5-1650.png`
  - `output/playwright/core-documents-redesign/delivery-detail-design-v5-1440.png`
  - `output/playwright/core-documents-redesign/delivery-detail-design-v5-1366.png`

## Layout Requirements

- Header actions and save button must not clip.
- Summary strip must stay compact.
- Delivery lines must start high enough to show useful rows.
- Footer must not overlap rows.
- Page horizontal overflow must be <= 2px.

## What Must Not Change

- AIBOUX Core business density.
- White background and thin borders.
- shadcn/ui component consistency.
- Public preview validation as main gate.
