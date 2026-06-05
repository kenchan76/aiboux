# Storefront Carousel Smoothness WIP

Timestamp: 2026-06-05T05:01:50Z

Status: `LOCAL_WIP_PUBLIC_DEPLOY_BLOCKED`

## Scope

- Target URL after deploy: `https://shop.aiboux.com/s/aiboux/`
- Target component: `src/components/shop/storefront/ShadcnStorefront.tsx`
- Active instruction: `ops/instructions/current.md`

## Changes

- Aligned hero carousel CSS and JavaScript transition duration to `560ms`.
- Added image preload for configured hero slides.
- Added GPU-friendly track rendering hints.
- Changed carousel movement completion from fixed-time-only to `transitionend` plus timeout fallback.

## Reason

The user rejected the carousel as still feeling choppy. This WIP directly targets the visible slider motion rather than adding SEO panels, logs, gates, or explanatory UI.

## Verification Plan

- `npm run check:control-chars`: PASS.
- `npm run check:mojibake`: PASS.
- `npm run astro -- check`: PASS with 0 errors.
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS.

Public verification remains pending until Wrangler authentication is restored and the WIP is deployed.

## Blocked

- WIP deploy and public `/g/*` publication are blocked because Wrangler is not authenticated in the current shell.
- Subscription remote D1 migration remains `D1_PERMISSION_BLOCKED_NOT_FINAL`.
