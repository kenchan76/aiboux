export const prerender = false;

import { env } from 'cloudflare:workers';

interface UploadResponse {
  success: true;
  id: string;
  downloadCode: string;
  downloadUrl: string;
  fileName: string;
  originalSize: number;
  storedSize: number;
  fileType: string;
  retentionDays: number;
  expiresAt: string;
}

const DEFAULT_RETENTION_DAYS = 7;
const ALLOWED_RETENTION_DAYS = [7, 30, 90, 180] as const;
type AllowedRetentionDays = (typeof ALLOWED_RETENTION_DAYS)[number];

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize('NFKC')
    .replace(/[\\/:*?"<>|#%{}^~[\]`]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 160) || 'aiboux-file';
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function createDownloadCode(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

function parseRetentionDays(value: FormDataEntryValue | null): AllowedRetentionDays {
  const parsed = Number.parseInt(String(value ?? ''), 10);

  return ALLOWED_RETENTION_DAYS.includes(parsed as AllowedRetentionDays)
    ? (parsed as AllowedRetentionDays)
    : DEFAULT_RETENTION_DAYS;
}

function getPublicBaseUrl(request: Request): string {
  const configured = env.AIBOUX_PUBLIC_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  return new URL(request.url).origin;
}

export async function POST({ request }: { request: Request }): Promise<Response> {
  const formData = await request.formData();
  const file = formData.get('file');
  const originalSizeValue = Number(formData.get('originalSize') ?? 0);
  const retentionDays = parseRetentionDays(formData.get('retentionDays'));

  if (!(file instanceof File)) {
    return Response.json({ success: false, error: 'file is required.' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const downloadCode = createDownloadCode();
  const safeFileName = sanitizeFileName(file.name);
  const fileType = file.type || 'application/octet-stream';
  const r2Key = `public_transfers/${id}/${safeFileName}`;
  const expiresAt = new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000);

  await env.STORAGE.put(r2Key, file.stream(), {
    httpMetadata: {
      contentType: fileType,
      contentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(safeFileName)}`,
    },
    customMetadata: {
      transferId: id,
      downloadCode,
      originalSize: Number.isFinite(originalSizeValue) ? String(originalSizeValue) : String(file.size),
      retentionDays: String(retentionDays),
    },
  });

  await env.DB.prepare(
    `INSERT INTO public_file_transfers (
       id, download_code, file_name, r2_key, file_size, file_type, download_count, expires_at
     )
     VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
  )
    .bind(id, downloadCode, safeFileName, r2Key, file.size, fileType, expiresAt.toISOString())
    .run();

  const downloadUrl = `${getPublicBaseUrl(request)}/file/download/${encodeURIComponent(downloadCode)}`;
  const payload: UploadResponse = {
    success: true,
    id,
    downloadCode,
    downloadUrl,
    fileName: safeFileName,
    originalSize: Number.isFinite(originalSizeValue) && originalSizeValue > 0 ? originalSizeValue : file.size,
    storedSize: file.size,
    fileType,
    retentionDays,
    expiresAt: expiresAt.toISOString(),
  };

  return Response.json(payload, { status: 201 });
}
