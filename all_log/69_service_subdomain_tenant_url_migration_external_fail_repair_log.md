# Service Subdomain Tenant URL Migration External Fail Repair Log

## Status

BLOCKED_PREVIEW -> DEPLOYED

## External Failure Report

- `/g/m68`, `/g/l68`, and `/g/d68` were reported externally as Cache miss.
- `mail.aiboux.com/` was reported externally as still returning the old Mail tenant screen.
- Tenant and Shop acceptance URLs were reported externally as Cache miss.
- FINAL_ACCEPTED remains forbidden.

## Repair Strategy

- Move `/g/m68`, `/g/l68`, and `/g/d68` evidence from dynamic route registry dependence to static artifacts under `public/g/*.md`.
- Serve those artifacts explicitly at the Worker entry before Astro handling.
- Enforce `mail.aiboux.com` and `shop.aiboux.com` host routing at the Worker entry before Astro middleware fallback.
- Keep the existing Astro middleware as a secondary route layer.

## Verification Required

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run astro check`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `npx wrangler deploy`
- Public `/g/m68`, `/g/l68`, `/g/d68` fetch checks.
- Public acceptance URL fetch checks.
- Public Playwright routing checks.

## Repair Verification Result

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro check`: PASS, 0 errors, 0 warnings, 34 hints.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.
- `npx wrangler deploy`: PASS.
- `/g/m68`, `/g/l68`, `/g/d68`: PASS, HTTP 200, static artifact, UTF-8 Markdown, no cache miss body.
- Acceptance URLs: PASS, HTTP 200, no `Internal Error`, no `Cache miss` body.
- `mail.aiboux.com/`: PASS, Mail service site title and no old Mail tenant screen marker.
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/service-url-routing-public.spec.ts --reporter=line`: PASS, 20/20.
- FINAL_ACCEPTED remains not claimed.
