# Shop Aiboux Production Tenant Implementation With UI Protection

## Status

BLOCKED_METHOD

## Fixed URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Bundle Verification

Verified by `curl -L` and `sha256sum` on 2026-06-04.

| URL | HTTP | Content-Type | Bytes | SHA256 |
| --- | --- | --- | ---: | --- |
| `https://mail.aiboux.com/g/m68` | 200 | `text/markdown; charset=utf-8` | 107956 | `40271335edd5cafa552d86730bd244f92de5e4e23d5b53501403d30764b78e44` |
| `https://mail.aiboux.com/g/l68` | 200 | `text/markdown; charset=utf-8` | 7549 | `54a013a887f2c785e2b4bb8ced478000dbe447a32a29661735d9266c3db2b9d0` |
| `https://mail.aiboux.com/g/d68` | 200 | `text/markdown; charset=utf-8` | 2488 | `5f457be0464098ed143408bfb7543d775b77e4cc8c1c222a11efcff876c823a2` |

## Purpose

Use this bundle as the evidence destination for AIBOUX Shop販売用テナント改善作業.

This bundle is not final acceptance evidence yet.
It is the source evidence bundle to be updated only after implementation, verification, deploy, public curl checks, Worker Version ID recording, and zero unresolved items.

## UI Risk Control

The previous implementation degraded the UI.
Therefore, no implementation may proceed as a broad rewrite.

Mandatory protection:

- `scripts/check-shop-ui-protection.mjs` must remain active.
- `npm run deploy`, `npm run deploy:preview`, and `npm run deploy:prod` must run Shop UI protection before deployment.
- `npm run gate:deploy` and `npm run gate:aiboux` must include Shop UI protection.
- Protected Shop UI changes require explicit user approval and visual evidence log.
- Direct `wrangler deploy` bypass is prohibited.

## Protected Paths

- `src/pages/shop`
- `src/components/shop`
- `src/data/shop-sample-data.ts`
- `src/styles`
- `src/assets`

## Required Implementation Target

- `https://shop.aiboux.com/`: service site.
- `https://shop.aiboux.com/s/aiboux/`: storefront.
- `https://shop.aiboux.com/s/aiboux/admin`: admin.

## Required Completion Evidence

- commit hash
- Worker Version ID
- deploy timestamp
- migration names and results
- changed file list
- all admin URLs HTTP 200
- all storefront URLs HTTP 200
- Playwright result
- product create/edit/list/storefront reflection
- settings save/public page reflection
- cart add/quantity/delete/checkout transition
- contact form verification
- legal/privacy/shipping/returns settings reflection
- dead link zero
- `href="#"` zero
- old route leakage zero
- `shop.aboux.com` zero
- sample fixed values zero
- unresolved items zero

## Current State

The bundle is reachable.
The task is not complete.
The local Shop UI protection blocks deploy while protected Shop paths are dirty.
This is intentional.
