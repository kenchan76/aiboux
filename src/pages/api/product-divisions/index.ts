import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { auditLog, id, productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const rows = await env.DB.prepare("SELECT * FROM product_divisions WHERE tenant_id = ? AND deleted_at IS NULL ORDER BY sort_order ASC, name ASC")
      .bind(tenant.tenantId)
      .all();
    return productJson({ success: true, divisions: rows.results });
  } catch (error) {
    return productError(error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody(request);
    const divisionId = id("div");
    const name = textValue(body.name, "name", { required: true, maxLength: 80 });
    const description = textValue(body.description, "description", { maxLength: 400 });
    await env.DB.prepare(
      `INSERT INTO product_divisions (id, tenant_id, name, description, color_token, sort_order, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        divisionId,
        tenant.tenantId,
        name,
        description,
        textValue(body.colorToken ?? body.color_token, "colorToken") || "neutral",
        Number(body.sortOrder ?? body.sort_order ?? 100),
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
      )
      .run();
    await auditLog({ tenantId: tenant.tenantId, action: "product_division.create", entityType: "product_division", entityId: divisionId, after: { name, description } });
    return productJson({ success: true, divisionId }, { status: 201 });
  } catch (error) {
    return productError(error);
  }
};
