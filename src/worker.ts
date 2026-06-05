import { handle } from '@astrojs/cloudflare/handler';
import { runR2CronCleanup } from './workers/cron-cleanup';
import type { ShopFeedSyncMessage } from './lib/server/shopFeedSyncQueue';
import { processShopFeedSyncMessage } from './lib/server/shopFeedSyncConsumer';
import { runShopEmailQueue } from './workers/shop-email-queue';
import { runShopSocialPostCron } from './workers/shop-social-cron';

type EnvWithAssets = Env & {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
  CF_VERSION_METADATA?: {
    id?: string;
    tag?: string;
    timestamp?: string;
  };
};

const PERSISTENT_SHORTLINK_ASSETS: Record<string, string> = {
  '/g/m68': '/g/m68.md',
  '/g/l68': '/g/l68.md',
  '/g/d68': '/g/d68.md',
};

const NORMALIZED_SHA_TARGETS = [
  { id: 'm68', assetPath: '/g/m68.md', publicPath: '/g/m68' },
  { id: 'l68', assetPath: '/g/l68.md', publicPath: '/g/l68' },
  { id: 'd68', assetPath: '/g/d68.md', publicPath: '/g/d68' },
];

export default {
  async fetch(request, env, ctx) {
    const assetResponse = await servePersistentShortlink(request, env as EnvWithAssets);
    if (assetResponse) return assetResponse;

    const rewrittenRequest = rewriteServiceHostRequest(request);
    const response = await handle(rewrittenRequest, env as unknown as Env, ctx);
    return withServiceRoutingHeaders(request, rewrittenRequest, response, env as EnvWithAssets);
  },

  async scheduled(_controller, env, _ctx) {
    try {
      const result = await runR2CronCleanup(env);
      console.info('AIBOUX scheduled R2 cleanup completed.', result);
    } catch (error) {
      console.error('AIBOUX scheduled R2 cleanup failed.', {
        reason: error instanceof Error ? error.message : 'unknown',
      });
    }

    try {
      const result = await runShopSocialPostCron(env);
      console.info('AIBOUX scheduled Shop social posts completed.', result);
    } catch (error) {
      console.error('AIBOUX scheduled Shop social posts failed.', {
        reason: error instanceof Error ? error.message : 'unknown',
      });
    }

    try {
      const result = await runShopEmailQueue(env);
      console.info('AIBOUX scheduled Shop email queue completed.', result);
    } catch (error) {
      console.error('AIBOUX scheduled Shop email queue failed.', {
        reason: error instanceof Error ? error.message : 'unknown',
      });
    }
  },

  async queue(batch, env) {
    for (const message of batch.messages) {
      const body = message.body as ShopFeedSyncMessage;
      try {
        if (!body?.jobId || !body?.tenantId) {
          console.warn('AIBOUX Shop feed sync queue skipped invalid message.', { queueMessageId: message.id });
          message.ack();
          continue;
        }

        const result = await processShopFeedSyncMessage(env, body);

        console.info('AIBOUX Shop feed sync queue processed.', {
          queueMessageId: message.id,
          jobId: body.jobId,
          type: body.type,
          tenantId: body.tenantId,
          productId: body.productId,
          channels: result.results.map((item) => `${item.channel}:${item.status}:${item.mode}`),
          availability: result.availability,
          status: result.status,
          requestedAt: body.requestedAt,
        });
        message.ack();
      } catch (error) {
        console.error('AIBOUX Shop feed sync queue failed before ack.', {
          queueMessageId: message.id,
          jobId: body?.jobId,
          reason: error instanceof Error ? error.message : 'unknown',
        });
        message.retry();
      }
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>;

async function servePersistentShortlink(request: Request, env: EnvWithAssets): Promise<Response | null> {
  const url = new URL(request.url);
  const shortPath = url.pathname.replace(/\/$/, '');

  if (shortPath === '/g/sha68') {
    return serveNormalizedShaEvidence(url, env);
  }

  const assetPath = PERSISTENT_SHORTLINK_ASSETS[shortPath];
  if (!assetPath) return null;

  if (!env.ASSETS) {
    return new Response('Persistent artifact storage is unavailable.', {
      status: 503,
      headers: persistentArtifactHeaders(),
    });
  }

  const assetUrl = new URL(assetPath, url.origin);
  const assetRequest = new Request(assetUrl.toString(), request);
  const asset = await env.ASSETS.fetch(assetRequest);
  if (!asset.ok) {
    return new Response('Persistent artifact is missing.', {
      status: 500,
      headers: persistentArtifactHeaders(),
    });
  }

  const content = await asset.text();
  return new Response(replaceWorkerMetadata(content, env), {
    status: 200,
    headers: persistentArtifactHeaders(),
  });
}

async function serveNormalizedShaEvidence(url: URL, env: EnvWithAssets): Promise<Response> {
  if (!env.ASSETS) {
    return new Response('Persistent artifact storage is unavailable.', {
      status: 503,
      headers: persistentArtifactHeaders(),
    });
  }

  const workerVersionId = env.CF_VERSION_METADATA?.id ?? '';
  const checkedAt = new Date().toISOString();
  const rows = [];

  for (const target of NORMALIZED_SHA_TARGETS) {
    const assetUrl = new URL(target.assetPath, url.origin);
    const asset = await env.ASSETS.fetch(new Request(assetUrl.toString()));
    const localRaw = asset.ok ? await asset.text() : '';
    const publicRaw = asset.ok ? replaceWorkerMetadata(localRaw, env) : '';
    const targetWorkerVersionId = localRaw.includes('__WORKER_VERSION_ID__') ? workerVersionId : '';
    const localNormalized = normalizeRuntimeWorkerIdForSha(localRaw, targetWorkerVersionId);
    const publicNormalized = normalizeRuntimeWorkerIdForSha(publicRaw, targetWorkerVersionId);
    const localRawSha256 = await sha256Hex(localRaw);
    const publicRawSha256 = await sha256Hex(publicRaw);
    const localNormalizedSha256 = await sha256Hex(localNormalized);
    const publicNormalizedSha256 = await sha256Hex(publicNormalized);

    rows.push({
      id: target.id,
      publicPath: target.publicPath,
      httpStatus: asset.ok ? 200 : 500,
      contentType: 'text/markdown; charset=utf-8',
      workerVersionId: targetWorkerVersionId || 'none',
      localRawSha256,
      publicRawSha256,
      localNormalizedSha256,
      publicNormalizedSha256,
      normalizedMatch: localNormalizedSha256 === publicNormalizedSha256,
    });
  }

  const ok = Boolean(workerVersionId) && rows.every((row) => row.httpStatus === 200 && row.normalizedMatch);
  const markdown = renderNormalizedShaMarkdown({
    checkedAt,
    ok,
    workerVersionId,
    rows,
  });

  return new Response(markdown, {
    status: ok ? 200 : 500,
    headers: persistentArtifactHeaders(),
  });
}

function normalizeRuntimeWorkerIdForSha(content: string, workerVersionId: string): string {
  if (!workerVersionId) return content;
  return content.replaceAll(workerVersionId, '__WORKER_VERSION_ID__');
}

async function sha256Hex(content: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(content));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function renderNormalizedShaMarkdown(result: {
  checkedAt: string;
  ok: boolean;
  workerVersionId: string;
  rows: Array<{
    id: string;
    publicPath: string;
    httpStatus: number;
    contentType: string;
    workerVersionId: string;
    localRawSha256: string;
    publicRawSha256: string;
    localNormalizedSha256: string;
    publicNormalizedSha256: string;
    normalizedMatch: boolean;
  }>;
}): string {
  const lines = [
    '# AIBOUX /g Normalized SHA Verification',
    '',
    `Status: \`${result.ok ? 'PASS' : 'FAIL'}\``,
    '',
    `Verification Time: \`${result.checkedAt}\``,
    '',
    `Worker Version ID: \`${result.workerVersionId || 'NOT_FOUND'}\``,
    '',
    '## Rule',
    '',
    'Runtime Worker Version ID置換がある場合、raw sha256不一致だけで合格にしない。',
    '`/g/m68`、`/g/l68`、`/g/d68` は次の5項目を必ず記録する。',
    '',
    '1. local raw sha256',
    '2. public raw sha256',
    '3. Worker Version IDを `__WORKER_VERSION_ID__` に正規化したlocal normalized sha256',
    '4. Worker Version IDを `__WORKER_VERSION_ID__` に正規化したpublic normalized sha256',
    '5. normalized sha256が一致するか',
    '',
    'normalized sha256が一致しない場合は、公開ログ不一致としてFAIL。',
    '',
    '## Results',
    '',
    '| Target | Runtime Worker Version ID | HTTP | Content-Type | Local Raw SHA256 | Public Raw SHA256 | Local Normalized SHA256 | Public Normalized SHA256 | Normalized Match |',
    '| --- | --- | ---: | --- | --- | --- | --- | --- | --- |',
  ];

  for (const row of result.rows) {
    lines.push(`| ${row.publicPath} | ${row.workerVersionId} | ${row.httpStatus} | ${row.contentType} | ${row.localRawSha256} | ${row.publicRawSha256} | ${row.localNormalizedSha256} | ${row.publicNormalizedSha256} | ${row.normalizedMatch ? 'PASS' : 'FAIL'} |`);
  }

  lines.push(
    '',
    '## Verdict',
    '',
    result.ok
      ? 'Normalized sha256一致。runtime Worker Version ID置換を除き、local/public本文は一致している。'
      : 'Normalized sha256不一致。公開ログ不一致としてFAIL。',
    '',
    '## Notes',
    '',
    '- このURLは現在のWorkerで動的生成する正規化SHA証跡である。',
    '- ストアフロントUI変更の証跡ではない。',
    '- `FINAL_ACCEPTED` は主張しない。',
    '',
  );

  return `${lines.join('\n').trimEnd()}\n`;
}

function persistentArtifactHeaders(): HeadersInit {
  return {
    'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
    'cdn-cache-control': 'no-store',
    'cloudflare-cdn-cache-control': 'no-store',
    'content-type': 'text/markdown; charset=utf-8',
    'expires': '0',
    'pragma': 'no-cache',
    'x-content-type-options': 'nosniff',
    'x-robots-tag': 'noindex, nofollow, noarchive',
  };
}

function applyNoStoreHeaders(headers: Headers): void {
  headers.set('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  headers.set('cdn-cache-control', 'no-store');
  headers.set('cloudflare-cdn-cache-control', 'no-store');
  headers.set('pragma', 'no-cache');
  headers.set('expires', '0');
}

function withServiceRoutingHeaders(
  originalRequest: Request,
  rewrittenRequest: Request,
  response: Response,
  env: EnvWithAssets,
): Response {
  const originalUrl = new URL(originalRequest.url);
  const rewrittenUrl = new URL(rewrittenRequest.url);
  const host = normalizeHost(originalRequest.headers.get('host') || originalUrl.hostname);

  if (host !== 'mail.aiboux.com' && host !== 'shop.aiboux.com') {
    return response;
  }

  if (isStaticOrApiPath(originalUrl.pathname)) {
    return response;
  }

  const headers = new Headers(response.headers);
  applyNoStoreHeaders(headers);
  if (isShopAdminPath(originalUrl.pathname) || isShopAdminPath(rewrittenUrl.pathname)) {
    headers.set('clear-site-data', '"cache"');
    headers.set('x-aiboux-admin-cache-policy', 'no-store-clear-cache');
  }
  headers.set('x-aiboux-route-source', 'worker-entry');
  headers.set('x-aiboux-original-path', originalUrl.pathname);
  headers.set('x-aiboux-rewritten-path', rewrittenUrl.pathname);
  headers.set('x-aiboux-worker-version', env.CF_VERSION_METADATA?.id ?? 'UNAVAILABLE_IN_RUNTIME');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isShopAdminPath(pathname: string): boolean {
  return pathname === '/s/aiboux/admin'
    || pathname.startsWith('/s/aiboux/admin/')
    || pathname === '/shop/dashboard'
    || pathname.startsWith('/shop/admin/')
    || pathname === '/shop/products'
    || pathname === '/shop/orders'
    || pathname === '/shop/settings';
}

function replaceWorkerMetadata(content: string, env: EnvWithAssets): string {
  const metadata = env.CF_VERSION_METADATA;
  return content
    .replaceAll('__WORKER_VERSION_ID__', metadata?.id ?? 'UNAVAILABLE_IN_RUNTIME')
    .replaceAll('__WORKER_VERSION_TAG__', metadata?.tag ?? 'UNAVAILABLE_IN_RUNTIME')
    .replaceAll('__WORKER_VERSION_TIMESTAMP__', metadata?.timestamp ?? 'UNAVAILABLE_IN_RUNTIME');
}

function rewriteServiceHostRequest(request: Request): Request {
  const url = new URL(request.url);
  const host = normalizeHost(request.headers.get('host') || url.hostname);
  const pathname = url.pathname;

  if (isStaticOrApiPath(pathname)) {
    return request;
  }

  let nextPathname = pathname;

  if (host === 'mail.aiboux.com') {
    nextPathname = rewriteMailPath(pathname);
  } else if (host === 'shop.aiboux.com') {
    nextPathname = rewriteShopPath(pathname);
  }

  if (nextPathname === pathname) {
    return request;
  }

  url.pathname = nextPathname;
  return new Request(url.toString(), request);
}

function rewriteMailPath(pathname: string): string {
  const tenantRoute = parseTenantRoute(pathname);
  if (tenantRoute) {
    return tenantRoute.suffix ? `/mail/${tenantRoute.suffix}` : '/mail/inbox';
  }

  if (pathname === '/') return '/mail';
  if (pathname === '/mail' || pathname.startsWith('/mail/') || pathname === '/file' || pathname.startsWith('/file/')) {
    return pathname;
  }

  return '/mail';
}

function rewriteShopPath(pathname: string): string {
  const tenantRoute = parseTenantRoute(pathname);
  if (tenantRoute) {
    return rewriteShopTenantPath(tenantRoute.tenantSlug, tenantRoute.suffix);
  }

  if (pathname === '/shop' || pathname.startsWith('/shop/')) {
    return pathname;
  }

  return pathname === '/' ? '/shop' : `/shop${pathname}`;
}

function rewriteShopTenantPath(tenantSlug: string, suffix: string): string {
  const encodedTenant = encodeURIComponent(tenantSlug);

  if (!suffix) return `/shop/storefront/${encodedTenant}`;
  if (suffix === 'admin') return '/shop/dashboard';

  if (suffix.startsWith('admin/')) {
    const adminSuffix = suffix.slice('admin/'.length);
    if (adminSuffix === 'orders/mark-shipped') return '/shop/admin/orders/mark-shipped';
    if (adminSuffix === 'design') return '/shop/settings/design';
    return adminSuffix ? `/shop/${adminSuffix}` : '/shop/dashboard';
  }

  return `/shop/${encodedTenant}/${suffix}`;
}

function parseTenantRoute(pathname: string): { tenantSlug: string; suffix: string } | null {
  if (pathname !== '/s' && !pathname.startsWith('/s/')) return null;

  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 's' || !parts[1]) return null;

  try {
    return {
      tenantSlug: decodeURIComponent(parts[1]),
      suffix: parts.slice(2).join('/'),
    };
  } catch {
    return null;
  }
}

function isStaticOrApiPath(pathname: string): boolean {
  return (
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/mail/api/') ||
    pathname.startsWith('/file/api/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.json' ||
    pathname.startsWith('/g/')
  );
}

function normalizeHost(value: string): string {
  return value.trim().toLowerCase().replace(/:\d+$/, '');
}
