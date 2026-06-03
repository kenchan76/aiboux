# DESIGN.md

## AIBOUX Core Design Direction

- Light mode only.
- White base.
- Thin borders.
- High-density layout.
- shadcn/ui for Core/Mail/Shop.
- No arbitrary competitor copy.
- Core business UI must prioritize table density and form usability.
- Every visible area must survive 1980/1650/1440/1366 viewport checks.

## Business UI Rules

- Do not use generic SaaS card-heavy layouts for operational screens.
- Keep page sections dense, scannable, and work-focused.
- Preserve table readability before decorative spacing.
- Prefer compact toolbars over scattered action cards.
- Never hide clipping with `overflow-hidden` when the clipped content is required.
- Public preview must be styled and asset-complete before user verification.
