# Hermes-Gated Completion Rule Log

Date: 2026-05-30

## Purpose

The Hermes provider setup log recorded that Hermes did not perform direct computer-vision comparison itself. This is an important operating constraint.

For the current AIBOUX workflow, a Hermes PASS may be based on evidence reconciliation across:

- Playwright screenshot
- DOM audit
- Grok visual review
- Cloudflare AI audit
- final implementation log
- public URL HTTP confirmation

This is acceptable for the current audit purpose as long as the evidence basis is stated.

## Fixed Completion Conditions

Normal implementation completion now requires:

- `npm run astro check` pass
- `npm run build` or `ESBUILD_WORKER_THREADS=0 npm run build` pass
- required Playwright pass
- 1980x1080 screenshots for UI changes
- Grok PASS when visual fidelity review is required
- Cloudflare AI PASS when DOM/API/spec audit is required
- Hermes audit PASS
- public URL verification
- Worker Version ID recording
- `all_log/` update
- 24-hour URL and `/g/...` short URL

If Hermes reports NG, any Codex / Claude / development AI completion claim is invalid until the NG is resolved.

## Image Fidelity Rule

When a user requires strict visual fidelity such as "100% match", Hermes must treat Grok visual review as required evidence and must reconcile it with:

- the reference image requirement;
- the 1980x1080 Playwright screenshot;
- DOM audit evidence;
- Cloudflare AI audit evidence;
- public URL evidence;
- the completion log.

Grok timeout, Cloudflare AI timeout, Hermes timeout, or provider failure must not be treated as PASS.

## Updated Files

- `AIBOUX_MASTER_DOCUMENT.md`
- `AGENTS.md`
- `/home/pkkatsu/aiboux-vault/checklists/instruction-compliance.md`
- `all_log/51_hermes_gated_completion_rule_log.md`
- `src/lib/server/tempLogShares.ts`
- `src/pages/g/[id].ts`

## Notes

- Hermes remains an auditor, not an implementation agent.
- Hermes does not run deploy or git push.
- High-risk actions still require human approval.

## Verification

- `npm run astro check`: PASS, 0 errors, 0 warnings, 27 existing hints.
- Hermes audit: PASS. Hermes confirmed the fixed completion rule and the rule that Hermes NG invalidates completion claims.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS, existing Vite chunk-size warning only.
