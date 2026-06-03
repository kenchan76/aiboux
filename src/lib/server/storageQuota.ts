export const TENANT_STORAGE_QUOTA_BYTES = 1024 * 1024 * 1024;

export type StorageQuotaSnapshot = {
  tenantId: string;
  usedBytes: number;
  incomingBytes: number;
  quotaBytes: number;
  remainingBytes: number;
  wouldExceed: boolean;
};

export async function getTenantStorageUsageBytes(db: D1Database, tenantId: string): Promise<number> {
  const row = await db.prepare(
    `
    SELECT
      (
        SELECT COALESCE(SUM(file_size), 0)
        FROM tenant_storage_assets
        WHERE tenant_id = ?
      ) + (
        SELECT COALESCE(SUM(byte_size), 0)
        FROM mail_attachments
        WHERE tenant_id = ?
      ) AS used_bytes
    `,
  )
    .bind(tenantId, tenantId)
    .first<{ used_bytes: number }>();

  return Number(row?.used_bytes ?? 0);
}

export async function inspectTenantStorageQuota(
  db: D1Database,
  tenantId: string,
  incomingBytes: number,
  quotaBytes = TENANT_STORAGE_QUOTA_BYTES,
): Promise<StorageQuotaSnapshot> {
  const usedBytes = await getTenantStorageUsageBytes(db, tenantId);
  const safeIncomingBytes = Math.max(0, Math.trunc(incomingBytes));
  const remainingBytes = Math.max(0, quotaBytes - usedBytes);

  return {
    tenantId,
    usedBytes,
    incomingBytes: safeIncomingBytes,
    quotaBytes,
    remainingBytes,
    wouldExceed: usedBytes + safeIncomingBytes > quotaBytes,
  };
}

export function quotaExceededResponse(snapshot: StorageQuotaSnapshot): Response {
  return Response.json(
    {
      success: false,
      error: 'Tenant storage quota exceeded.',
      tenant_id: snapshot.tenantId,
      used_bytes: snapshot.usedBytes,
      incoming_bytes: snapshot.incomingBytes,
      quota_bytes: snapshot.quotaBytes,
      remaining_bytes: snapshot.remainingBytes,
    },
    { status: 413 },
  );
}
