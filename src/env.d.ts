/// <reference path="../.astro/types.d.ts" />
/// <reference types="@cloudflare/workers-types" />

declare module '*?raw' {
  const content: string;
  export default content;
}

declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    STORAGE: R2Bucket;
    SHOP_STORAGE: R2Bucket;
    SHOP_FEED_SYNC_QUEUE: Queue;
    EMAIL: SendEmail;
    AI: Ai;
    CF_VERSION_METADATA?: WorkerVersionMetadata;
    AIBOUX_PUBLIC_URL: string;
    DEFAULT_FROM_EMAIL: string;
    MAIL_RETENTION_FREE_DAYS: string;
    MAIL_RETENTION_STANDARD_DAYS: string;
    MAIL_RETENTION_PREMIUM_DAYS: string;
    MAX_FREE_MAIL_ADDRESSES: string;
    MAX_STANDARD_MAIL_ADDRESSES: string;
    GEMINI_MODEL?: string;
    WORKERS_AI_TEXT_MODEL?: string;
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
    STRIPE_PUBLISHABLE_KEY?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    KOMOJU_SECRET_KEY?: string;
    ADMIN_API_TOKEN?: string;
    GEMINI_API_KEY?: string;
    LINE_CHANNEL_ACCESS_TOKEN?: string;
    LINE_CHANNEL_SECRET?: string;
    AIBOUX_SSO_JWT_SECRET?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    MICROSOFT_CLIENT_ID?: string;
    MICROSOFT_CLIENT_SECRET?: string;
    APPLE_CLIENT_ID?: string;
    APPLE_CLIENT_SECRET?: string;
    LINE_LOGIN_CLIENT_ID?: string;
    LINE_LOGIN_CLIENT_SECRET?: string;
    YAHOO_CLIENT_ID?: string;
    YAHOO_CLIENT_SECRET?: string;
    X_CLIENT_ID?: string;
    X_CLIENT_SECRET?: string;
    INSTAGRAM_CLIENT_ID?: string;
    INSTAGRAM_CLIENT_SECRET?: string;
    RAKUTEN_CLIENT_ID?: string;
    RAKUTEN_CLIENT_SECRET?: string;
    RAKUTEN_TOKEN_ENDPOINT?: string;
    RAKUTEN_USERINFO_ENDPOINT?: string;
    GOOGLE_CONTENT_API_KEY?: string;
    BING_MERCHANT_API_KEY?: string;
    CLOUDFLARE_ZONE_ID?: string;
    CLOUDFLARE_API_TOKEN?: string;
  }
}

declare namespace App {
  interface Locals {
    readonly runtime?: {
      env: Cloudflare.Env;
    };
    tenantId?: string;
    tenant?: {
      id: string;
      slug: string;
      name: string;
      hostName: string | null;
    };
    sso?: {
      tenantId: string;
      staffId: string;
      email: string;
      staffPlanType: 'free' | 'premium_980';
      provider: string;
    };
    security: {
      host: string;
      sessionCookieName: string;
      sessionCookieOptions: {
        httpOnly: true;
        secure: true;
        sameSite: 'lax';
        path: '/';
        maxAge: number;
      };
    };
  }
}
