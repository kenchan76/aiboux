# AIBOUX Shop Design Editor Persistence And Stop Notification

## Public URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## User Instruction

Continue the AIBOUX Shop work instead of stopping after the fullscreen design editor WIP deploy.
When a Codex work unit pauses or stops, publish the URL Bundle and send/attempt progress notification.

## Current Target

Continue from the fullscreen store design editor repair.

The next concrete target is persistence verification:

1. The design editor must save layout changes to `shop_storefront_layouts`.
2. Saved TOP page hero settings must reflect on `https://shop.aiboux.com/s/aiboux/`.
3. Saved settings must survive reload.
4. Test changes must not leave permanent unwanted test text in the public storefront.
5. The test must restore the original layout after verification.

## Notification Rule For This Task

If this work unit stops, pauses, blocks, or reports WIP, Codex must:

1. update `public/g/l68.md`;
2. update `public/g/d68.md`;
3. deploy the updated `/g/*`;
4. curl-verify the three public URLs;
5. attempt a progress Bark notification if Bark is configured, without printing secrets;
6. report the notification result as secret-safe evidence.

If Bark is disabled or unavailable, log the secret-safe reason and do not fake delivery.

## Non-Negotiable Safety

- Do not use `git reset --hard`.
- Do not use `git clean -fd`.
- Do not use `git clean -fdx`.
- Do not use `rm -rf`.
- Do not print secrets.
- Do not force push.
- Do not change `shop.aiboux.com/` into tenant storefront.
- Do not expose any page editor targets except `TOPページ` and `商品詳細ページ`.

## Implementation Plan

1. Add a public Playwright persistence test for the store design editor.
2. The test must snapshot the current layout with `GET /shop/api/storefront/layout`.
3. The test must edit the hero title through the public design editor UI.
4. The test must click the visible `保存` button and wait for `POST /shop/api/storefront/layout`.
5. The test must open `https://shop.aiboux.com/s/aiboux/?layoutVerify=<timestamp>` and confirm the changed title appears.
6. The test must reload or revisit the public storefront and confirm persistence.
7. The test must restore the original layout through `POST /shop/api/storefront/layout` in `finally`.
8. After restore, the test must verify the temporary marker is not left on the public storefront.

## Required Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- `PLAYWRIGHT_BASE_URL=https://shop.aiboux.com npx playwright test tests/shop-functional-public.spec.ts`
- WIP deploy with checkpoint
- public `/g/m68`, `/g/l68`, `/g/d68` curl verification

## Status

WIP_CONTINUING_AFTER_USER_RESTART
