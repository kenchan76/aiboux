export type SsoStaffPlanType = 'free' | 'premium_980';

export type SsoSessionPayload = {
  tenant_id: string;
  staff_id: string;
  staff_plan_type: SsoStaffPlanType;
  email: string;
  provider: string;
  iat: number;
  exp: number;
};

export type OAuthStatePayload = {
  tenant_id?: string;
  staff_id?: string;
  redirect_to?: string;
  nonce?: string;
  iat?: number;
  exp?: number;
};

const textEncoder = new TextEncoder();

export async function signSsoJwt(payload: Omit<SsoSessionPayload, 'iat' | 'exp'>, secret: string, maxAgeSeconds = 60 * 60 * 24 * 30): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const body: SsoSessionPayload = {
    ...payload,
    iat: now,
    exp: now + maxAgeSeconds,
  };
  return signJwt(header, body, secret);
}

export async function verifySsoJwt(token: string, secret: string): Promise<SsoSessionPayload | null> {
  const payload = await verifyJwt<SsoSessionPayload>(token, secret);
  if (!payload) return null;
  if (!payload.tenant_id || !payload.staff_id || !payload.email || !payload.provider) return null;
  if (payload.staff_plan_type !== 'free' && payload.staff_plan_type !== 'premium_980') return null;
  return payload;
}

export async function verifyOAuthState(state: string, secret: string): Promise<OAuthStatePayload | null> {
  const payload = await verifyJwt<OAuthStatePayload>(state, secret);
  if (!payload) return null;
  if (payload.redirect_to && !isSafeRedirectPath(payload.redirect_to)) return null;
  return payload;
}

export function buildSsoCookie(jwt: string, requestUrl: URL, maxAgeSeconds = 60 * 60 * 24 * 30): string {
  const host = requestUrl.hostname.toLowerCase();
  const domain = host === 'aiboux.com' || host.endsWith('.aiboux.com') ? ' Domain=.aiboux.com;' : '';
  return [
    `aiboux_session=${jwt}`,
    'Path=/',
    domain.trim(),
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ]
    .filter(Boolean)
    .join('; ');
}

export function parseCookies(header: string | null): Map<string, string> {
  const cookies = new Map<string, string>();
  if (!header) return cookies;

  for (const pair of header.split(';')) {
    const index = pair.indexOf('=');
    if (index <= 0) continue;
    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    if (key) cookies.set(key, decodeURIComponent(value));
  }

  return cookies;
}

export function isSafeRedirectPath(value: string): boolean {
  return value.startsWith('/') && !value.startsWith('//') && !value.includes('\\');
}

async function signJwt(header: Record<string, unknown>, payload: Record<string, unknown>, secret: string): Promise<string> {
  const encodedHeader = base64UrlEncode(textEncoder.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(textEncoder.encode(JSON.stringify(payload)));
  const unsigned = `${encodedHeader}.${encodedPayload}`;
  const signature = await hmacSha256(unsigned, secret);
  return `${unsigned}.${base64UrlEncode(signature)}`;
}

async function verifyJwt<T extends Record<string, unknown>>(token: string, secret: string): Promise<T | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const unsigned = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = base64UrlEncode(await hmacSha256(unsigned, secret));

  if (!constantTimeEqual(encodedSignature, expectedSignature)) return null;

  const header = parseBase64UrlJson<Record<string, unknown>>(encodedHeader);
  if (!header || header.alg !== 'HS256' || header.typ !== 'JWT') return null;

  const payload = parseBase64UrlJson<T>(encodedPayload);
  if (!payload) return null;

  const now = Math.floor(Date.now() / 1000);
  const exp = Number(payload.exp ?? 0);
  if (!Number.isFinite(exp) || exp <= now) return null;

  return payload;
}

async function hmacSha256(value: string, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(value));
  return new Uint8Array(signature);
}

function parseBase64UrlJson<T>(value: string): T | null {
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlDecode(value))) as T;
  } catch {
    return null;
  }
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function constantTimeEqual(left: string, right: string): boolean {
  const leftBytes = textEncoder.encode(left);
  const rightBytes = textEncoder.encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let diff = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < length; index += 1) {
    diff |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return diff === 0;
}
