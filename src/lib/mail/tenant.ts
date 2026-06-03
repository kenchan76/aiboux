import { env } from 'cloudflare:workers';

export type PlanType = 'FREE' | 'STANDARD' | 'PREMIUM';

export interface TenantContext {
  id: string;
  name: string;
  planType: PlanType;
}

export class TenantContextError extends Error {
  readonly status: number;

  constructor(message: string, status = 403) {
    super(message);
    this.name = 'TenantContextError';
    this.status = status;
  }
}

const DEFAULT_VERIFIED_TENANT_ID = '00000000-0000-0000-0000-000000000000';

interface TenantContextRow {
  id: string;
  name: string;
  plan: string;
}

function normalizePlanType(plan: string): PlanType {
  const normalized = plan.trim().toUpperCase();

  if (normalized === 'FREE' || normalized === 'STANDARD' || normalized === 'PREMIUM') {
    return normalized;
  }

  throw new TenantContextError(`Unsupported tenant plan: ${plan}`, 500);
}

function getVerifiedTenantId(_request: Request): string {
  return DEFAULT_VERIFIED_TENANT_ID;
}

export async function getTenantContext(request: Request): Promise<TenantContext> {
  const tenantId = getVerifiedTenantId(request);
  const tenant = await env.DB.prepare(
    `SELECT id, name, plan
     FROM tenants
     WHERE id = ? AND status = 'active'
     LIMIT 1`,
  )
    .bind(tenantId)
    .first<TenantContextRow>();

  if (!tenant) {
    throw new TenantContextError('Active tenant context was not found.', 403);
  }

  return {
    id: tenant.id,
    name: tenant.name,
    planType: normalizePlanType(tenant.plan),
  };
}

export function tenantContextErrorResponse(error: unknown): Response {
  if (error instanceof TenantContextError) {
    return Response.json({ success: false, error: error.message }, { status: error.status });
  }

  return Response.json({ success: false, error: 'Failed to resolve tenant context.' }, { status: 500 });
}
