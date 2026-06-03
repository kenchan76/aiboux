export const prerender = false;

import { env } from 'cloudflare:workers';
import { getTenantContext, tenantContextErrorResponse } from '../../../../lib/mail/tenant';
import { inspectTenantStorageQuota, quotaExceededResponse } from '../../../../lib/server/storageQuota';

interface UploadSuccess {
  success: true;
  assetId: string;
  key: string;
  size: number;
  contentType: string;
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize('NFKC')
    .replace(/[\\/:*?"<>|#%{}^~[\]`]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 140) || 'attachment';
}

export async function POST({ request }: { request: Request }): Promise<Response> {
  let tenant;

  try {
    tenant = await getTenantContext(request);
  } catch (error) {
    return tenantContextErrorResponse(error);
  }

  const contentLength = parseContentLength(request.headers.get('content-length'));
  if (contentLength !== null) {
    const earlySnapshot = await inspectTenantStorageQuota(env.DB, tenant.id, contentLength);
    if (earlySnapshot.wouldExceed) return quotaExceededResponse(earlySnapshot);
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return Response.json({ success: false, error: 'file is required.' }, { status: 400 });
  }

  const finalSnapshot = await inspectTenantStorageQuota(env.DB, tenant.id, file.size);
  if (finalSnapshot.wouldExceed) return quotaExceededResponse(finalSnapshot);

  const now = Date.now();
  const assetId = `temp_${crypto.randomUUID()}`;
  const safeName = sanitizeFileName(file.name);
  const key = `${tenant.id}/temp/${now}_${assetId}_${safeName}`;
  const contentType = file.type || 'application/octet-stream';

  await env.STORAGE.put(key, file.stream(), {
    httpMetadata: {
      contentType,
      contentDisposition: `attachment; filename="${safeName.replace(/"/g, '')}"`,
    },
    customMetadata: {
      tenantId: tenant.id,
      originalName: file.name,
      temporary: 'true',
    },
  });

  await env.DB.prepare(
    `
    INSERT INTO tenant_storage_assets (
      id, tenant_id, r2_key, file_name, file_size, file_type, purpose, created_at, expires_at
    )
    VALUES (?, ?, ?, ?, ?, ?, 'temp', ?, ?)
    `,
  )
    .bind(assetId, tenant.id, key, safeName, file.size, contentType, now, now + 14 * 24 * 60 * 60 * 1000)
    .run();

  const payload: UploadSuccess = {
    success: true,
    assetId: key,
    key,
    size: file.size,
    contentType,
  };

  return Response.json(payload);
}

function parseContentLength(value: string | null): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}
