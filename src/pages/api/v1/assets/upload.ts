import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import {
  inspectTenantStorageQuota,
  quotaExceededResponse,
} from '../../../../lib/server/storageQuota';

export const prerender = false;

type UploadSuccess = {
  success: true;
  asset_id: string;
  tenant_id: string;
  key: string;
  file_name: string;
  file_size: number;
  file_type: string;
  usage_bytes: number;
  quota_bytes: number;
};

type TenantRow = {
  id: string;
};

export const POST: APIRoute = async ({ request }) => {
  const tenantId = normalizeString(new URL(request.url).searchParams.get('tenant_id') || request.headers.get('x-tenant-id'));

  if (!tenantId) {
    return json({ success: false, error: '`tenant_id` query or `x-tenant-id` header is required before upload.' }, 400);
  }

  const authError = authorizeAdminRequest(request);
  if (authError) return authError;

  const tenant = await env.DB.prepare(
    "SELECT id FROM tenants WHERE id = ? AND status = 'active' AND storefront_status = 'active' AND COALESCE(is_active, 1) = 1 LIMIT 1",
  )
    .bind(tenantId)
    .first<TenantRow>();

  if (!tenant) {
    return json({ success: false, error: 'Active tenant was not found.' }, 404);
  }

  const contentLength = parseContentLength(request.headers.get('content-length'));
  if (contentLength !== null) {
    const earlySnapshot = await inspectTenantStorageQuota(env.DB, tenantId, contentLength);
    if (earlySnapshot.wouldExceed) return quotaExceededResponse(earlySnapshot);
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return json({ success: false, error: '`file` is required.' }, 400);
  }

  const finalSnapshot = await inspectTenantStorageQuota(env.DB, tenantId, file.size);
  if (finalSnapshot.wouldExceed) return quotaExceededResponse(finalSnapshot);

  const assetId = `asset_${crypto.randomUUID()}`;
  const safeFileName = sanitizeFileName(file.name);
  const fileType = file.type || 'application/octet-stream';
  const key = `${tenantId}/assets/${Date.now()}_${assetId}_${safeFileName}`;
  const now = Date.now();

  await env.STORAGE.put(key, file.stream(), {
    httpMetadata: {
      contentType: fileType,
      contentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(safeFileName)}`,
    },
    customMetadata: {
      tenantId,
      assetId,
      originalName: file.name,
      purpose: 'asset',
    },
  });

  await env.DB.prepare(
    `
    INSERT INTO tenant_storage_assets (
      id, tenant_id, r2_key, file_name, file_size, file_type, purpose, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, 'asset', ?)
    `,
  )
    .bind(assetId, tenantId, key, safeFileName, file.size, fileType, now)
    .run();

  const payload: UploadSuccess = {
    success: true,
    asset_id: assetId,
    tenant_id: tenantId,
    key,
    file_name: safeFileName,
    file_size: file.size,
    file_type: fileType,
    usage_bytes: finalSnapshot.usedBytes + file.size,
    quota_bytes: finalSnapshot.quotaBytes,
  };

  return Response.json(payload, { status: 201 });
};

function authorizeAdminRequest(request: Request): Response | null {
  const configuredToken = getEnvString('ADMIN_API_TOKEN');
  if (!configuredToken) return null;

  const authorization = request.headers.get('authorization') ?? '';
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() ?? '';

  if (token && constantTimeEqual(token, configuredToken)) {
    return null;
  }

  return json({ success: false, error: 'Unauthorized.' }, 401);
}

function constantTimeEqual(left: string, right: string): boolean {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let diff = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < length; index += 1) {
    diff |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return diff === 0;
}

function parseContentLength(value: string | null): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize('NFKC')
    .replace(/[\\/:*?"<>|#%{}^~[\]`]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 160) || 'aiboux-asset';
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function getEnvString(key: string): string {
  const value = (env as unknown as Record<string, unknown>)[key];
  return typeof value === 'string' ? value.trim() : '';
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
