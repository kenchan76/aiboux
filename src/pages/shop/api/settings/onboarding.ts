import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { ProductApiError, booleanValue, productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type OnboardingBody = {
  invoiceRegistered?: unknown;
  corporateNumber?: unknown;
  companyName?: unknown;
  postalCode?: unknown;
  address?: unknown;
  storeName?: unknown;
  subdomain?: unknown;
  tokushohoText?: unknown;
  privacyPolicyText?: unknown;
  stripeConnected?: unknown;
  actorId?: unknown;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<OnboardingBody>(request);
    const storeName = textValue(body.storeName, "storeName", { required: true, maxLength: 120 });
    const subdomain = normalizeSubdomain(textValue(body.subdomain, "subdomain", { required: true, maxLength: 64 }));
    const now = Date.now();
    const actorId = textValue(body.actorId, "actorId", { maxLength: 120 }) || null;

    await env.DB.prepare(
      `
      INSERT INTO shop_settings (
        id,
        tenant_id,
        store_name,
        store_slug,
        mall_subdomain,
        invoice_registered,
        corporate_number,
        corporate_name,
        postal_code,
        address_line1,
        tokushoho_text,
        privacy_policy_text,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(tenant_id) DO UPDATE SET
        store_name = excluded.store_name,
        store_slug = excluded.store_slug,
        mall_subdomain = excluded.mall_subdomain,
        invoice_registered = excluded.invoice_registered,
        corporate_number = excluded.corporate_number,
        corporate_name = excluded.corporate_name,
        postal_code = excluded.postal_code,
        address_line1 = excluded.address_line1,
        tokushoho_text = excluded.tokushoho_text,
        privacy_policy_text = excluded.privacy_policy_text,
        updated_by = excluded.updated_by,
        updated_at = excluded.updated_at,
        deleted_at = NULL
      `,
    )
      .bind(
        `shopset_${tenant.tenantId}`,
        tenant.tenantId,
        storeName,
        subdomain,
        subdomain,
        booleanValue(body.invoiceRegistered) ? 1 : 0,
        textValue(body.corporateNumber, "corporateNumber", { maxLength: 13 }),
        textValue(body.companyName, "companyName", { maxLength: 180 }),
        textValue(body.postalCode, "postalCode", { maxLength: 12 }),
        textValue(body.address, "address", { maxLength: 300 }),
        textValue(body.tokushohoText, "tokushohoText", { maxLength: 5000 }),
        textValue(body.privacyPolicyText, "privacyPolicyText", { maxLength: 5000 }),
        actorId,
        actorId,
        now,
        now,
      )
      .run();

    return productJson({
      success: true,
      tenantId: tenant.tenantId,
      storeName,
      mallSubdomain: subdomain,
      dashboardPath: "/shop/dashboard",
    });
  } catch (error) {
    return productError(error);
  }
};

function normalizeSubdomain(value: string): string {
  const subdomain = value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);

  if (!subdomain) {
    throw new ProductApiError("subdomain is required.", 400);
  }

  return subdomain;
}
