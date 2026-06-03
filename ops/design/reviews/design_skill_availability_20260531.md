# Design Skill Availability 2026-05-31

## Result

- `impeccable` CLI: not found in PATH.
- `imagegen-frontend-web`: not found as an installed local skill.
- `image-to-code-skill`: not found as an installed local skill.
- `brandkit`: not found as an installed local skill.
- `Frontend App Builder / Build Web Apps`: not found as an installed local skill.

## AIBOUX Fallback

Use:
- `.agents/skills/aiboux-design-review/SKILL.md`
- `.agents/skills/aiboux-imagegen/SKILL.md`
- `scripts/aiboux-design-gate.mjs`
- Playwright visual checks
- public preview validation

## Rule

External or generated design assistance is advisory only. AIBOUX UI acceptance requires public preview, CSS/JS asset checks, Playwright visual checks, design gate, no mojibake, no control characters, and 3URL Bundle.
