---
name: aiboux-design-review
description: Use this skill for every AIBOUX Core/Mail/Shop UI design task. It enforces high-density white business UI, public preview validation, visual screenshots, and no false CODE_READY.
---

# AIBOUX Design Review Skill

## Purpose

AIBOUX UI must be high-density, white, thin-border, practical business UI.

Do not generate generic SaaS cards.
Do not overuse padding.
Do not use dark mode for Core.
Do not use purple AI-looking gradients for Core.

## Required Visual Checks

For every Core UI design task, check:

- 1980x1080
- 1650x900
- 1440x900
- 1366x768

The UI fails if:

- action buttons are clipped;
- save button is not fully visible;
- table operation column is clipped;
- footer overlaps content;
- page horizontal overflow exists;
- public preview is unstyled;
- CSS/JS assets fail;
- summary section is too tall;
- fewer than the required visible rows appear;
- local-only screenshot is used as user evidence.

## Required URL Bundle

Every report must include:

1. Master update preview URL
2. Execution log preview URL
3. Screen preview URL

## Status Rules

Use:

- CODE_READY
- PREVIEW_READY
- DEPLOYED
- FINAL_ACCEPTED
- USER_ACTION_REQUIRED
- BLOCKED_DESIGN
- BLOCKED_PREVIEW
- BLOCKED_METHOD

Do not say COMPLETED unless FINAL_ACCEPTED.

## Design Process

1. Read `ops/instructions/current.md`.
2. Read `AIBOUX_MASTER_DOCUMENT.md` current overrides.
3. Use existing shadcn/ui components.
4. Use imagegen reference if available.
5. Implement.
6. Run Playwright visual checks.
7. Compare public screenshot against reference when reference exists.
8. Iterate until visual checks pass.

## Three Strike Rule

If the user rejects the UI three times, stop and change method.

Possible method changes:

- rebuild layout structure;
- use imagegen reference;
- use Impeccable critique if available;
- use screenshot comparison;
- use Chrome DevTools layout inspection;
- split component into smaller Storybook-like units.

## Evidence Rule

Generated images, external design critique, Grok, or Cloudflare AI are advisory only.

Acceptance requires:

- public preview URL;
- CSS/JS asset checks;
- Playwright visual checks;
- 1980/1650/1440/1366 screenshots;
- no mojibake;
- no control characters;
- 3URL Bundle.
