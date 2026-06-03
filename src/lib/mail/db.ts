import type { MailMessageListItem, Tenant, TenantPlanLimits } from './types';

export async function getTenantBySlug(db: D1Database, slug: string): Promise<Tenant | null> {
  return db
    .prepare(
      `SELECT id, slug, name, plan, status, custom_domain, created_at, updated_at
       FROM tenants
       WHERE slug = ? AND status = 'active'
       LIMIT 1`,
    )
    .bind(slug)
    .first<Tenant>();
}

export async function getPlanLimits(db: D1Database, plan: string): Promise<TenantPlanLimits | null> {
  return db
    .prepare(
      `SELECT plan, monthly_price_jpy, max_mail_addresses, r2_retention_days, ads_enabled,
              client_ai_enabled, client_excel_enabled, client_optimizer_enabled
       FROM tenant_plan_limits
       WHERE plan = ?
       LIMIT 1`,
    )
    .bind(plan)
    .first<TenantPlanLimits>();
}

export async function countTenantMailAddresses(db: D1Database, tenantId: string): Promise<number> {
  const row = await db
    .prepare(`SELECT COUNT(*) AS count FROM mail_addresses WHERE tenant_id = ? AND status = 'active'`)
    .bind(tenantId)
    .first<{ count: number }>();

  return row?.count ?? 0;
}

export async function listRecentMessages(
  db: D1Database,
  tenantId: string,
  limit = 30,
): Promise<MailMessageListItem[]> {
  const result = await db
    .prepare(
      `SELECT id, tenant_id, from_address, subject, preview_text, status, is_read, is_starred, created_at
       FROM mail_messages
       WHERE tenant_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
    )
    .bind(tenantId, limit)
    .all<MailMessageListItem>();

  return result.results;
}
