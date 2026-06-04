import { env } from "cloudflare:workers";
import { ProductApiError } from "@/lib/server/productMasterApi";

export const SUBSCRIPTION_SCHEMA_PENDING_CODE = "SUBSCRIPTION_SCHEMA_PENDING";
export const SUBSCRIPTION_SCHEMA_PENDING_MESSAGE = "定期購入DB migrationが未適用です。管理者がD1 migrationを適用してください。";

export class SubscriptionSchemaPendingError extends ProductApiError {
  readonly code = SUBSCRIPTION_SCHEMA_PENDING_CODE;

  constructor() {
    super(SUBSCRIPTION_SCHEMA_PENDING_MESSAGE, 503);
    this.name = "SubscriptionSchemaPendingError";
  }
}

export type SubscriptionIntervalUnit = "day" | "week" | "month";
export type SubscriptionPlanStatus = "active" | "hidden" | "archived";
export type ShopSubscriptionStatus = "active" | "pending_payment_setup" | "paused" | "canceled" | "payment_failed" | "completed";

export type ShopSubscriptionPlan = {
  id: string;
  tenantId: string;
  productId: string;
  name: string;
  intervalUnit: SubscriptionIntervalUnit;
  intervalCount: number;
  price: number;
  discountRate: number;
  firstOrderPrice: number | null;
  minimumCycles: number;
  canSkip: boolean;
  canPause: boolean;
  canCancel: boolean;
  status: SubscriptionPlanStatus;
  noticeText: string;
  cancellationPolicy: string;
  updatedAt: number;
};

export type ShopSubscription = {
  id: string;
  tenantId: string;
  customerName: string;
  customerEmail: string;
  status: ShopSubscriptionStatus;
  planId: string;
  productId: string;
  productName: string;
  planName: string;
  quantity: number;
  unitPrice: number;
  intervalUnit: SubscriptionIntervalUnit;
  intervalCount: number;
  nextBillingAt: number | null;
  nextDeliveryAt: number | null;
  paymentProvider: string | null;
  paymentSubscriptionId: string | null;
  memo: string;
  createdAt: number;
  updatedAt: number;
};

type PlanInput = {
  id?: unknown;
  name?: unknown;
  intervalUnit?: unknown;
  interval_unit?: unknown;
  intervalCount?: unknown;
  interval_count?: unknown;
  price?: unknown;
  discountRate?: unknown;
  discount_rate?: unknown;
  firstOrderPrice?: unknown;
  first_order_price?: unknown;
  minimumCycles?: unknown;
  minimum_cycles?: unknown;
  canSkip?: unknown;
  can_skip?: unknown;
  canPause?: unknown;
  can_pause?: unknown;
  canCancel?: unknown;
  can_cancel?: unknown;
  status?: unknown;
  noticeText?: unknown;
  notice_text?: unknown;
  cancellationPolicy?: unknown;
  cancellation_policy?: unknown;
};

type PlanRow = {
  id: string;
  tenant_id: string;
  product_id: string;
  name: string;
  interval_unit: string;
  interval_count: number;
  price: number;
  discount_rate: number;
  first_order_price: number | null;
  minimum_cycles: number;
  can_skip: number;
  can_pause: number;
  can_cancel: number;
  status: string;
  notice_text: string;
  cancellation_policy: string;
  updated_at: number;
};

type SubscriptionRow = {
  id: string;
  tenant_id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  plan_id: string;
  product_id: string;
  product_name: string | null;
  plan_name: string | null;
  quantity: number;
  unit_price: number;
  interval_unit: string;
  interval_count: number;
  next_billing_at: number | null;
  next_delivery_at: number | null;
  payment_provider: string | null;
  payment_subscription_id: string | null;
  memo: string | null;
  created_at: number;
  updated_at: number;
};

export async function listShopSubscriptionPlans(input: {
  tenantId: string;
  productId?: string;
  activeOnly?: boolean;
}): Promise<ShopSubscriptionPlan[]> {
  const productClause = input.productId ? "AND product_id = ?" : "";
  const activeClause = input.activeOnly ? "AND status = 'active' AND deleted_at IS NULL" : "AND deleted_at IS NULL";
  const statement = env.DB.prepare(
    `
    SELECT *
    FROM shop_subscription_plans
    WHERE tenant_id = ?
      ${productClause}
      ${activeClause}
    ORDER BY interval_count ASC, interval_unit ASC, price ASC, updated_at DESC
    `,
  );
  const result = await withSubscriptionSchemaGuard(() => input.productId
    ? statement.bind(input.tenantId, input.productId).all<PlanRow>()
    : statement.bind(input.tenantId).all<PlanRow>());
  return (result.results ?? []).map(mapPlanRow);
}

export async function replaceShopSubscriptionPlans(input: {
  tenantId: string;
  productId: string;
  plans: unknown;
  actorId?: string | null;
}): Promise<ShopSubscriptionPlan[]> {
  if (!Array.isArray(input.plans)) return listShopSubscriptionPlans({ tenantId: input.tenantId, productId: input.productId });

  const nextPlans = input.plans.map((plan, index) => normalizePlanInput(plan, input.tenantId, input.productId, index)).slice(0, 12);
  const now = Date.now();
  const ids = nextPlans.map((plan) => plan.id);

  if (!nextPlans.length) {
    await withSubscriptionSchemaGuard(() => env.DB.prepare("UPDATE shop_subscription_plans SET deleted_at = ?, updated_by = ?, updated_at = ? WHERE tenant_id = ? AND product_id = ? AND deleted_at IS NULL")
      .bind(now, input.actorId ?? null, now, input.tenantId, input.productId)
      .run());
    return [];
  }

  for (const plan of nextPlans) {
    await withSubscriptionSchemaGuard(() => env.DB.prepare(
      `
      INSERT INTO shop_subscription_plans (
        id, tenant_id, product_id, name, interval_unit, interval_count, price,
        discount_rate, first_order_price, minimum_cycles, can_skip, can_pause,
        can_cancel, status, notice_text, cancellation_policy, created_by,
        updated_by, created_at, updated_at, deleted_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        interval_unit = excluded.interval_unit,
        interval_count = excluded.interval_count,
        price = excluded.price,
        discount_rate = excluded.discount_rate,
        first_order_price = excluded.first_order_price,
        minimum_cycles = excluded.minimum_cycles,
        can_skip = excluded.can_skip,
        can_pause = excluded.can_pause,
        can_cancel = excluded.can_cancel,
        status = excluded.status,
        notice_text = excluded.notice_text,
        cancellation_policy = excluded.cancellation_policy,
        updated_by = excluded.updated_by,
        updated_at = excluded.updated_at,
        deleted_at = NULL
      `,
    )
      .bind(
        plan.id,
        input.tenantId,
        input.productId,
        plan.name,
        plan.intervalUnit,
        plan.intervalCount,
        plan.price,
        plan.discountRate,
        plan.firstOrderPrice,
        plan.minimumCycles,
        plan.canSkip ? 1 : 0,
        plan.canPause ? 1 : 0,
        plan.canCancel ? 1 : 0,
        plan.status,
        plan.noticeText,
        plan.cancellationPolicy,
        input.actorId ?? null,
        input.actorId ?? null,
        now,
        now,
      )
      .run());
  }

  const placeholders = ids.map(() => "?").join(",");
  await withSubscriptionSchemaGuard(() => env.DB.prepare(
    `
    UPDATE shop_subscription_plans
    SET deleted_at = ?, updated_by = ?, updated_at = ?
    WHERE tenant_id = ?
      AND product_id = ?
      AND deleted_at IS NULL
      AND id NOT IN (${placeholders})
    `,
  )
    .bind(now, input.actorId ?? null, now, input.tenantId, input.productId, ...ids)
    .run());

  return listShopSubscriptionPlans({ tenantId: input.tenantId, productId: input.productId });
}

export async function listShopSubscriptions(tenantId: string): Promise<ShopSubscription[]> {
  const result = await withSubscriptionSchemaGuard(() => env.DB.prepare(
    `
    SELECT
      s.*,
      sp.display_name AS product_name,
      plan.name AS plan_name
    FROM shop_subscriptions s
    LEFT JOIN shop_products sp
      ON sp.tenant_id = s.tenant_id
     AND sp.id = s.product_id
    LEFT JOIN shop_subscription_plans plan
      ON plan.tenant_id = s.tenant_id
     AND plan.id = s.plan_id
    WHERE s.tenant_id = ?
    ORDER BY s.updated_at DESC
    LIMIT 200
    `,
  )
    .bind(tenantId)
    .all<SubscriptionRow>());
  return (result.results ?? []).map(mapSubscriptionRow);
}

export async function changeShopSubscriptionStatus(input: {
  tenantId: string;
  subscriptionId: string;
  action: "pause" | "resume" | "skip" | "cancel";
}): Promise<ShopSubscription> {
  const now = Date.now();
  const next = input.action === "resume" ? "active" : input.action === "cancel" ? "canceled" : input.action === "pause" ? "paused" : null;
  if (next) {
    await withSubscriptionSchemaGuard(() => env.DB.prepare(
      `
      UPDATE shop_subscriptions
      SET status = ?,
          paused_at = CASE WHEN ? = 'paused' THEN ? ELSE paused_at END,
          canceled_at = CASE WHEN ? = 'canceled' THEN ? ELSE canceled_at END,
          updated_at = ?
      WHERE tenant_id = ? AND id = ?
      `,
    )
      .bind(next, next, now, next, now, now, input.tenantId, input.subscriptionId)
      .run());
  }

  await withSubscriptionSchemaGuard(() => env.DB.prepare(
    "INSERT INTO shop_subscription_events (id, tenant_id, subscription_id, event_type, payload_json, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(`subevt_${crypto.randomUUID()}`, input.tenantId, input.subscriptionId, `subscription.${input.action}`, JSON.stringify({ action: input.action }), now)
    .run());

  const rows = await listShopSubscriptions(input.tenantId);
  const subscription = rows.find((row) => row.id === input.subscriptionId);
  if (!subscription) throw new ProductApiError("Subscription was not found.", 404);
  return subscription;
}

export async function createPendingSubscription(input: {
  tenantId: string;
  productId: string;
  planId: string;
  quantity: number;
  customerName?: string;
  customerEmail?: string;
}): Promise<{ subscription: ShopSubscription; paymentReady: boolean; paymentReason: string }> {
  const plan = (await listShopSubscriptionPlans({ tenantId: input.tenantId, productId: input.productId, activeOnly: true }))
    .find((candidate) => candidate.id === input.planId);
  if (!plan) throw new ProductApiError("Subscription plan was not found.", 404);

  const payment = await getSubscriptionPaymentReadiness(input.tenantId);
  if (!payment.ready) {
    return {
      subscription: await insertSubscription({ ...input, plan, status: "pending_payment_setup", paymentProvider: null, paymentSubscriptionId: null }),
      paymentReady: false,
      paymentReason: payment.reason,
    };
  }

  return {
    subscription: await insertSubscription({ ...input, plan, status: "pending_payment_setup", paymentProvider: "stripe", paymentSubscriptionId: null }),
    paymentReady: false,
    paymentReason: "Provider subscription creation is not implemented in this WIP. Do not claim payment success.",
  };
}

async function insertSubscription(input: {
  tenantId: string;
  productId: string;
  planId: string;
  quantity: number;
  customerName?: string;
  customerEmail?: string;
  plan: ShopSubscriptionPlan;
  status: ShopSubscriptionStatus;
  paymentProvider: string | null;
  paymentSubscriptionId: string | null;
}): Promise<ShopSubscription> {
  const now = Date.now();
  const subscriptionId = `sub_${crypto.randomUUID()}`;
  const nextDate = now + intervalToMs(input.plan.intervalUnit, input.plan.intervalCount);
  await withSubscriptionSchemaGuard(() => env.DB.prepare(
    `
    INSERT INTO shop_subscriptions (
      id, tenant_id, customer_name, customer_email, status, plan_id, product_id,
      quantity, unit_price, interval_unit, interval_count, next_billing_at,
      next_delivery_at, payment_provider, payment_subscription_id, memo, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .bind(
      subscriptionId,
      input.tenantId,
      input.customerName?.trim() || "",
      input.customerEmail?.trim() || "",
      input.status,
      input.planId,
      input.productId,
      Math.max(Math.trunc(input.quantity), 1),
      input.plan.price,
      input.plan.intervalUnit,
      input.plan.intervalCount,
      nextDate,
      nextDate,
      input.paymentProvider,
      input.paymentSubscriptionId,
      "定期決済設定が完了するまで申込み確定にしません。",
      now,
      now,
    )
    .run());

  await withSubscriptionSchemaGuard(() => env.DB.prepare(
    "INSERT INTO shop_subscription_events (id, tenant_id, subscription_id, event_type, payload_json, created_at) VALUES (?, ?, ?, 'subscription.created_pending', ?, ?)",
  )
    .bind(`subevt_${crypto.randomUUID()}`, input.tenantId, subscriptionId, JSON.stringify({ paymentReady: false }), now)
    .run());

  const subscription = (await listShopSubscriptions(input.tenantId)).find((row) => row.id === subscriptionId);
  if (!subscription) throw new ProductApiError("Subscription creation failed.", 500);
  return subscription;
}

export function isSubscriptionSchemaPendingError(error: unknown): error is SubscriptionSchemaPendingError {
  return error instanceof SubscriptionSchemaPendingError
    || (error !== null && typeof error === "object" && "code" in error && (error as { code?: unknown }).code === SUBSCRIPTION_SCHEMA_PENDING_CODE);
}

export function subscriptionSchemaPendingJson(): Record<string, unknown> {
  return {
    ok: false,
    success: false,
    code: SUBSCRIPTION_SCHEMA_PENDING_CODE,
    message: SUBSCRIPTION_SCHEMA_PENDING_MESSAGE,
    error: SUBSCRIPTION_SCHEMA_PENDING_MESSAGE,
  };
}

async function withSubscriptionSchemaGuard<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isMissingSubscriptionSchema(error)) {
      throw new SubscriptionSchemaPendingError();
    }
    throw error;
  }
}

function isMissingSubscriptionSchema(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /no such table:\s*shop_subscription/i.test(message)
    || /SQLITE_ERROR.*shop_subscription/i.test(message);
}

async function getSubscriptionPaymentReadiness(tenantId: string): Promise<{ ready: boolean; reason: string }> {
  const row = await env.DB.prepare(
    "SELECT stripe_connect_state, stripe_connect_status, stripe_account_id FROM shop_settings WHERE tenant_id = ? LIMIT 1",
  )
    .bind(tenantId)
    .first<{ stripe_connect_state: string | null; stripe_connect_status: string | null; stripe_account_id: string | null }>();
  if (row?.stripe_connect_state === "active" && row.stripe_account_id && !row.stripe_account_id.startsWith("acct_mock_")) {
    return { ready: true, reason: "stripe_active" };
  }
  return { ready: false, reason: "定期決済設定が未完了です" };
}

function normalizePlanInput(value: unknown, tenantId: string, productId: string, index: number): ShopSubscriptionPlan {
  const source = isRecord(value) ? value as PlanInput : {};
  const id = text(source.id, `subplan_${tenantId}_${productId}_${index + 1}`.replace(/[^a-zA-Z0-9_-]/g, "_"), 160);
  const intervalUnit = normalizeIntervalUnit(source.intervalUnit ?? source.interval_unit);
  const intervalCount = integer(source.intervalCount ?? source.interval_count, 1, 1, 120);
  const price = integer(source.price, 0, 0, 99_999_999);
  const discountRate = decimal(source.discountRate ?? source.discount_rate, 0, 0, 100);
  const firstOrderPriceRaw = source.firstOrderPrice ?? source.first_order_price;
  const firstOrderPrice = firstOrderPriceRaw === null || firstOrderPriceRaw === "" || firstOrderPriceRaw === undefined
    ? null
    : integer(firstOrderPriceRaw, price, 0, 99_999_999);
  return {
    id,
    tenantId,
    productId,
    name: text(source.name, defaultPlanName(intervalUnit, intervalCount), 80),
    intervalUnit,
    intervalCount,
    price,
    discountRate,
    firstOrderPrice,
    minimumCycles: integer(source.minimumCycles ?? source.minimum_cycles, 0, 0, 120),
    canSkip: bool(source.canSkip ?? source.can_skip, true),
    canPause: bool(source.canPause ?? source.can_pause, true),
    canCancel: bool(source.canCancel ?? source.can_cancel, true),
    status: normalizeStatus(source.status),
    noticeText: text(source.noticeText ?? source.notice_text, "", 500),
    cancellationPolicy: text(source.cancellationPolicy ?? source.cancellation_policy, "", 500),
    updatedAt: Date.now(),
  };
}

function mapPlanRow(row: PlanRow): ShopSubscriptionPlan {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    productId: row.product_id,
    name: row.name,
    intervalUnit: normalizeIntervalUnit(row.interval_unit),
    intervalCount: Number(row.interval_count ?? 1),
    price: Number(row.price ?? 0),
    discountRate: Number(row.discount_rate ?? 0),
    firstOrderPrice: row.first_order_price === null || row.first_order_price === undefined ? null : Number(row.first_order_price),
    minimumCycles: Number(row.minimum_cycles ?? 0),
    canSkip: Number(row.can_skip ?? 0) === 1,
    canPause: Number(row.can_pause ?? 0) === 1,
    canCancel: Number(row.can_cancel ?? 0) === 1,
    status: normalizeStatus(row.status),
    noticeText: row.notice_text || "",
    cancellationPolicy: row.cancellation_policy || "",
    updatedAt: Number(row.updated_at ?? 0),
  };
}

function mapSubscriptionRow(row: SubscriptionRow): ShopSubscription {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    status: normalizeSubscriptionStatus(row.status),
    planId: row.plan_id,
    productId: row.product_id,
    productName: row.product_name || row.product_id,
    planName: row.plan_name || row.plan_id,
    quantity: Number(row.quantity ?? 1),
    unitPrice: Number(row.unit_price ?? 0),
    intervalUnit: normalizeIntervalUnit(row.interval_unit),
    intervalCount: Number(row.interval_count ?? 1),
    nextBillingAt: row.next_billing_at === null || row.next_billing_at === undefined ? null : Number(row.next_billing_at),
    nextDeliveryAt: row.next_delivery_at === null || row.next_delivery_at === undefined ? null : Number(row.next_delivery_at),
    paymentProvider: row.payment_provider,
    paymentSubscriptionId: row.payment_subscription_id,
    memo: row.memo || "",
    createdAt: Number(row.created_at ?? 0),
    updatedAt: Number(row.updated_at ?? 0),
  };
}

function normalizeIntervalUnit(value: unknown): SubscriptionIntervalUnit {
  if (value === "day" || value === "week" || value === "month") return value;
  return "month";
}

function normalizeStatus(value: unknown): SubscriptionPlanStatus {
  if (value === "hidden" || value === "archived") return value;
  return "active";
}

function normalizeSubscriptionStatus(value: unknown): ShopSubscriptionStatus {
  if (value === "active" || value === "paused" || value === "canceled" || value === "payment_failed" || value === "completed") return value;
  return "pending_payment_setup";
}

function defaultPlanName(unit: SubscriptionIntervalUnit, count: number): string {
  if (unit === "week") return count === 1 ? "毎週" : `${count}週間ごと`;
  if (unit === "day") return `${count}日ごと`;
  return count === 1 ? "毎月" : `${count}か月ごと`;
}

function text(value: unknown, fallback: string, maxLength: number): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  return (normalized || fallback).slice(0, maxLength);
}

function integer(value: unknown, fallback: number, min: number, max: number): number {
  const raw = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  const number = Number.isFinite(raw) ? Math.trunc(raw) : fallback;
  return Math.min(Math.max(number, min), max);
}

function decimal(value: unknown, fallback: number, min: number, max: number): number {
  const raw = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  const number = Number.isFinite(raw) ? raw : fallback;
  return Math.min(Math.max(number, min), max);
}

function bool(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") return ["1", "true", "yes", "on"].includes(value.toLowerCase());
  return fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function intervalToMs(unit: SubscriptionIntervalUnit, count: number): number {
  const day = 24 * 60 * 60 * 1000;
  if (unit === "day") return day * count;
  if (unit === "week") return day * 7 * count;
  return day * 30 * count;
}
