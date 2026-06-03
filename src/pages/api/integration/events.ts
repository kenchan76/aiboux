import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { productError, productJson, safeLimit, safeOffset, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const url = new URL(request.url);
    const provider = textValue(url.searchParams.get("provider"), "provider");
    const status = textValue(url.searchParams.get("status"), "status");
    const clauses = ["tenant_id = ?"];
    const binds: unknown[] = [tenant.tenantId];
    if (provider) {
      clauses.push("provider = ?");
      binds.push(provider);
    }
    if (status) {
      clauses.push("status = ?");
      binds.push(status);
    }
    const limit = safeLimit(url.searchParams.get("limit"), 50, 300);
    const offset = safeOffset(url.searchParams.get("offset"));
    binds.push(limit, offset);
    const rows = await env.DB.prepare(`SELECT * FROM integration_events WHERE ${clauses.join(" AND ")} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .bind(...binds)
      .all();
    return productJson({ success: true, events: rows.results, paging: { limit, offset } });
  } catch (error) {
    return productError(error);
  }
};
