---
name: aiboux-imagegen
description: AIBOUX UI reference image generation and sharing workflow for Codex image-gen usage.
---

# AIBOUX Image-gen Workflow

Use this skill when Codex generates or edits raster images for AIBOUX UI planning, UI reference images, edited mock images, product mockups, or other bitmap artifacts.

## Role

Generated images are reference artifacts only. They do not prove implementation completion.

Implementation acceptance still requires:
- Playwright real-screen screenshots;
- Grok review when visual fidelity is required;
- Cloudflare AI audit when DOM/API/spec consistency is required;
- Hermes audit when required by the task;
- public URL verification after deployment;
- Worker Version ID recording after deployment.

## AIBOUX Visual Rules

- Light mode only.
- White background.
- Thin borders.
- High-density business UI.
- Core/Mail/Shop use shadcn/ui direction.
- Starwind areas keep their established Starwind direction.
- Preserve the current left sidebar unless the user explicitly requests otherwise.
- Use 1980x1080 as the primary UI reference viewport unless another size is specified.

## Save And Share Requirements

Every image generated or edited with image-gen / `$imagegen` for AIBOUX must:
- be saved under `output/imagegen/`;
- be copied to `public/temp/imagegen/` with a non-guessable serving filename when it needs to be shared;
- be registered in `src/lib/server/tempImageShares.ts`;
- be available through a tokenized 24-hour URL under `/api/temp/image/[id]`;
- have a `/g/...` short URL when possible via `src/pages/g/[id].ts`;
- be reported with image name, local path, temporary URL, short URL, expiry, and source instruction.

Local-only image generation is not complete.

## URL Requirements

Temporary image URLs must:
- expire within 24 hours;
- require a hard-to-guess token;
- return 404 for missing or incorrect token;
- return 410 after expiry;
- use `cache-control: no-store`;
- use `x-robots-tag: noindex, nofollow, noarchive`;
- use `x-content-type-options: nosniff`.

## Required Report Fields

When image-gen is used, final reporting must include:
- generated image name;
- local saved path under `output/imagegen/`;
- tokenized 24-hour image URL;
- `/g/...` short URL when available;
- expiry timestamp;
- source instruction or prompt summary;
- statement that the generated image is a reference artifact, not implementation proof.

## Hermes NG Conditions

Hermes must mark NG when:
- image-gen was used but no URL was presented;
- generated image path exists but the temporary URL is missing;
- temporary image URL is non-200 before expiry;
- claimed `/g/...` image short URL is not working;
- generated image is used as implementation proof without Playwright real-screen evidence;
- image-gen output is left only under the Codex home directory or another non-project path.

## Completion Rule

Do not claim image-gen work complete until the image is saved, shared, and reported with working URLs. Do not claim implementation complete from generated images alone.
