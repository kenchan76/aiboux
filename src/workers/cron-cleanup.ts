type CleanupResult = {
  publicTransfersDeleted: number;
  tenantAssetsDeleted: number;
  r2DeleteFailures: number;
};

type PublicTransferRow = {
  id: string;
  r2_key: string;
};

type TenantAssetRow = {
  id: string;
  r2_key: string;
};

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
const BATCH_LIMIT = 250;

export async function runR2CronCleanup(env: Cloudflare.Env): Promise<CleanupResult> {
  const cutoffMs = Date.now() - FOURTEEN_DAYS_MS;
  const result: CleanupResult = {
    publicTransfersDeleted: 0,
    tenantAssetsDeleted: 0,
    r2DeleteFailures: 0,
  };

  result.publicTransfersDeleted = await deleteExpiredPublicTransfers(env, cutoffMs);
  const tenantAssetResult = await deleteExpiredTenantAssets(env, cutoffMs);
  result.tenantAssetsDeleted = tenantAssetResult.deleted;
  result.r2DeleteFailures = tenantAssetResult.failures;

  return result;
}

async function deleteExpiredPublicTransfers(env: Cloudflare.Env, cutoffMs: number): Promise<number> {
  const rows = (
    await env.DB.prepare(
      `
      SELECT id, r2_key
      FROM public_file_transfers
      WHERE expires_at <= datetime('now')
         OR (CAST(strftime('%s', created_at) AS INTEGER) * 1000) < ?
      ORDER BY created_at ASC
      LIMIT ?
      `,
    )
      .bind(cutoffMs, BATCH_LIMIT)
      .all<PublicTransferRow>()
  ).results ?? [];

  let deleted = 0;

  for (const row of rows) {
    await env.STORAGE.delete(row.r2_key);
    await env.DB.prepare('DELETE FROM public_file_transfers WHERE id = ?').bind(row.id).run();
    deleted += 1;
  }

  return deleted;
}

async function deleteExpiredTenantAssets(env: Cloudflare.Env, cutoffMs: number): Promise<{ deleted: number; failures: number }> {
  const rows = (
    await env.DB.prepare(
      `
      SELECT id, r2_key
      FROM tenant_storage_assets
      WHERE (expires_at IS NOT NULL AND expires_at < ?)
         OR (purpose = 'temp' AND created_at < ?)
      ORDER BY created_at ASC
      LIMIT ?
      `,
    )
      .bind(Date.now(), cutoffMs, BATCH_LIMIT)
      .all<TenantAssetRow>()
  ).results ?? [];

  let deleted = 0;
  let failures = 0;

  for (const row of rows) {
    try {
      await env.STORAGE.delete(row.r2_key);
      await env.DB.prepare('DELETE FROM tenant_storage_assets WHERE id = ?').bind(row.id).run();
      deleted += 1;
    } catch (error) {
      failures += 1;
      console.warn('R2 cleanup failed for tenant asset.', {
        id: row.id,
        reason: error instanceof Error ? error.message : 'unknown',
      });
    }
  }

  return { deleted, failures };
}
