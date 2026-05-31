# Public URL Recheck After Bark Commit Push

## Captured

- Date: 2026-06-01T00:54:54+09:00
- Method: Node `fetch` with redirects followed
- Secret/PAT/token output: not performed
- Bark notification: not sent in this work unit

## Summary

All requested public URLs returned HTTP 200. The service HTML pages referenced `_astro` CSS assets and those CSS assets returned HTTP 200. The `/g/...` URL Bundle artifacts returned `text/markdown; charset=utf-8`. No replacement characters or disallowed control characters were detected in the fetched response bodies.

## Results

| URL | HTTP | Content-Type | Asset Check | Text Check |
| --- | ---: | --- | --- | --- |
| `https://mail.aiboux.com/` | 200 | `text/html` | `_astro/global.zVdmg9zH.css` 200 `text/css` | no replacement/control chars |
| `https://mail.aiboux.com/s/aiboux/` | 200 | `text/html` | `_astro/global.zVdmg9zH.css` 200 `text/css` | no replacement/control chars |
| `https://shop.aiboux.com/` | 200 | `text/html` | `_astro/global.zVdmg9zH.css` 200 `text/css` | no replacement/control chars |
| `https://shop.aiboux.com/s/aiboux/` | 200 | `text/html` | `_astro/global.zVdmg9zH.css` 200 `text/css` | no replacement/control chars |
| `https://shop.aiboux.com/s/aiboux/admin` | 200 | `text/html` | `_astro/global.zVdmg9zH.css` 200 `text/css` | no replacement/control chars |
| `https://mail.aiboux.com/g/m68` | 200 | `text/markdown; charset=utf-8` | not applicable | no replacement/control chars |
| `https://mail.aiboux.com/g/l68` | 200 | `text/markdown; charset=utf-8` | not applicable | no replacement/control chars |
| `https://mail.aiboux.com/g/d68` | 200 | `text/markdown; charset=utf-8` | not applicable | no replacement/control chars |

## Titles Or Artifact Snippets

- `https://mail.aiboux.com/`: `AIBOUX Mail | サービスサイト`
- `https://mail.aiboux.com/s/aiboux/`: `AIBOUX Mail - 受信トレイ`
- `https://shop.aiboux.com/`: `AIBOUX SHOP | サービスサイト`
- `https://shop.aiboux.com/s/aiboux/`: `株式会社雪花 公式ストア | AIBOUX Storefront`
- `https://shop.aiboux.com/s/aiboux/admin`: `AIBOUX SHOP Dashboard`
- `https://mail.aiboux.com/g/m68`: begins with `# AIBOUX Master Update Preview: Service Subdomain Tenant URL Migration`
- `https://mail.aiboux.com/g/l68`: begins with `# Service Subdomain Tenant URL Migration Execution Log`
- `https://mail.aiboux.com/g/d68`: begins with `# Service Subdomain Tenant URL Migration Screen Artifact`

## Conclusion

Public URL recheck passed for the requested URL set. This recheck does not resolve the separate `npm run gate:aiboux` Worker Version ID requirement.
