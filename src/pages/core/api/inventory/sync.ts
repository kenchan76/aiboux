import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { syncCoreInventory, type CoreInventoryChannel, type CoreInventoryOperation } from "@/lib/server/coreInventorySync";
import { ProductApiError, productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type InventorySyncBody = {
  items?: unknown;
  coreProductId?: unknown;
  coreSkuId?: unknown;
  skuCode?: unknown;
  shopProductId?: unknown;
  delta?: unknown;
  channel?: unknown;
  source?: unknown;
  operation?: unknown;
  referenceId?: unknown;
  referenceType?: unknown;
  idempotencyKey?: unknown;
  actorId?: unknown;
};

const channels = new Set<CoreInventoryChannel>(["core", "shop", "mall", "pos", "line", "external"]);
const operations = new Set<CoreInventoryOperation>(["adjust", "order", "cancel", "return", "manual", "sync"]);

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<InventorySyncBody>(request);
    const channel = parseChannel(body.channel);
    const operation = parseOperation(body.operation);
    const source = textValue(body.source, "source", { maxLength: 160 }) || `core.inventory.${operation}`;
    const actorId = textValue(body.actorId, "actorId", { maxLength: 120 }) || null;
    const items = parseItems(body);

    const results = await syncCoreInventory(env.DB, {
      tenantId: tenant.tenantId,
      items,
      channel,
      source,
      operation,
      actorId,
    });
    const failed = results.filter((result) => !result.success);

    return productJson(
      {
        success: failed.length === 0,
        tenantId: tenant.tenantId,
        channel,
        operation,
        results,
      },
      { status: failed.length > 0 ? 409 : 200 },
    );
  } catch (error) {
    return productError(error);
  }
};

function parseChannel(value: unknown): CoreInventoryChannel {
  const channel = textValue(value, "channel", { maxLength: 40 }) || "core";
  if (!channels.has(channel as CoreInventoryChannel)) throw new ProductApiError("channel is invalid.", 400);
  return channel as CoreInventoryChannel;
}

function parseOperation(value: unknown): CoreInventoryOperation {
  const operation = textValue(value, "operation", { maxLength: 40 }) || "sync";
  if (!operations.has(operation as CoreInventoryOperation)) throw new ProductApiError("operation is invalid.", 400);
  return operation as CoreInventoryOperation;
}

function parseItems(body: InventorySyncBody) {
  const rawItems = Array.isArray(body.items) ? body.items : [body];
  const items = rawItems
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const delta = Number(record.delta);
      if (!Number.isFinite(delta) || Math.trunc(delta) === 0) return null;
      return {
        coreProductId: textValue(record.coreProductId, "items.coreProductId", { maxLength: 160 }),
        coreSkuId: textValue(record.coreSkuId, "items.coreSkuId", { maxLength: 160 }),
        skuCode: textValue(record.skuCode, "items.skuCode", { maxLength: 160 }),
        shopProductId: textValue(record.shopProductId, "items.shopProductId", { maxLength: 160 }),
        delta: Math.trunc(delta),
        referenceId: textValue(record.referenceId, "items.referenceId", { maxLength: 180 }),
        referenceType: textValue(record.referenceType, "items.referenceType", { maxLength: 80 }),
        idempotencyKey: textValue(record.idempotencyKey, "items.idempotencyKey", { maxLength: 220 }),
        payload: record.payload ?? {},
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 100);

  if (!items.length) throw new ProductApiError("items must include at least one non-zero delta.", 400);
  if (items.some((item) => !item.coreProductId && !item.coreSkuId && !item.skuCode && !item.shopProductId)) {
    throw new ProductApiError("each item requires coreProductId, coreSkuId, skuCode, or shopProductId.", 400);
  }

  return items;
}
