# Shop Public Admin Demo Value Recheck

## Status

WIP_FIXING

## Public URL Bundle

- Execution log URL: `https://mail.aiboux.com/g/l68`
- Screen evidence URL: `https://mail.aiboux.com/g/d68`
- Master URL: `https://mail.aiboux.com/g/m68`

## User Rejection

The user reports that public `https://shop.aiboux.com/s/aiboux/admin` still shows fixed demo values.

The reported visible values are:

- `2024/05/13 - 2024/05/19`
- `山田 太郎 管理者`
- `¥2,340,000`
- `245件`
- `2.35%`
- `¥9,551`
- `28.7%`
- `TSH-001-WHT`
- `BAG-001-BLK`
- `BTL-500-SLV`
- `#10085`
- `#10084`
- `#10083`
- `佐藤 花子`
- `鈴木 一郎`
- `田中 美咲`

## Required Response

Do not proceed to product/settings/cart work until public admin fixed demo value checks pass.

Verify the public URL directly:

- `https://shop.aiboux.com/s/aiboux/admin`

Use both:

- `curl` public HTML checks
- Playwright public rendered DOM checks

Do not use localhost, preview-only URLs, or alternate routes as proof.

## Fix Scope

- Remove Shop-related fixed demo values from production-visible code and delayed UI candidates.
- Keep Core and Mail sample data out of scope unless it is rendered on Shop public admin.
- Do not redesign UI.
- Do not make broad CSS/layout changes.

## Completion Evidence For This Cycle

- Public admin HTML grep returns zero matches for the reported values.
- Public admin Playwright rendered text and HTML return zero matches for the reported values, except unrelated hidden examples explicitly logged if any.
- `/g/l68` and `/g/d68` are updated and publicly curl-verified before user report.
- Worker Version ID is recorded.

## Safety

- No DB write.
- No migration apply.
- No Bark.
- No reset.
- No clean.
- No force push.
- No secret output.
