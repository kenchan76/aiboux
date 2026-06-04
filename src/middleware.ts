import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';
import { resolveTenantFromRequest } from './lib/server/tenantContext';
import { parseCookies, verifySsoJwt } from './lib/server/ssoSession';

type MiddlewareContext = Parameters<Parameters<typeof defineMiddleware>[0]>[0];
type MiddlewareNext = Parameters<Parameters<typeof defineMiddleware>[0]>[1];
type MiddlewareResponse = Response | Promise<Response>;

const STATIC_PREFIXES = ['/_astro/', '/favicon.ico', '/robots.txt', '/sitemap.xml', '/manifest.json'];
const API_PREFIXES = ['/api/', '/mail/api/', '/file/api/'];
const PUBLIC_SHORTLINK_PREFIXES = ['/g/'];
const APP_MOUNT_PREFIXES = ['/core', '/mail', '/file', '/biz', '/shop', '/mall', '/rirekisho', '/office', '/docs'];
const SESSION_COOKIE_SUFFIX = 'session';
const TENANT_URL_PREFIX = '/s';

export const onRequest = defineMiddleware(async (context, next): Promise<Response> => {
  const requestHost = normalizeHost(context.request.headers.get('host') || context.url.hostname);
  const devForwardedHost = normalizeHost(context.request.headers.get('x-aiboux-dev-host') || context.request.headers.get('x-forwarded-host'));
  const host = isLocalHost(requestHost) && devForwardedHost ? devForwardedHost : requestHost;
  const pathname = context.url.pathname;
  const sessionCookieName = createHostScopedSessionCookieName(host);

  context.locals.security = {
    host,
    sessionCookieName,
    sessionCookieOptions: {
      // Keep domain undefined so __Host-* cookies stay locked to the exact FQDN.
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    },
  };

  const sso = await resolveSsoSession(context.request);
  if (sso) {
    context.locals.sso = {
      tenantId: sso.tenant_id,
      staffId: sso.staff_id,
      email: sso.email,
      staffPlanType: sso.staff_plan_type,
      provider: sso.provider,
    };
    context.locals.tenantId = context.locals.tenantId ?? sso.tenant_id;
  }

  if (shouldPassThrough(pathname)) {
    const response = await next();
    return withNoStoreForShopAdmin(context, response);
  }

  const tenant = await resolveOptionalTenant(context.request);
  if (tenant) {
    context.locals.tenantId = tenant.tenantId;
    context.locals.tenant = {
      id: tenant.tenantId,
      slug: tenant.slug,
      name: tenant.name,
      hostName: tenant.hostName,
    };
  }

  if (APP_MOUNT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    const response = await next();
    return withNoStoreForShopAdmin(context, response);
  }

  if (host === 'core.aiboux.com') {
    return rewriteDomainRoot(context, next, '/core', ['/core']);
  }

  if (host === 'mail.aiboux.com') {
    return routeMailDomain(context, next);
  }

  if (host === 'file.aiboux.com') {
    return routeFileDomain(context, next);
  }

  if (host === 'biz.aiboux.com') {
    return routeMountedDomain(context, next, 'biz');
  }

  if (host === 'rirekisho.aiboux.com') {
    return routeMountedDomain(context, next, 'rirekisho');
  }

  if (host === 'office.aiboux.com') {
    return routeMountedDomain(context, next, 'office');
  }

  if (host === 'docs.aiboux.com') {
    return rewriteDomainRoot(context, next, '/docs', ['/docs']);
  }

  if (host === 'shop.aiboux.com') {
    return routeShopDomain(context, next);
  }

  if (host === 'mall.aiboux.com') {
    return rewriteDomainRoot(context, next, '/mall', ['/mall', '/shop']);
  }

  if (tenant?.hostName && normalizeHost(tenant.hostName) === host) {
    return routeCustomShopDomain(context, next, tenant.slug);
  }

  const response = await next();
  return withNoStoreForShopAdmin(context, response);
});

function withNoStoreForShopAdmin(context: MiddlewareContext, response: Response): Response {
  const requestHost = normalizeHost(context.request.headers.get('host') || context.url.hostname);
  const pathname = context.url.pathname;
  const isShopAdminPath = requestHost === 'shop.aiboux.com'
    && (pathname === '/s/aiboux/admin'
      || pathname.startsWith('/s/aiboux/admin/')
      || pathname === '/shop/dashboard'
      || pathname.startsWith('/shop/admin/')
      || pathname === '/shop/products'
      || pathname === '/shop/orders'
      || pathname === '/shop/settings');

  if (!isShopAdminPath) return response;

  const headers = new Headers(response.headers);
  headers.set('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  headers.set('cdn-cache-control', 'no-store');
  headers.set('cloudflare-cdn-cache-control', 'no-store');
  headers.set('pragma', 'no-cache');
  headers.set('expires', '0');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function resolveOptionalTenant(request: Request) {
  try {
    return await resolveTenantFromRequest(request);
  } catch {
    return null;
  }
}

async function resolveSsoSession(request: Request) {
  const secret = getEnvString('AIBOUX_SSO_JWT_SECRET');
  if (!secret) return null;

  const token = parseCookies(request.headers.get('cookie')).get('aiboux_session');
  if (!token) return null;

  return verifySsoJwt(token, secret);
}

function getEnvString(key: string): string {
  const value = (env as unknown as Record<string, unknown>)[key];
  return typeof value === 'string' ? value.trim() : '';
}

function rewriteDomainRoot(
  context: MiddlewareContext,
  next: MiddlewareNext,
  mountPath: string,
  allowedPrefixes: string[],
): MiddlewareResponse {
  const pathname = context.url.pathname;

  if (allowedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return next();
  }

  const target = new URL(context.url);
  target.pathname = pathname === '/' ? mountPath : `${mountPath}${pathname}`;
  return context.rewrite(target);
}

function routeMailDomain(
  context: MiddlewareContext,
  next: MiddlewareNext,
): MiddlewareResponse {
  const pathname = context.url.pathname;

  const tenantRoute = parseTenantRoute(pathname);
  if (tenantRoute) {
    const suffix = tenantRoute.suffix;
    const target = new URL(context.url);
    target.pathname = suffix ? `/mail/${suffix}` : '/mail/inbox';
    return context.rewrite(target);
  }

  if (pathname === '/') {
    const target = new URL(context.url);
    target.pathname = '/mail';
    return context.rewrite(target);
  }

  if (pathname === '/mail' || pathname.startsWith('/mail/') || pathname === '/file' || pathname.startsWith('/file/')) {
    return next();
  }

  const target = new URL(context.url);
  target.pathname = '/mail';
  return context.rewrite(target);
}

function routeShopDomain(
  context: MiddlewareContext,
  next: MiddlewareNext,
): MiddlewareResponse {
  const pathname = context.url.pathname;

  const tenantRoute = parseTenantRoute(pathname);
  if (tenantRoute) {
    return rewriteShopTenantRoute(context, tenantRoute.tenantSlug, tenantRoute.suffix);
  }

  if (pathname === '/shop' || pathname.startsWith('/shop/')) {
    return next();
  }

  const target = new URL(context.url);
  target.pathname = pathname === '/' ? '/shop' : `/shop${pathname}`;
  return context.rewrite(target);
}

function routeCustomShopDomain(
  context: MiddlewareContext,
  next: MiddlewareNext,
  tenantSlug: string,
): MiddlewareResponse {
  const pathname = context.url.pathname;

  if (pathname === '/shop' || pathname.startsWith('/shop/') || pathname.startsWith('/api/')) {
    return next();
  }

  const tenantRoute = parseTenantRoute(pathname);
  if (tenantRoute) {
    return rewriteShopTenantRoute(context, tenantRoute.tenantSlug, tenantRoute.suffix);
  }

  const normalizedPath = pathname.replace(/^\/+|\/+$/g, '');
  const target = new URL(context.url);
  target.pathname = normalizedPath ? `/shop/${encodeURIComponent(tenantSlug)}/${normalizedPath}` : `/shop/storefront/${encodeURIComponent(tenantSlug)}`;
  return context.rewrite(target);
}

function rewriteShopTenantRoute(
  context: MiddlewareContext,
  tenantSlug: string,
  suffix: string,
): MiddlewareResponse {
  const target = new URL(context.url);
  const encodedTenant = encodeURIComponent(tenantSlug);

  if (!suffix) {
    target.pathname = `/shop/storefront/${encodedTenant}`;
    return context.rewrite(target);
  }

  if (suffix === 'admin') {
    target.pathname = '/shop/dashboard';
    return context.rewrite(target);
  }

  if (suffix.startsWith('admin/')) {
    const adminSuffix = suffix.slice('admin/'.length);
    target.pathname = adminSuffix === 'orders/mark-shipped'
      ? '/shop/admin/orders/mark-shipped'
      : adminSuffix === 'design'
        ? '/shop/settings/design'
      : adminSuffix
        ? `/shop/${adminSuffix}`
        : '/shop/dashboard';
    return context.rewrite(target);
  }

  target.pathname = `/shop/${encodedTenant}/${suffix}`;
  return context.rewrite(target);
}

function parseTenantRoute(pathname: string): { tenantSlug: string; suffix: string } | null {
  if (pathname !== TENANT_URL_PREFIX && !pathname.startsWith(`${TENANT_URL_PREFIX}/`)) {
    return null;
  }

  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== TENANT_URL_PREFIX.slice(1) || !parts[1]) {
    return null;
  }

  try {
    return {
      tenantSlug: decodeURIComponent(parts[1]),
      suffix: parts.slice(2).join('/'),
    };
  } catch {
    return null;
  }
}

function routeFileDomain(
  context: MiddlewareContext,
  next: MiddlewareNext,
): MiddlewareResponse {
  const pathname = context.url.pathname;

  if (pathname === '/' || pathname === '/file' || pathname.startsWith('/file/')) {
    return next();
  }

  const target = new URL(context.url);
  target.pathname = `/file${pathname}`;
  return context.redirect(target.toString(), 302);
}

function routeMountedDomain(
  context: MiddlewareContext,
  next: MiddlewareNext,
  mountName: string,
): MiddlewareResponse {
  const pathname = context.url.pathname;
  const mountPath = `/${mountName}`;

  if (pathname === mountPath || pathname.startsWith(`${mountPath}/`)) {
    return next();
  }

  if (pathname === '/') {
    return next();
  }

  const target = new URL(context.url);
  target.pathname = `${mountPath}${pathname}`;
  return context.redirect(target.toString(), 302);
}

function normalizeHost(value: string | null): string {
  const rawHost = value?.trim().toLowerCase() ?? '';
  if (!rawHost) return '';

  if (rawHost.startsWith('[')) {
    const closingIndex = rawHost.indexOf(']');
    return closingIndex > 0 ? rawHost.slice(1, closingIndex) : rawHost;
  }

  return rawHost.split(':')[0];
}

function isLocalHost(host: string): boolean {
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

function createHostScopedSessionCookieName(host: string): string {
  const normalizedHost = host || 'localhost';
  const safeHost = normalizedHost.replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  return `__Host-${safeHost || 'localhost'}_${SESSION_COOKIE_SUFFIX}`;
}

function shouldPassThrough(pathname: string): boolean {
  if (STATIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix))) {
    return true;
  }

  if (API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  if (PUBLIC_SHORTLINK_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  return /\.[a-z0-9]{2,8}$/i.test(pathname);
}
