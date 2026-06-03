import { env } from 'cloudflare:workers';

export type TenantContext = {
  tenantId: string;
  slug: string;
  name: string;
  hostName: string | null;
};

type TenantRow = {
  id: string;
  slug: string;
  name: string;
  host_name: string | null;
};

export async function resolveTenantFromRequest(request: Request): Promise<TenantContext> {
  const url = new URL(request.url);
  const pathTenantSlug = getTenantSlugFromPath(url.pathname);
  const explicitTenantId = normalizeHeader(request.headers.get('x-tenant-id')) || normalizeParam(url.searchParams.get('tenant_id'));
  const explicitSlug = normalizeHeader(request.headers.get('x-tenant-slug')) || normalizeParam(url.searchParams.get('tenant')) || pathTenantSlug;
  const host = normalizeHost(url.hostname || request.headers.get('host'));

  let tenant: TenantRow | null = null;

  if (explicitTenantId) {
    tenant = await env.DB.prepare(
      "SELECT id, slug, name, host_name FROM tenants WHERE id = ? AND status = 'active' AND is_active = 1 LIMIT 1",
    )
      .bind(explicitTenantId)
      .first<TenantRow>();
  }

  if (!tenant && explicitSlug) {
    tenant = await env.DB.prepare(
      "SELECT id, slug, name, host_name FROM tenants WHERE slug = ? AND status = 'active' AND is_active = 1 LIMIT 1",
    )
      .bind(explicitSlug)
      .first<TenantRow>();
  }

  if (!tenant && host) {
    tenant = await env.DB.prepare(
      "SELECT id, slug, name, host_name FROM tenants WHERE host_name = ? AND status = 'active' AND is_active = 1 LIMIT 1",
    )
      .bind(host)
      .first<TenantRow>();
  }

  if (!tenant && isDefaultTenantFallbackHost(host)) {
    tenant = await env.DB.prepare(
      "SELECT id, slug, name, host_name FROM tenants WHERE status = 'active' AND is_active = 1 ORDER BY created_at ASC LIMIT 1",
    ).first<TenantRow>();
  }

  if (!tenant) {
    throw new TenantResolutionError('Active tenant was not found for this request.', 404);
  }

  return {
    tenantId: tenant.id,
    slug: tenant.slug,
    name: tenant.name,
    hostName: tenant.host_name,
  };
}

export function tenantJsonError(error: unknown): Response {
  if (error instanceof TenantResolutionError) {
    return Response.json({ success: false, error: error.message }, { status: error.status });
  }

  return Response.json({ success: false, error: 'Tenant resolution failed.' }, { status: 403 });
}

export class TenantResolutionError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'TenantResolutionError';
    this.status = status;
  }
}

function normalizeParam(value: string | null): string {
  return value?.trim() ?? '';
}

function normalizeHeader(value: string | null): string {
  return value?.trim() ?? '';
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

function getTenantSlugFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 's' || !parts[1]) return '';
  try {
    return decodeURIComponent(parts[1]).trim();
  } catch {
    return '';
  }
}

function isDefaultTenantFallbackHost(host: string): boolean {
  return host === 'shop.aiboux.com' || host === 'core.aiboux.com' || host === 'localhost' || host === '127.0.0.1';
}
