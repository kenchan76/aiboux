type SocialDraftRow = {
  id: string;
  tenant_id: string;
  product_id: string;
  platform: string;
  post_content: string | null;
  image_keys: string | null;
};

export type ShopSocialCronResult = {
  scanned: number;
  published: number;
  failed: number;
};

export async function runShopSocialPostCron(env: Pick<Cloudflare.Env, "DB">): Promise<ShopSocialCronResult> {
  const result = await env.DB.prepare(
    `
    SELECT id, tenant_id, product_id, platform, post_content, image_keys
    FROM shop_social_post_drafts
    WHERE status = 'approved'
      AND (scheduled_for IS NULL OR scheduled_for <= datetime('now'))
    ORDER BY COALESCE(scheduled_for, created_at) ASC
    LIMIT 25
    `,
  ).all<SocialDraftRow>();

  const rows = result.results ?? [];
  let published = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      const postedUrl = await publishSocialPost(row);
      await env.DB.prepare(
        `
        UPDATE shop_social_post_drafts
        SET status = 'published',
            posted_url = ?
        WHERE id = ? AND tenant_id = ? AND status = 'approved'
        `,
      )
        .bind(postedUrl, row.id, row.tenant_id)
        .run();
      published += 1;
    } catch {
      await env.DB.prepare(
        `
        UPDATE shop_social_post_drafts
        SET status = 'failed'
        WHERE id = ? AND tenant_id = ? AND status = 'approved'
        `,
      )
        .bind(row.id, row.tenant_id)
        .run();
      failed += 1;
    }
  }

  return {
    scanned: rows.length,
    published,
    failed,
  };
}

async function publishSocialPost(row: SocialDraftRow): Promise<string> {
  if (!row.platform || !row.product_id) {
    throw new Error("Invalid social post draft.");
  }
  throw new Error("SNS provider API is not configured. Draft was not published.");
}
