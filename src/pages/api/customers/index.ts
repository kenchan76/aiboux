import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { productError, productJson, safeLimit, safeOffset, toSqlLike, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    const limit = safeLimit(url.searchParams.get("limit"));
    const offset = safeOffset(url.searchParams.get("offset"));
    const clauses = ["tenant_id = ?", "deleted_at IS NULL"];
    const binds: unknown[] = [tenant.tenantId];
    if (q) {
      clauses.push("(customer_name LIKE ? ESCAPE '\\' OR customer_code LIKE ? ESCAPE '\\' OR bank_account_kana LIKE ? ESCAPE '\\')");
      const like = toSqlLike(q);
      binds.push(like, like, like);
    }
    binds.push(limit, offset);
    const rows = await env.DB.prepare(`SELECT * FROM core_customers WHERE ${clauses.join(" AND ")} ORDER BY customer_name ASC LIMIT ? OFFSET ?`)
      .bind(...binds)
      .all();
    return productJson({ success: true, customers: rows.results, paging: { limit, offset } });
  } catch (error) {
    return productError(error);
  }
};
