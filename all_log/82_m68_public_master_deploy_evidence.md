# M68 Public Master Deploy Evidence

## Captured

- Date: 2026-06-01 JST
- Scope: deploy updated public `/g/m68` master body
- Bark notification: not sent
- Delete/reset/clean/revert: not run
- Force push: not run
- Secret/PAT/API key output: not performed

## Initial State

- HEAD before deployment task: `0ddedfd7dc54896939580b20997fbb0a01820914`
- origin/main before deployment task: `0ddedfd7dc54896939580b20997fbb0a01820914`
- Previous public `/g/m68` result after source push: old m68 body
- Target public URL: `https://mail.aiboux.com/g/m68`

## Required Local M68 Keyword Check

Initial local keyword check found the source already contained most required terms, but exact required terms `AIBOUX_MASTER_DOCUMENT` and `絶対禁止事項` were missing. These exact terms were added to `public/g/m68.md` and `AIBOUX_MASTER_DOCUMENT.md` before build/deploy.

## Verification Results

Completed.

## Local Source Keyword Check

`public/g/m68.md` contains all required phrases:

```text
AIBOUX_MASTER_DOCUMENT: FOUND
Service Subdomain Tenant URL Migration: FOUND
Bark notification policy: FOUND
Worker Version ID: FOUND
f8867df3-aab9-439b-bf8d-634ada05191d: FOUND
dirty tree: FOUND
URL Bundle: FOUND
絶対禁止事項: FOUND
shop.aiboux.com/s/aiboux/admin: FOUND
mail.aiboux.com/s/aiboux/: FOUND
```

## Pre-Deploy Verification

```text
npm run check:control-chars: PASS, CONTROL_CHAR_CHECK_OK
npm run check:mojibake: PASS, MOJIBAKE_CHECK_OK files=258
npm run gate:aiboux: PASS, AIBOUX_GATE_PASS
ESBUILD_WORKER_THREADS=0 npm run build: PASS
```

The build output included the updated m68 asset:

```text
dist/client/g/m68.md
# AIBOUX Master State: Service URL Migration, Bark Policy, Worker Evidence, And Dirty Tree
```

## Deploy

Command:

```text
npx wrangler deploy
```

Result:

```text
Uploaded aiboux
Deployed aiboux triggers
Current Version ID: e7b7d3a1-9224-4fd6-8009-698431b70f49
```

Static asset upload evidence:

```text
Found 1 new or modified static asset to upload.
+ /g/m68.md
Uploaded 1 of 1 asset
```

## Worker Version Evidence After Deploy

Raw read-only evidence files:

- `all_log/82_worker_versions_list_aiboux_after_m68_deploy.json`
- `all_log/82_worker_versions_list_aiboux_after_m68_deploy.stderr.txt`
- `all_log/82_worker_deployments_list_aiboux_after_m68_deploy.json`
- `all_log/82_worker_deployments_list_aiboux_after_m68_deploy.stderr.txt`

Parsed latest evidence:

```text
latestVersionId: e7b7d3a1-9224-4fd6-8009-698431b70f49
latestVersionCreated: 2026-05-31T17:00:59.226043Z
latestDeploymentId: 34d71362-1120-47f1-af26-8ebd5adb6c5a
latestDeploymentCreated: 2026-05-31T17:01:00.807761Z
latestDeploymentVersion: e7b7d3a1-9224-4fd6-8009-698431b70f49
latestDeploymentPercentage: 100
```

## Public M68 Verification

Command:

```text
curl -sS -L -D /tmp/m68.headers https://mail.aiboux.com/g/m68 -o /tmp/m68.body
```

Result:

```text
HTTP status: 200
Content-Type: text/markdown; charset=utf-8
Content-Length: 10034
Cache-Control: no-store, max-age=0
```

Public body heading:

```text
# AIBOUX Master State: Service URL Migration, Bark Policy, Worker Evidence, And Dirty Tree
```

Required phrase machine check:

```text
AIBOUX_MASTER_DOCUMENT: true
Service Subdomain Tenant URL Migration: true
Bark notification policy: true
Worker Version ID: true
f8867df3-aab9-439b-bf8d-634ada05191d: true
dirty tree: true
URL Bundle: true
絶対禁止事項: true
allRequired: true
```

## Public L68 And D68 Verification

`https://mail.aiboux.com/g/l68`:

```text
HTTP status: 200
Content-Type: text/markdown; charset=utf-8
Current Version ID visible in body: e7b7d3a1-9224-4fd6-8009-698431b70f49
```

`https://mail.aiboux.com/g/d68`:

```text
HTTP status: 200
Content-Type: text/markdown; charset=utf-8
Current Version ID visible in body: e7b7d3a1-9224-4fd6-8009-698431b70f49
```

## 8 URL Verification After Deploy

All required URLs returned HTTP 200. The HTML pages referenced `_astro` CSS assets and the CSS assets returned HTTP 200.

| URL | HTTP | Content-Type | Asset/CSS | Note |
| --- | ---: | --- | --- | --- |
| `https://mail.aiboux.com/` | 200 | `text/html` | `_astro/global.zVdmg9zH.css` 200 `text/css` | `AIBOUX Mail | サービスサイト` |
| `https://mail.aiboux.com/s/aiboux/` | 200 | `text/html` | `_astro/global.zVdmg9zH.css` 200 `text/css` | `AIBOUX Mail - 受信トレイ` |
| `https://shop.aiboux.com/` | 200 | `text/html` | `_astro/global.zVdmg9zH.css` 200 `text/css` | `AIBOUX SHOP | サービスサイト` |
| `https://shop.aiboux.com/s/aiboux/` | 200 | `text/html` | `_astro/global.zVdmg9zH.css` 200 `text/css` | `株式会社雪花 公式ストア | AIBOUX Storefront` |
| `https://shop.aiboux.com/s/aiboux/admin` | 200 | `text/html` | `_astro/global.zVdmg9zH.css` 200 `text/css` | `AIBOUX SHOP Dashboard` |
| `https://mail.aiboux.com/g/m68` | 200 | `text/markdown; charset=utf-8` | not applicable | new full master body verified |
| `https://mail.aiboux.com/g/l68` | 200 | `text/markdown; charset=utf-8` | not applicable | execution log artifact |
| `https://mail.aiboux.com/g/d68` | 200 | `text/markdown; charset=utf-8` | not applicable | screen artifact |

No replacement characters or disallowed control characters were detected in the fetched response bodies.

## Completion State

Public `https://mail.aiboux.com/g/m68` now serves the updated full master body. This resolves the prior NG condition where GitHub source was updated but the public m68 URL still returned the old body.
