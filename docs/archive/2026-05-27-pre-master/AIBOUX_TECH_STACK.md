# AIBOUX Tech Stack

AIBOUX は Astro 6 を中心に、サービスごとのUIライブラリとCloudflareのエッジ基盤を組み合わせます。

## Confirmed Decisions

- Astro 6。
- TypeScript。
- Tailwind CSS。
- Cloudflare Pages / Workers / D1 / R2 / KV / Queues / Cron / Turnstile。
- Core / Mail / Shop は shadcn/ui。
- File / Biz / Office / 履歴書 は Starwind UI。
- OfficeはReact Islandsを使うが、重いOffice/PDFライブラリを初期bundleに入れない。
- Officeのファイル本体は原則サーバーへ送信しない。
- 2026-05-25時点で、Worker `aiboux` にAIBOUXシリーズの主要サブドメインをCustom Domainとして割当済み。

## Assumptions

- Cloudflare Containers は背景切り抜き、重いPDF/Office変換などが必要になった場合の候補。
- R2 は File や変換成果物など、明確にアップロード同意があるファイルの保存先候補。
- Officeはローカル処理を基本とし、履歴はメタデータ中心にする。

## TBD

- Docs のUI/検索実装。
- Mall のUIライブラリ。
- Officeで採用する実ライブラリの最終セット。
- 履歴書の写真処理基盤。

## Do Not Invent

- 外部サービスの仕様を未確認で実装しない。
- Officeファイル本体を勝手にAPIへ送信しない。
- AdSenseポリシーを推測で扱わない。
- PDF/Office完全互換を謳わない。

## Cloudflare Architecture

| Layer | Use |
|---|---|
| Pages | Astro frontend |
| Workers | API, routing, auth, signed URL, webhook |
| D1 | users, tenants, subscriptions, metadata, histories, audit logs |
| R2 | file storage, converted files, downloadable assets |
| KV | short-lived tokens, temporary state |
| Queues | async processing jobs |
| Cron | cleanup, expiry, scheduled jobs |
| Workers AI | AI diagnostics and future Mail / Dev Monitor summarization |
| Turnstile | bot / abuse protection |
| Containers | heavy processing candidate |

## Cloudflare Custom Domains

2026-05-25時点の本番割当状態。Cloudflare DNSでは各サブドメインが `104.21.45.47` / `172.67.209.179` を返すことを確認済み。

| Host | Status | Notes |
|---|---|---|
| `core.aiboux.com` | assigned / HTTP 200 verified | Core dashboard |
| `mail.aiboux.com` | assigned / HTTP 200 verified | Mail URL confirmed |
| `file.aiboux.com` | assigned / HTTP 200 verified | File site |
| `biz.aiboux.com` | assigned / HTTP 200 verified | Biz site |
| `office.aiboux.com` | assigned / HTTP 200 verified | Office site |
| `rirekisho.aiboux.com` | assigned / HTTP 200 verified | AIBOUX 履歴書 |
| `docs.aiboux.com` | assigned / HTTP 200 verified | Docs landing |
| `shop.aiboux.com` | assigned / HTTP 200 verified | Shop dashboard |
| `mall.aiboux.com` | assigned / HTTP 200 verified | Mall URL confirmed; current page content must be verified separately before public launch |

Latest verified deploy:

- Worker: `aiboux`
- Version ID: `4992cf84-9b2a-46e1-859a-e2c2e2712954`
- Deploy command: `npx wrangler deploy --keep-vars`
- Verification: `npm run build`, `npx wrangler deploy --keep-vars`, `curl -I https://mail.aiboux.com/mail/inbox`, temporary final log URL HTTP 200 / wrong-token HTTP 404 check, production Playwright check for AIBOUX Mail scroll, compact list, unread folder, settings UI, and AI overlay behavior.

## Cloudflare Workers AI

- Wrangler binding: `[ai] binding = "AI"`, `remote = true`.
- Runtime binding: `env.AI`.
- Default model: `@cf/meta/llama-3.1-8b-instruct-fp8`.
- Config var: `WORKERS_AI_TEXT_MODEL`.
- Protected diagnostic endpoint: `https://mail.aiboux.com/api/ai/health?run=1`.
- Public binding-only endpoint: `https://mail.aiboux.com/api/ai/health`.
- Cloudflare secret: `ADMIN_API_TOKEN`.
- Codex local MCP token file: `C:\Users\info\.codex\.sandbox-secrets\aiboux_admin_api_token.txt`.

Note: `https://aiboux.com` is the confirmed public series site URL, but apex/root domain assignment was outside the 2026-05-25 subdomain assignment task and must be verified separately before launch.

## Service UI Stack

| Service | Stack |
|---|---|
| Core | Astro 6 + React Islands + shadcn/ui + Tailwind |
| Mail | Astro 6 + React Islands + shadcn/ui + Tailwind |
| Shop | Astro 6 + React Islands + shadcn/ui + Tailwind |
| File | Astro 6 + Starwind UI + Tailwind CSS v4 |
| Biz | Astro 6 + Starwind UI + Tailwind CSS v4 |
| Office | Astro 6 + Starwind UI + React Islands + Tailwind CSS v4 |
| 履歴書 | Astro 6 + Starwind UI + Tailwind CSS v4 |
| Docs | TBD |
| Mall | TBD |

## Office Technical Policy

- LPはAstro静的HTML中心。
- Dropzone / Editor shell は必要箇所のみ React Island。
- ファイル選択後に拡張子とMIMEを判定。
- CSV/XLSX/PDF/DOCX/PPTX系ライブラリはdynamic import。
- Web Workerで重い処理を分離する。
- File API / ArrayBuffer / Blob download / IndexedDBを基本にする。
- Network検証でファイル本体がPOSTされていないことを確認する。

## Official Documentation Gate

実装前に対象に応じて以下の公式ドキュメントを確認する。

- Astro 6
- Astro Islands
- shadcn/ui Astro
- Starwind UI
- Tailwind CSS
- Cloudflare Pages / Workers / D1 / R2 / KV / Queues / Cron / Turnstile
- AdSense policies
- Stripe official docs if billing is touched
