import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { auditLog, id, productError, productJson, readJsonBody, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type SuggestionPayload = {
  productNameCandidate: string;
  description: string;
  specification: string;
  categoryCandidate: string;
  yahooProductName: string;
  rakutenProductName: string;
  amazonProductName: string;
  keywords: string[];
  bundleIdeas: string[];
  needsReview: string[];
  sources: string[];
  confidence: number;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody(request);
    const productId = textValue(body.productId ?? body.product_id, "productId");
    const inputType = textValue(body.inputType ?? body.input_type, "inputType") || "text";
    const inputSummary = textValue(body.inputSummary ?? body.input_summary ?? body.janCode ?? body.jan_code ?? body.productName ?? body.product_name, "inputSummary", { required: true, maxLength: 2000 });
    const product = productId
      ? await env.DB.prepare("SELECT product_name, jan_code, specification FROM core_products WHERE tenant_id = ? AND id = ? AND deleted_at IS NULL LIMIT 1")
          .bind(tenant.tenantId, productId)
          .first<Record<string, string>>()
      : null;

    const aiPayload = await generateSuggestion({
      apiKey: (env as unknown as { GEMINI_API_KEY?: string }).GEMINI_API_KEY,
      inputSummary,
      productName: product?.product_name ?? textValue(body.productName ?? body.product_name, "productName"),
      janCode: product?.jan_code ?? textValue(body.janCode ?? body.jan_code, "janCode"),
      specification: product?.specification ?? textValue(body.specification, "specification"),
    });

    const jobId = id("aienrich");
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO ai_enrichment_jobs (id, tenant_id, product_id, input_type, input_summary, engine, status, confidence, sources_json, needs_review_json, created_by, updated_by)
         VALUES (?, ?, ?, ?, ?, ?, 'pending_review', ?, ?, ?, ?, ?)`,
      ).bind(
        jobId,
        tenant.tenantId,
        productId || null,
        inputType,
        inputSummary,
        aiPayload.sources.includes("rule_fallback") ? "rule_fallback" : "gemini-2.5-flash",
        aiPayload.confidence,
        JSON.stringify(aiPayload.sources),
        JSON.stringify(aiPayload.needsReview),
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
        textValue(body.actorId ?? body.actor_id, "actorId") || null,
      ),
      env.DB.prepare(
        `INSERT INTO ai_suggestions (id, tenant_id, job_id, product_id, suggestion_type, field_key, suggested_value_json, confidence, source_urls_json)
         VALUES (?, ?, ?, ?, 'product_field', 'product_enrichment', ?, ?, ?)`,
      ).bind(id("aisug"), tenant.tenantId, jobId, productId || null, JSON.stringify(aiPayload), aiPayload.confidence, JSON.stringify(aiPayload.sources)),
      env.DB.prepare(
        `INSERT INTO ai_suggestions (id, tenant_id, job_id, product_id, suggestion_type, field_key, suggested_value_json, confidence, source_urls_json)
         VALUES (?, ?, ?, ?, 'bundle', 'bundle_skus', ?, ?, ?)`,
      ).bind(id("aisug"), tenant.tenantId, jobId, productId || null, JSON.stringify(aiPayload.bundleIdeas), Math.max(0.6, aiPayload.confidence - 0.05), JSON.stringify(aiPayload.sources)),
    ]);

    await auditLog({ tenantId: tenant.tenantId, action: "ai.product_enrichment.pending_review", entityType: "ai_enrichment_job", entityId: jobId, after: aiPayload });
    return productJson({ success: true, jobId, suggestion: aiPayload, reviewRequired: true }, { status: 201 });
  } catch (error) {
    return productError(error);
  }
};

async function generateSuggestion(input: { apiKey?: string; inputSummary: string; productName: string; janCode: string; specification: string }): Promise<SuggestionPayload> {
  if (!input.apiKey) return fallbackSuggestion(input);

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${input.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text:
                "AIBOUXの商品正本を補完します。公開情報の文章はコピーせず、業務用に再構成してください。自動公開は禁止で、人間承認が必要な項目はneedsReviewへ入れてください。\n" +
                JSON.stringify(input),
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            productNameCandidate: { type: "STRING" },
            description: { type: "STRING" },
            specification: { type: "STRING" },
            categoryCandidate: { type: "STRING" },
            yahooProductName: { type: "STRING" },
            rakutenProductName: { type: "STRING" },
            amazonProductName: { type: "STRING" },
            keywords: { type: "ARRAY", items: { type: "STRING" } },
            bundleIdeas: { type: "ARRAY", items: { type: "STRING" } },
            needsReview: { type: "ARRAY", items: { type: "STRING" } },
            sources: { type: "ARRAY", items: { type: "STRING" } },
            confidence: { type: "NUMBER" },
          },
          required: ["productNameCandidate", "description", "specification", "categoryCandidate", "yahooProductName", "rakutenProductName", "amazonProductName", "keywords", "bundleIdeas", "needsReview", "sources", "confidence"],
        },
      },
    }),
  });
  if (!response.ok) return fallbackSuggestion(input);
  const json = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return fallbackSuggestion(input);
  return normalizeSuggestion(JSON.parse(text) as Partial<SuggestionPayload>, input);
}

function fallbackSuggestion(input: { inputSummary: string; productName: string; janCode: string; specification: string }): SuggestionPayload {
  const baseName = input.productName || extractName(input.inputSummary) || "商品名要確認";
  return {
    productNameCandidate: baseName,
    description: `${baseName}の仕様、販売単位、物流条件をCore正本として整理しました。公開前にサイズ、重量、法定表示を確認してください。`,
    specification: input.specification || "仕様要確認",
    categoryCandidate: "要確認",
    yahooProductName: `${baseName} まとめ買い セット販売`,
    rakutenProductName: `${baseName} 送料無料 セット ケース販売`,
    amazonProductName: baseName,
    keywords: [baseName, input.janCode, "セット販売"].filter(Boolean),
    bundleIdeas: ["1個", "2個セット", "3個セット", "ケース販売"],
    needsReview: ["カテゴリ", "サイズ", "重量", "モール別禁止表現"],
    sources: ["rule_fallback"],
    confidence: 0.62,
  };
}

function normalizeSuggestion(value: Partial<SuggestionPayload>, input: { inputSummary: string; productName: string; janCode: string; specification: string }): SuggestionPayload {
  const fallback = fallbackSuggestion(input);
  return {
    productNameCandidate: value.productNameCandidate || fallback.productNameCandidate,
    description: value.description || fallback.description,
    specification: value.specification || fallback.specification,
    categoryCandidate: value.categoryCandidate || fallback.categoryCandidate,
    yahooProductName: value.yahooProductName || fallback.yahooProductName,
    rakutenProductName: value.rakutenProductName || fallback.rakutenProductName,
    amazonProductName: value.amazonProductName || fallback.amazonProductName,
    keywords: Array.isArray(value.keywords) ? value.keywords : fallback.keywords,
    bundleIdeas: Array.isArray(value.bundleIdeas) ? value.bundleIdeas : fallback.bundleIdeas,
    needsReview: Array.isArray(value.needsReview) ? value.needsReview : fallback.needsReview,
    sources: Array.isArray(value.sources) && value.sources.length > 0 ? value.sources : fallback.sources,
    confidence: typeof value.confidence === "number" ? Math.max(0, Math.min(1, value.confidence)) : fallback.confidence,
  };
}

function extractName(text: string): string {
  return text.split(/\s|,|、/).find((part) => part.length >= 4) ?? "";
}
