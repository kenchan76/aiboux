import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { resolveTenantFromRequest, tenantJsonError } from '../../../../lib/server/tenantContext';

export const prerender = false;

type ProductRow = {
  id: string;
  sku: string;
  name: string;
  unit_cost: number;
  markup_rate: number;
  rounding_mode: string;
};

type PricingRuleRow = {
  markup_rate: number;
  round_type: string;
};

type LabelItem = {
  product_id?: string;
  product_name?: string;
  unit_cost?: number;
  markup_rate?: number;
  rounding_mode?: string;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await resolveTenantFromRequest(request);
    const body = await request.json<Record<string, unknown>>();
    const items = Array.isArray(body.items) ? body.items as LabelItem[] : [];
    const supplierName = normalizeString(body.supplier_name);
    const pricingRule = supplierName
      ? await env.DB.prepare('SELECT markup_rate, round_type FROM tenant_pricing_rules WHERE tenant_id = ? AND supplier_name = ? LIMIT 1')
        .bind(tenant.tenantId, supplierName)
        .first<PricingRuleRow>()
      : null;

    if (items.length === 0) {
      return Response.json({ success: false, error: '`items` is required.' }, { status: 400 });
    }

    const labels = [];
    for (const item of items.slice(0, 200)) {
      const product = item.product_id
        ? await env.DB.prepare('SELECT id, sku, name, unit_cost, markup_rate, rounding_mode FROM b2b_products WHERE tenant_id = ? AND id = ? LIMIT 1')
          .bind(tenant.tenantId, item.product_id)
          .first<ProductRow>()
        : null;
      const name = product?.name ?? (normalizeString(item.product_name) || '商品');
      const unitCost = normalizePositiveNumber(item.unit_cost, product?.unit_cost ?? 0);
      const markupRate = normalizePositiveNumber(item.markup_rate, pricingRule?.markup_rate ?? product?.markup_rate ?? 1.3);
      const roundingMode = normalizeRoundingMode(item.rounding_mode ?? pricingRule?.round_type ?? product?.rounding_mode);
      const price = applyRounding(unitCost * markupRate, roundingMode);
      labels.push({ product_id: product?.id ?? null, sku: product?.sku ?? '', name, unit_cost: unitCost, markup_rate: markupRate, rounding_mode: roundingMode, price });
    }

    const html = renderLabelHtml(tenant.name, labels);
    return Response.json({ success: true, tenant_id: tenant.tenantId, supplier_name: supplierName || null, labels, preview_html: html });
  } catch (error) {
    if (error instanceof Error && error.name === 'TenantResolutionError') return tenantJsonError(error);
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Label generation failed.' }, { status: 500 });
  }
};

function renderLabelHtml(tenantName: string, labels: Array<{ sku: string; name: string; price: number }>): string {
  const cards = labels.map((label) => `
    <article>
      <p>${escapeHtml(tenantName)}</p>
      <h2>${escapeHtml(label.name)}</h2>
      <p>${escapeHtml(label.sku)}</p>
      <p>¥${label.price.toLocaleString('ja-JP')}</p>
    </article>
  `).join('');

  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>Price Labels</title></head><body><main>${cards}</main></body></html>`;
}

function applyRounding(value: number, mode: string): number {
  if (mode === 'floor') return Math.floor(value);
  if (mode === 'ceil') return Math.ceil(value);
  if (mode === 'round') return Math.round(value);
  if (mode === 'floor_10') return Math.floor(value / 10) * 10;
  if (mode === 'round_10') return Math.round(value / 10) * 10;
  return Math.ceil(value / 10) * 10;
}

function normalizeRoundingMode(value: unknown): string {
  const text = normalizeString(value);
  return ['floor', 'ceil', 'round', 'floor_10', 'ceil_10', 'round_10'].includes(text) ? text : 'ceil_10';
}

function normalizePositiveNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char);
}
