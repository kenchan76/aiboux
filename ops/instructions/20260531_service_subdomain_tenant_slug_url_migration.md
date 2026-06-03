# AIBOUX Service Subdomain Tenant URL Migration

## Status

DEPLOYED

## Source Of Truth

- `AIBOUX_MASTER_DOCUMENT.md`
- User instruction received on 2026-05-31 JST

## Confirmed Decisions

- `aiboux.com` is the AIBOUX series service introduction site.
- `{service}.aiboux.com/` is each AIBOUX service site.
- `{service}.aiboux.com/s/{tenant}/` is the tenant URL.
- `shop.aiboux.com/s/{tenant}/` is a shop storefront.
- `shop.aiboux.com/s/{tenant}/admin` is the shop admin screen.
- Custom domains map internally to the corresponding shop storefront tenant URL.
- The deployment tenant slug for this task is `aiboux`.
- The current `mail.aiboux.com/` tenant screen is a Mail tenant management/work screen and must move to `mail.aiboux.com/s/aiboux/`.
- URL resolution must be tenantized without deleting, duplicating, or recreating tenant, shop, mailbox, or user data.

## Required URL Design

```text
mail.aiboux.com/
  => Mail service site

mail.aiboux.com/s/aiboux/
  => existing Mail tenant management/work screen currently exposed at mail.aiboux.com/

shop.aiboux.com/
  => AIBOUX SHOP service site or existing Shop management/service entrance

shop.aiboux.com/s/aiboux/
  => AIBOUX SHOP storefront

shop.aiboux.com/s/aiboux/admin
  => AIBOUX SHOP admin screen
```

## Classification Rules

Management/work screens:

- dashboard
- orders
- products
- inventory
- customers
- settings
- administrators
- mailbox
- inbox
- template management
- business links
- AI Assistant
- authenticated CRUD screens

Storefront screens:

- product listing
- product detail
- cart
- checkout
- collections
- public pages
- legal/shipping/returns/contact pages
- customer purchase funnel

## Implementation Requirements

- Do not leave `mail.aiboux.com/` as a tenant management screen.
- Do not make `shop.aiboux.com/` the direct storefront tenant URL.
- Do not make `aiboux.com` a tenant URL.
- Do not publish management data as storefront data.
- Do not migrate or recreate data IDs.
- Replace tenant route assumptions from `/t/:tenantSlug/*` to `/s/:tenantSlug/*` if present.
- Fix any `LandingOrRedirect` or `TenantApp` logic that redirects or slices route state using `/t/`.
- Preserve existing tenant data and only change URL resolution/routing.

## Acceptance Checks

- `GET https://mail.aiboux.com/` returns a Mail service site.
- `GET https://mail.aiboux.com/s/aiboux/` returns the existing Mail tenant screen.
- `GET https://shop.aiboux.com/` returns AIBOUX SHOP service site or Shop management/service entrance.
- `GET https://shop.aiboux.com/s/aiboux/` returns AIBOUX SHOP storefront.
- `GET https://shop.aiboux.com/s/aiboux/admin` returns AIBOUX SHOP admin screen.
- Custom domain storefront routing remains compatible with the corresponding tenant storefront.
- Local checks pass: control-character check, mojibake check, Astro check, build.
- Public preview or production verification must include HTTP status, CSS/JS asset status, and Playwright evidence before PREVIEW_READY or DEPLOYED is reported.

## Reporting Requirements

- Report using progressive status only: CODE_READY, PREVIEW_READY, DEPLOYED, FINAL_ACCEPTED, USER_ACTION_REQUIRED, BLOCKED, BLOCKED_PREVIEW, BLOCKED_AGENT_COMPLIANCE.
- User-facing implementation report must be generated through `scripts/render-aiboux-report.mjs`.
- User-facing report must include a short URL bundle for master update, execution log, and screen/artifact preview when reporting CODE_READY, PREVIEW_READY, DEPLOYED, or FINAL_ACCEPTED.
- Do not expose secrets or long URLs in chat.

## Current Blocker

External verification failed again after the previous DEPLOYED report. FINAL_ACCEPTED is forbidden.

## External Verification Failure

- `/g/m68`, `/g/l68`, and `/g/d68` were reported as Cache miss externally.
- `mail.aiboux.com/` was reported externally as still returning the old Mail tenant screen.
- `mail.aiboux.com/s/aiboux/`, `shop.aiboux.com/`, `shop.aiboux.com/s/aiboux/`, and `shop.aiboux.com/s/aiboux/admin` were reported externally as Cache miss.
- Continue by moving `/g` evidence to persistent static artifacts, enforcing host routing at Worker entry, redeploying, and rerunning public verification.

## External Verification Failure 2

- External verifier still reports `Cache miss` for `/g/m68`, `/g/l68`, `/g/d68`.
- External verifier still reports `Cache miss` for `mail.aiboux.com/s/aiboux/`, `shop.aiboux.com/`, `shop.aiboux.com/s/aiboux/`, and `shop.aiboux.com/s/aiboux/admin`.
- External verifier still reports `mail.aiboux.com/` as the old Mail tenant work screen.
- Required method change: capture the exact requested curl evidence into `all_log`, inspect Cloudflare cache / Worker route / response headers / propagation, and do not rely on previous local PASS alone.

## Repair Result

- `/g/m68`, `/g/l68`, and `/g/d68` are persistent static artifacts under `public/g/*.md` and are served at Worker entry.
- `mail.aiboux.com` and `shop.aiboux.com` host routing is enforced at Worker entry before Astro handling.
- Public verification passed after redeploy. FINAL_ACCEPTED is not claimed until final acceptance gates are satisfied.
- Final curl evidence is saved at `all_log/68_final_external_curl_acceptance.txt`.
- Final curl summary is saved at `all_log/72_final_external_curl_acceptance_summary.txt`.
- Worker entry routing headers now expose `x-aiboux-route-source`, `x-aiboux-rewritten-path`, and `x-aiboux-worker-version` for service host routes.

## Public Verification Result

- `https://mail.aiboux.com/`: PASS, HTTP 200, Mail service site.
- `https://mail.aiboux.com/s/aiboux/`: PASS, HTTP 200, existing Mail tenant inbox/work screen.
- `https://shop.aiboux.com/`: PASS, HTTP 200, AIBOUX SHOP service site.
- `https://shop.aiboux.com/s/aiboux/`: PASS, HTTP 200, Shop storefront.
- `https://shop.aiboux.com/s/aiboux/admin`: PASS, HTTP 200, Shop admin screen.
- `tests/service-url-routing-public.spec.ts`: PASS, 20/20 public Playwright checks.
- Current Worker Version ID: `f8867df3-aab9-439b-bf8d-634ada05191d`.
