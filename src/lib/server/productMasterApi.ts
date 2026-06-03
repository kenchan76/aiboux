import { env } from "cloudflare:workers";
import { resolveTenantFromRequest, tenantJsonError, TenantResolutionError } from "@/lib/server/tenantContext";

export type ApiJson = Record<string, unknown>;

export class ProductApiError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ProductApiError";
    this.status = status;
  }
}

export async function withTenant(request: Request) {
  return resolveTenantFromRequest(request);
}

export function productJson(data: ApiJson, init?: ResponseInit): Response {
  return Response.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init?.headers ?? {}),
    },
  });
}

export function productError(error: unknown): Response {
  if (error instanceof TenantResolutionError) return tenantJsonError(error);
  if (error instanceof ProductApiError) return productJson({ success: false, error: error.message }, { status: error.status });
  return productJson({ success: false, error: error instanceof Error ? error.message : "Product master API failed." }, { status: 500 });
}

export async function readJsonBody<T extends Record<string, unknown>>(request: Request): Promise<T> {
  const text = await request.text();
  if (!text.trim()) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ProductApiError("JSON body is invalid.", 400);
  }
}

export function textValue(value: unknown, fieldName: string, options: { required?: boolean; maxLength?: number } = {}): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (options.required && !text) throw new ProductApiError(`${fieldName} is required.`, 400);
  if (options.maxLength && text.length > options.maxLength) throw new ProductApiError(`${fieldName} is too long.`, 400);
  return text;
}

export function numberValue(value: unknown, fieldName: string, options: { min?: number; defaultValue?: number } = {}): number {
  const raw = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  const number = Number.isFinite(raw) ? raw : options.defaultValue;
  if (number === undefined) throw new ProductApiError(`${fieldName} must be a number.`, 400);
  if (options.min !== undefined && number < options.min) throw new ProductApiError(`${fieldName} must be greater than or equal to ${options.min}.`, 400);
  return number;
}

export function booleanValue(value: unknown, defaultValue = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") return ["1", "true", "yes", "on"].includes(value.toLowerCase());
  return defaultValue;
}

export function safeLimit(value: string | null, fallback = 50, max = 200): number {
  const limit = Number(value ?? fallback);
  if (!Number.isFinite(limit)) return fallback;
  return Math.min(Math.max(Math.trunc(limit), 1), max);
}

export function safeOffset(value: string | null): number {
  const offset = Number(value ?? 0);
  if (!Number.isFinite(offset)) return 0;
  return Math.max(Math.trunc(offset), 0);
}

export function id(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function requireConfirmation(body: Record<string, unknown>, message: string): void {
  if (body.confirm === true || body.confirm === "true") return;
  throw new ProductApiError(message, 409);
}

export async function auditLog(input: {
  tenantId: string;
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  requestId?: string;
}) {
  await env.DB.prepare(
    `INSERT INTO audit_logs (id, tenant_id, actor_id, action, entity_type, entity_id, before_json, after_json, request_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id("aud"),
      input.tenantId,
      input.actorId ?? null,
      input.action,
      input.entityType,
      input.entityId,
      JSON.stringify(input.before ?? {}),
      JSON.stringify(input.after ?? {}),
      input.requestId ?? null,
    )
    .run();
}

export function toSqlLike(query: string): string {
  return `%${query.replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
}
