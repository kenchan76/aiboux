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
  const assetPath = PERSISTENT_SHORTLINK_ASSETS[url.pathname.replace(/\/$/, '')];
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
