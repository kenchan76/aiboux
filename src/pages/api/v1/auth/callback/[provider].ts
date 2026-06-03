import type { APIContext, APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { buildSsoCookie, isSafeRedirectPath, parseCookies, signSsoJwt, verifyOAuthState, type OAuthStatePayload } from '../../../../../lib/server/ssoSession';

export const prerender = false;

type ProviderName = 'rakuten' | 'google' | 'microsoft' | 'apple' | 'line' | 'yahoo' | 'x' | 'instagram';

type ProviderConfig = {
  name: ProviderName;
  envPrefix: string;
  tokenEndpoint: string;
  userInfoEndpoint?: string;
  userInfoAuth: 'bearer' | 'query';
  tokenAuth: 'body' | 'basic';
  defaultScopes: string[];
};

type TokenResponse = {
  access_token?: string;
  id_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

type ProviderIdentity = {
  providerUserId: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  avatarUrl: string;
};

type StaffSessionRow = {
  tenant_id: string;
  staff_id: string;
  email: string;
  staff_plan_type: 'free' | 'premium_980';
  is_active: number;
  tenant_status: string;
  tenant_is_active: number;
};

const supportedProviders = ['rakuten', 'google', 'microsoft', 'apple', 'line', 'yahoo', 'x', 'instagram'] as const;
const jwtMaxAgeSeconds = 60 * 60 * 24 * 30;

export const GET: APIRoute = async (context) => {
  try {
    return await handleGet(context);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('OAuth callback failed.', { message });
    return json({ success: false, error: message }, 500);
  }
};

async function handleGet({ params, request }: APIContext): Promise<Response> {
  const requestUrl = new URL(request.url);
  const provider = normalizeProvider(params.provider);

  if (!provider) {
    return json({ success: false, error: 'Unsupported OAuth provider.' }, 400);
  }

  const oauthError = requestUrl.searchParams.get('error');
  if (oauthError) {
    return json({
      success: false,
      error: oauthError,
      error_description: requestUrl.searchParams.get('error_description') ?? '',
    }, 400);
  }

  const code = requestUrl.searchParams.get('code')?.trim() ?? '';
  if (!code) {
    return json({ success: false, error: '`code` is required.' }, 400);
  }

  const ssoSecret = getEnvString('AIBOUX_SSO_JWT_SECRET');
  if (!ssoSecret) {
    return json({ success: false, error: 'AIBOUX_SSO_JWT_SECRET is not configured.' }, 500);
  }

  const config = getProviderConfig(provider);
  if (!config) {
    return json({ success: false, error: `Provider ${provider} is not configured.` }, 500);
  }

  const state = await readOAuthState(requestUrl.searchParams.get('state'), ssoSecret);
  if (requestUrl.searchParams.get('state') && !state) {
    return json({ success: false, error: 'Invalid OAuth state.' }, 400);
  }

  const cookies = parseCookies(request.headers.get('cookie'));
  const codeVerifier = cookies.get(`aiboux_oauth_${provider}_verifier`) ?? '';
  const redirectUri = `${requestUrl.origin}/api/v1/auth/callback/${provider}`;
  const token = await exchangeCodeForToken(config, code, redirectUri, codeVerifier);
  const identity = await resolveProviderIdentity(config, token);

  if (!identity.providerUserId) {
    return json({ success: false, error: 'Provider user id could not be resolved.' }, 502);
  }

  const sessionRow = await resolveOrBindStaff(provider, identity, state);
  if (!sessionRow) {
    return json({
      success: false,
      error: 'This social account is not linked to AIBOUX. Open an owner invitation link first, or ask the owner to bind this account.',
    }, 403);
  }

  const jwt = await signSsoJwt({
    tenant_id: sessionRow.tenant_id,
    staff_id: sessionRow.staff_id,
    staff_plan_type: sessionRow.staff_plan_type,
    email: sessionRow.email,
    provider,
  }, ssoSecret, jwtMaxAgeSeconds);

  const redirectTo = state?.redirect_to && isSafeRedirectPath(state.redirect_to)
    ? state.redirect_to
    : `/shop/admin/dashboard?tenant_id=${encodeURIComponent(sessionRow.tenant_id)}`;
  const response = new Response(null, {
    status: 302,
    headers: {
      location: redirectTo,
      'set-cookie': buildSsoCookie(jwt, requestUrl, jwtMaxAgeSeconds),
      'cache-control': 'no-store',
    },
  });

  response.headers.append(
    'set-cookie',
    `aiboux_oauth_${provider}_verifier=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
  );

  return response;
}

async function exchangeCodeForToken(config: ProviderConfig, code: string, redirectUri: string, codeVerifier: string): Promise<TokenResponse> {
  const clientId = getEnvString(`${config.envPrefix}_CLIENT_ID`);
  const clientSecret = getEnvString(`${config.envPrefix}_CLIENT_SECRET`);
  if (!clientId || !clientSecret) {
    throw new Error(`${config.envPrefix}_CLIENT_ID and ${config.envPrefix}_CLIENT_SECRET are required.`);
  }

  const body = new URLSearchParams();
  body.set('grant_type', 'authorization_code');
  body.set('code', code);
  body.set('redirect_uri', redirectUri);
  if (config.tokenAuth === 'body') {
    body.set('client_id', clientId);
    body.set('client_secret', clientSecret);
  }
  if (codeVerifier) {
    body.set('code_verifier', codeVerifier);
  }

  const headers: Record<string, string> = {
    'content-type': 'application/x-www-form-urlencoded',
    accept: 'application/json',
  };
  if (config.tokenAuth === 'basic') {
    headers.authorization = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
  }

  const response = await fetch(config.tokenEndpoint, { method: 'POST', headers, body });
  const jsonBody = await response.json()
    .then((value): TokenResponse => (isRecord(value) ? value : {}))
    .catch((): TokenResponse => ({}));

  if (!response.ok || jsonBody.error) {
    throw new Error(jsonBody.error_description || jsonBody.error || `Token exchange failed for ${config.name}.`);
  }

  return jsonBody;
}

async function resolveProviderIdentity(config: ProviderConfig, token: TokenResponse): Promise<ProviderIdentity> {
  const idTokenPayload = decodeJwtPayload(token.id_token);
  const userInfo = config.userInfoEndpoint && token.access_token
    ? await fetchUserInfo(config, token.access_token)
    : {};
  const merged = { ...idTokenPayload, ...userInfo };

  const providerUserId = firstString(
    merged.sub,
    merged.user_id,
    merged.userId,
    merged.id,
    isRecord(merged.data) ? merged.data.id : undefined,
  );
  const email = firstString(merged.email, merged.emailAddress, merged.preferred_username);
  const emailVerified = normalizeEmailVerified(merged.email_verified ?? merged.emailVerified ?? merged.verified_email);
  const displayName = firstString(
    merged.name,
    merged.displayName,
    merged.nickname,
    merged.username,
    isRecord(merged.data) ? merged.data.username : undefined,
  );
  const avatarUrl = firstString(
    merged.picture,
    merged.pictureUrl,
    merged.avatar_url,
    merged.profile_image_url,
    isRecord(merged.data) ? merged.data.profile_image_url : undefined,
  );

  return {
    providerUserId,
    email,
    emailVerified,
    displayName,
    avatarUrl,
  };
}

async function fetchUserInfo(config: ProviderConfig, accessToken: string): Promise<Record<string, unknown>> {
  const url = new URL(config.userInfoEndpoint ?? '');
  const headers: Record<string, string> = { accept: 'application/json' };
  if (config.userInfoAuth === 'bearer') {
    headers.authorization = `Bearer ${accessToken}`;
  } else {
    url.searchParams.set('access_token', accessToken);
  }

  const response = await fetch(url, { headers });
  const body = await response.json()
    .then((value): Record<string, unknown> => (isRecord(value) ? value : {}))
    .catch((): Record<string, unknown> => ({}));
  if (!response.ok) {
    throw new Error(firstString(body.error_description, body.error, body.message) || `UserInfo fetch failed for ${config.name}.`);
  }
  return body;
}

async function resolveOrBindStaff(provider: ProviderName, identity: ProviderIdentity, state: OAuthStatePayload | null): Promise<StaffSessionRow | null> {
  const existing = await findStaffBySocialIdentity(provider, identity.providerUserId);
  if (existing) return existing;

  const invitedStaff = await resolveInvitedStaff(state, identity);
  if (!invitedStaff) return null;

  const identityId = `soc_${crypto.randomUUID()}`;
  await env.DB.prepare(
    `
    INSERT OR IGNORE INTO b2b_staff_social_identities (
      id,
      tenant_id,
      staff_id,
      provider_name,
      provider_user_id
    )
    VALUES (?, ?, ?, ?, ?)
    `,
  )
    .bind(identityId, invitedStaff.tenant_id, invitedStaff.staff_id, provider, identity.providerUserId)
    .run();

  return findStaffBySocialIdentity(provider, identity.providerUserId);
}

async function findStaffBySocialIdentity(provider: ProviderName, providerUserId: string): Promise<StaffSessionRow | null> {
  return env.DB.prepare(
    `
    SELECT
      identities.tenant_id,
      identities.staff_id,
      staff.email,
      staff.staff_plan_type,
      staff.is_active,
      tenants.status AS tenant_status,
      tenants.is_active AS tenant_is_active
    FROM b2b_staff_social_identities identities
    INNER JOIN b2b_staff_accounts staff
      ON staff.id = identities.staff_id
      AND staff.tenant_id = identities.tenant_id
    INNER JOIN tenants
      ON tenants.id = identities.tenant_id
    WHERE identities.provider_name = ?
      AND identities.provider_user_id = ?
      AND staff.is_active = 1
      AND tenants.status = 'active'
      AND tenants.is_active = 1
    LIMIT 1
    `,
  )
    .bind(provider, providerUserId)
    .first<StaffSessionRow>();
}

async function resolveInvitedStaff(state: OAuthStatePayload | null, identity: ProviderIdentity): Promise<StaffSessionRow | null> {
  if (state?.staff_id && state.tenant_id) {
    const row = await findStaffById(state.tenant_id, state.staff_id);
    if (row) return row;
  }

  if (state?.tenant_id && identity.email) {
    const existingInTenant = await findStaffByTenantAndEmail(state.tenant_id, identity.email);
    if (existingInTenant) return existingInTenant;

    const tenant = await env.DB.prepare(
      "SELECT id FROM tenants WHERE id = ? AND status = 'active' AND is_active = 1 LIMIT 1",
    )
      .bind(state.tenant_id)
      .first<{ id: string }>();
    if (!tenant) return null;

    const staffId = `staff_${crypto.randomUUID()}`;
    await env.DB.prepare(
      `
      INSERT INTO b2b_staff_accounts (
        id,
        tenant_id,
        email,
        password_hash,
        staff_plan_type,
        is_active
      )
      VALUES (?, ?, ?, ?, 'free', 1)
      `,
    )
      .bind(staffId, state.tenant_id, identity.email.toLowerCase(), `oauth_only:${crypto.randomUUID()}`)
      .run();
    return findStaffById(state.tenant_id, staffId);
  }

  if (identity.email && identity.emailVerified) {
    return env.DB.prepare(
      `
      SELECT
        staff.tenant_id,
        staff.id AS staff_id,
        staff.email,
        staff.staff_plan_type,
        staff.is_active,
        tenants.status AS tenant_status,
        tenants.is_active AS tenant_is_active
      FROM b2b_staff_accounts staff
      INNER JOIN tenants
        ON tenants.id = staff.tenant_id
      WHERE lower(staff.email) = lower(?)
        AND staff.is_active = 1
        AND tenants.status = 'active'
        AND tenants.is_active = 1
      LIMIT 1
      `,
    )
      .bind(identity.email)
      .first<StaffSessionRow>();
  }

  return null;
}

async function findStaffById(tenantId: string, staffId: string): Promise<StaffSessionRow | null> {
  return env.DB.prepare(
    `
    SELECT
      staff.tenant_id,
      staff.id AS staff_id,
      staff.email,
      staff.staff_plan_type,
      staff.is_active,
      tenants.status AS tenant_status,
      tenants.is_active AS tenant_is_active
    FROM b2b_staff_accounts staff
    INNER JOIN tenants
      ON tenants.id = staff.tenant_id
    WHERE staff.tenant_id = ?
      AND staff.id = ?
      AND staff.is_active = 1
      AND tenants.status = 'active'
      AND tenants.is_active = 1
    LIMIT 1
    `,
  )
    .bind(tenantId, staffId)
    .first<StaffSessionRow>();
}

async function findStaffByTenantAndEmail(tenantId: string, email: string): Promise<StaffSessionRow | null> {
  return env.DB.prepare(
    `
    SELECT
      staff.tenant_id,
      staff.id AS staff_id,
      staff.email,
      staff.staff_plan_type,
      staff.is_active,
      tenants.status AS tenant_status,
      tenants.is_active AS tenant_is_active
    FROM b2b_staff_accounts staff
    INNER JOIN tenants
      ON tenants.id = staff.tenant_id
    WHERE staff.tenant_id = ?
      AND lower(staff.email) = lower(?)
      AND staff.is_active = 1
      AND tenants.status = 'active'
      AND tenants.is_active = 1
    LIMIT 1
    `,
  )
    .bind(tenantId, email)
    .first<StaffSessionRow>();
}

async function readOAuthState(value: string | null, secret: string): Promise<OAuthStatePayload | null> {
  const state = value?.trim() ?? '';
  if (!state) return null;
  return verifyOAuthState(state, secret);
}

function getProviderConfig(provider: ProviderName): ProviderConfig | null {
  const configs: Record<ProviderName, ProviderConfig> = {
    google: {
      name: 'google',
      envPrefix: 'GOOGLE',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      userInfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
      userInfoAuth: 'bearer',
      tokenAuth: 'body',
      defaultScopes: ['openid', 'email', 'profile'],
    },
    microsoft: {
      name: 'microsoft',
      envPrefix: 'MICROSOFT',
      tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      userInfoEndpoint: 'https://graph.microsoft.com/oidc/userinfo',
      userInfoAuth: 'bearer',
      tokenAuth: 'body',
      defaultScopes: ['openid', 'email', 'profile'],
    },
    apple: {
      name: 'apple',
      envPrefix: 'APPLE',
      tokenEndpoint: 'https://appleid.apple.com/auth/token',
      userInfoAuth: 'bearer',
      tokenAuth: 'body',
      defaultScopes: ['openid', 'email', 'name'],
    },
    line: {
      name: 'line',
      envPrefix: 'LINE_LOGIN',
      tokenEndpoint: 'https://api.line.me/oauth2/v2.1/token',
      userInfoEndpoint: 'https://api.line.me/v2/profile',
      userInfoAuth: 'bearer',
      tokenAuth: 'body',
      defaultScopes: ['openid', 'profile', 'email'],
    },
    yahoo: {
      name: 'yahoo',
      envPrefix: 'YAHOO',
      tokenEndpoint: 'https://auth.login.yahoo.co.jp/yconnect/v2/token',
      userInfoEndpoint: 'https://userinfo.yahooapis.jp/yconnect/v2/attribute',
      userInfoAuth: 'bearer',
      tokenAuth: 'body',
      defaultScopes: ['openid', 'email', 'profile'],
    },
    x: {
      name: 'x',
      envPrefix: 'X',
      tokenEndpoint: 'https://api.x.com/2/oauth2/token',
      userInfoEndpoint: 'https://api.x.com/2/users/me?user.fields=profile_image_url,verified',
      userInfoAuth: 'bearer',
      tokenAuth: 'basic',
      defaultScopes: ['users.read', 'tweet.read', 'offline.access'],
    },
    instagram: {
      name: 'instagram',
      envPrefix: 'INSTAGRAM',
      tokenEndpoint: 'https://api.instagram.com/oauth/access_token',
      userInfoEndpoint: 'https://graph.instagram.com/me?fields=id,username,account_type',
      userInfoAuth: 'query',
      tokenAuth: 'body',
      defaultScopes: ['user_profile'],
    },
    rakuten: {
      name: 'rakuten',
      envPrefix: 'RAKUTEN',
      tokenEndpoint: getEnvString('RAKUTEN_TOKEN_ENDPOINT'),
      userInfoEndpoint: getEnvString('RAKUTEN_USERINFO_ENDPOINT'),
      userInfoAuth: 'bearer',
      tokenAuth: 'body',
      defaultScopes: ['openid', 'profile', 'email'],
    },
  };

  const config = configs[provider];
  if (provider === 'rakuten' && (!config.tokenEndpoint || !config.userInfoEndpoint)) {
    return null;
  }
  return config;
}

function normalizeProvider(value: unknown): ProviderName | null {
  if (typeof value !== 'string') return null;
  return supportedProviders.includes(value as ProviderName) ? value as ProviderName : null;
}

function decodeJwtPayload(token: string | undefined): Record<string, unknown> {
  if (!token) return {};
  const parts = token.split('.');
  if (parts.length < 2) return {};
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1]))) as Record<string, unknown>;
  } catch {
    return {};
  }
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

function firstString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function normalizeEmailVerified(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1';
  if (typeof value === 'number') return value === 1;
  return false;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getEnvString(key: string): string {
  const value = (env as unknown as Record<string, unknown>)[key];
  return typeof value === 'string' ? value.trim() : '';
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
