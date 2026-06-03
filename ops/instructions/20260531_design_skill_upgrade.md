# AIBOUX Codex Design Skill Upgrade

作成日: 2026-05-31

## 目的

Codexに、公開プレビューで成立するUI実装力と、業務UIとしての審美眼を強制する。

## 導入する運用

- Impeccable系の critique / polish / audit は補助レビューとして扱う。
- Taste Skill系の imagegen / image-to-code は、画像参照を仕様化する補助として扱う。
- Frontend App Builder系は、導入できる場合のみ初期モックや構造再設計に使う。
- 主判定はPlaywright、公開プレビュー、CSS/JS asset、スクリーンショット、design gateで行う。

## ローカル導入可否

- `impeccable` CLI: not found
- `imagegen-frontend-web`: not found
- `image-to-code-skill`: not found
- `Frontend App Builder / Build Web Apps`: not found as local skill
- AIBOUX fallback: `aiboux-design-review` skill + `aiboux-imagegen` + Playwright visual checks

## Required Directories

- `.agents/skills/`
- `ops/instructions/`
- `ops/improvements/`
- `ops/design/`
- `ops/design/references/`
- `ops/design/reviews/`
- `output/imagegen/`
- `output/playwright/`

## Done When

- `PRODUCT.md` exists.
- `DESIGN.md` exists.
- `.agents/skills/aiboux-design-review/SKILL.md` exists.
- `scripts/aiboux-design-gate.mjs` exists.
- `package.json` has `gate:design`.
- `gate:code` and `gate:preview` include design gate checks.
- AIBOUX operation docs mention design skill usage.
- `check:control-chars` PASS.
- `check:mojibake` PASS.
- `gate:design` PASS for the current public preview.

## Forbidden

- Treating any design skill output as completion proof.
- Treating AI review as the main gate.
- Reporting without public preview.
- Reporting without 3URL Bundle.
- Using generated images as implementation proof.
- Skipping Playwright visual checks.
