# Codex Image Generation URL Policy Log

Date: 2026-05-30

## Purpose

Add an AIBOUX operating rule that image-gen / `$imagegen` outputs must be user-visible through temporary URLs, not only saved locally.

## Rule Added

- Generated or edited images must be saved under `output/imagegen/`.
- Each generated or edited image must have a temporary 24-hour URL.
- A `/g/...` short URL should be issued when possible.
- Completion reports must include:
  - generated image name;
  - local path;
  - temporary URL;
  - short URL;
  - expiry;
  - source instruction.
- Missing image URL means the image-gen task is not complete.
- Generated images are reference artifacts only and are not implementation proof.
- Implementation acceptance still requires Playwright real-screen screenshots, Grok review when needed, Cloudflare AI audit when needed, and Hermes audit when needed.

## Implementation

- Added AIBOUX image-gen skill:
  - `.agents/skills/aiboux-imagegen/SKILL.md`
- Added temporary image share registry:
  - `src/lib/server/tempImageShares.ts`
- Added temporary image API:
  - `src/pages/api/temp/image/[id].ts`
- Extended `/g/...` route to support image share IDs:
  - `src/pages/g/[id].ts`
- Created image output directories:
  - `output/imagegen/`
  - `public/temp/imagegen/`
- Updated operating rules:
  - `AGENTS.md`
  - `AIBOUX_MASTER_DOCUMENT.md`
  - `/home/pkkatsu/aiboux-vault/checklists/instruction-compliance.md`

## Security Behavior

- Token mismatch: 404.
- Expired share: 410.
- Headers:
  - `cache-control: no-store, max-age=0`
  - `x-robots-tag: noindex, nofollow, noarchive`
  - `x-content-type-options: nosniff`

## Notes

- No new image was generated during this task.
- The new registry is empty until the next image-gen task creates concrete image entries.
- Future generated images should be copied from `output/imagegen/` to `public/temp/imagegen/` with a non-guessable filename for serving through the tokenized API.
- Generated images remain reference artifacts only; implementation proof requires Playwright real-screen screenshots and required audits.

## Verification

- `npm run astro check`: PASS in the current delivery-detail correction run, with existing hints only.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS in the current delivery-detail correction run.
- Temporary image API negative checks: pending until a concrete image share is registered.

## Deployment

- Deploy command after verification:
  - `npx wrangler deploy --keep-vars`
- Worker Version ID: pending because Cloudflare authentication is currently invalid.

## Temporary URLs

- 24-hour log URL:
  - `https://core.aiboux.com/api/temp/log/codex-imagegen-url-policy-20260530?token=cb4acdc53aac05aebdb489f7803149074372f58945206849`
- Short URL:
  - `https://core.aiboux.com/g/imgpolicy`
