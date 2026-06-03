import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { ProductApiError, productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type ApproveSocialPostBody = {
  draftId?: unknown;
  draft_id?: unknown;
  actorId?: unknown;
};

type SocialDraftRow = {
  id: string;
  status: string;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<ApproveSocialPostBody>(request);
    const draftId = textValue(body.draftId ?? body.draft_id, "draftId", { required: true, maxLength: 160 });
    const actorId = textValue(body.actorId, "actorId", { maxLength: 120 });

    const existing = await env.DB.prepare(
      "SELECT id, status FROM shop_social_post_drafts WHERE tenant_id = ? AND id = ? LIMIT 1",
    )
      .bind(tenant.tenantId, draftId)
      .first<SocialDraftRow>();

    if (!existing) throw new ProductApiError("Social post draft was not found.", 404);
    if (existing.status !== "pending") {
      throw new ProductApiError(`Social post draft is already ${existing.status}.`, 409);
    }

    await env.DB.prepare(
      "UPDATE shop_social_post_drafts SET status = 'approved', approved_by = ?, approved_at = CURRENT_TIMESTAMP WHERE tenant_id = ? AND id = ? AND status = 'pending'",
    )
      .bind(actorId || null, tenant.tenantId, draftId)
      .run();

    return productJson({
      success: true,
      draftId,
      status: "approved",
      approvedBy: actorId || null,
      approvedAt: new Date().toISOString(),
    });
  } catch (error) {
    return productError(error);
  }
};
