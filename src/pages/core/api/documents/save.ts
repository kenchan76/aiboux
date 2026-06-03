import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { z } from "zod";
import { calculateDocumentTotals, coreDocumentFormSchema, type CoreDocumentFormValues } from "@/lib/coreDocumentFormSchema";
import { documentUiConfigByType } from "@/lib/coreDocumentUiConfig";
import { ProductApiError, id, productError, productJson, readJsonBody, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

type DocumentListRow = {
  id: string;
  type: "quote" | "order" | "delivery" | "invoice" | "payment" | "purchase-order";
  document_number: string;
  customer_name: string;
  issue_date: string;
  total_amount: number;
  status: string;
};

type DocumentLineRow = {
  id: string;
  line_no: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const url = new URL(request.url);
    const typeParam = url.searchParams.get("type");
    const parsedType = typeParam ? z.enum(["quote", "order", "delivery", "invoice", "payment", "purchase-order"]).safeParse(typeParam) : null;
    if (parsedType && !parsedType.success) throw new ProductApiError("帳票種別が不正です。", 400);

    const documentLookup = url.searchParams.get("id")?.trim() || url.searchParams.get("document_number")?.trim() || "";
    if (documentLookup) {
      const document = await env.DB.prepare(
        `
        SELECT id, type, document_number, customer_name, issue_date, subtotal_amount, tax_amount, total_amount, status, memo
        FROM core_documents
        WHERE tenant_id = ?
          AND (id = ? OR document_number = ?)
          AND deleted_at IS NULL
        LIMIT 1
        `,
      )
        .bind(tenant.tenantId, documentLookup, documentLookup)
        .first<DocumentListRow & { subtotal_amount: number; tax_amount: number; memo: string }>();

      if (!document) throw new ProductApiError("帳票が見つかりません。", 404);

      const lines = await env.DB.prepare(
        `
        SELECT id, line_no, product_name, quantity, unit_price, line_total
        FROM core_document_lines
        WHERE tenant_id = ?
          AND document_id = ?
          AND deleted_at IS NULL
        ORDER BY line_no ASC
        `,
      )
        .bind(tenant.tenantId, document.id)
        .all<DocumentLineRow>();

      return productJson({
        success: true,
        document: {
          id: document.id,
          type: document.type,
          typeLabel: documentTypeLabelFromDb(document.type),
          documentNumber: document.document_number,
          customerName: document.customer_name,
          issueDate: document.issue_date,
          subtotalAmount: Number(document.subtotal_amount ?? 0),
          taxAmount: Number(document.tax_amount ?? 0),
          totalAmount: Number(document.total_amount ?? 0),
          status: document.status,
          statusLabel: statusLabelFromDb(document.status),
          memo: document.memo ?? "",
          lines: (lines.results ?? []).map((line) => ({
            id: line.id,
            lineNo: Number(line.line_no),
            productName: line.product_name,
            quantity: Number(line.quantity),
            unitPrice: Number(line.unit_price),
            lineTotal: Number(line.line_total),
          })),
        },
      });
    }

    const rawLimit = Number(url.searchParams.get("limit") ?? 100);
    const limit = Math.min(Math.max(Number.isFinite(rawLimit) ? Math.trunc(rawLimit) : 100, 1), 200);
    const typeFilter = parsedType?.success ? parsedType.data : null;
    const statement = typeFilter
      ? env.DB.prepare(
          `
          SELECT id, type, document_number, customer_name, issue_date, total_amount, status
          FROM core_documents
          WHERE tenant_id = ?
            AND type = ?
            AND deleted_at IS NULL
          ORDER BY issue_date DESC, updated_at DESC
          LIMIT ?
          `,
        ).bind(tenant.tenantId, typeFilter, limit)
      : env.DB.prepare(
          `
          SELECT id, type, document_number, customer_name, issue_date, total_amount, status
          FROM core_documents
          WHERE tenant_id = ?
            AND deleted_at IS NULL
          ORDER BY issue_date DESC, updated_at DESC
          LIMIT ?
          `,
        ).bind(tenant.tenantId, limit);

    const rows = await statement.all<DocumentListRow>();
    return productJson({
      success: true,
      documents: (rows.results ?? []).map((row) => ({
        id: documentNumberForDisplay(row),
        documentId: row.id,
        type: documentTypeLabelFromDb(row.type),
        partner: row.customer_name,
        issuedAt: formatDate(row.issue_date),
        dueAt: formatDate(row.issue_date),
        amount: Number(row.total_amount ?? 0),
        status: statusLabelFromDb(row.status),
        tone: statusToneFromDb(row.status),
        owner: "core",
      })),
    });
  } catch (error) {
    return productError(error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const body = await readJsonBody<Record<string, unknown>>(request);
    const parsed = coreDocumentFormSchema.safeParse(body);
    if (!parsed.success) throw new ProductApiError(formatZodError(parsed.error), 400);

    const input = parsed.data;
    const documentId = input.id || id("cdoc");
    const now = Date.now();
    const actorId = input.actorId || null;
    const totals = calculateDocumentTotals(input);

    await assertDocumentWritable({
      tenantId: tenant.tenantId,
      documentId,
      input,
    });

    const statements: D1PreparedStatement[] = [
      env.DB.prepare(
        `
        INSERT INTO core_documents (
          id,
          tenant_id,
          type,
          document_number,
          customer_name,
          issue_date,
          subtotal_amount,
          tax_amount,
          total_amount,
          status,
          memo,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          type = excluded.type,
          document_number = excluded.document_number,
          customer_name = excluded.customer_name,
          issue_date = excluded.issue_date,
          subtotal_amount = excluded.subtotal_amount,
          tax_amount = excluded.tax_amount,
          total_amount = excluded.total_amount,
          status = excluded.status,
          memo = excluded.memo,
          updated_by = excluded.updated_by,
          updated_at = excluded.updated_at,
          deleted_at = NULL
        `,
      ).bind(
        documentId,
        tenant.tenantId,
        input.type,
        input.documentNumber,
        input.customerName,
        input.issueDate,
        totals.subtotal,
        totals.tax,
        totals.total,
        input.status,
        input.memo,
        actorId,
        actorId,
        now,
        now,
      ),
      env.DB.prepare("DELETE FROM core_document_lines WHERE tenant_id = ? AND document_id = ?").bind(tenant.tenantId, documentId),
    ];

    input.lines.forEach((line, index) => {
      statements.push(
        env.DB.prepare(
          `
          INSERT INTO core_document_lines (
            id,
            tenant_id,
            document_id,
            line_no,
            product_name,
            quantity,
            unit_price,
            line_total,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
        ).bind(
          line.id || id("cdocline"),
          tenant.tenantId,
          documentId,
          Number(line.line_no ?? index + 1),
          line.productName,
          line.quantity,
          line.unitPrice,
          totals.lineTotals[index] ?? 0,
          now,
          now,
        ),
      );
    });

    await env.DB.batch(statements);

    return productJson({
      success: true,
      documentId,
      lineCount: input.lines.length,
      subtotalAmount: totals.subtotal,
      taxAmount: totals.tax,
      totalAmount: totals.total,
    });
  } catch (error) {
    return productError(error);
  }
};

async function assertDocumentWritable(input: {
  tenantId: string;
  documentId: string;
  input: CoreDocumentFormValues;
}) {
  if (input.input.id) {
    const current = await env.DB.prepare(
      `
      SELECT id
      FROM core_documents
      WHERE tenant_id = ?
        AND id = ?
        AND deleted_at IS NULL
      LIMIT 1
      `,
    )
      .bind(input.tenantId, input.documentId)
      .first<{ id: string }>();
    if (!current) throw new ProductApiError("更新対象の帳票が見つかりません。", 404);
  }

  const conflict = await env.DB.prepare(
    `
    SELECT id
    FROM core_documents
    WHERE tenant_id = ?
      AND type = ?
      AND document_number = ?
      AND id <> ?
      AND deleted_at IS NULL
    LIMIT 1
    `,
  )
    .bind(input.tenantId, input.input.type, input.input.documentNumber, input.documentId)
    .first<{ id: string }>();

  if (conflict) throw new ProductApiError("同じ種別・帳票番号の帳票が既に存在します。", 409);
}

function formatZodError(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join(" / ");
}

function documentTypeLabelFromDb(type: DocumentListRow["type"]): string {
  return documentUiConfigByType(type).listTitle;
}

function documentNumberForDisplay(row: Pick<DocumentListRow, "type" | "document_number" | "issue_date">): string {
  const prefix = documentUiConfigByType(row.type).numberPrefix;
  if (new RegExp(`^${prefix}\\d{8}-\\d{2}$`).test(row.document_number)) return row.document_number;
  const date = (row.issue_date || "").replaceAll("-", "");
  if (/^\d{8}$/.test(date)) return `${prefix}${date}-01`;
  return row.document_number;
}

function statusLabelFromDb(status: string): string {
  const labels: Record<string, string> = {
    draft: "下書き",
    issued: "発行済",
    sent: "送付済み",
    accepted: "承認済み",
    delivered: "納品済み",
    void: "無効",
  };
  return labels[status] ?? status;
}

function statusToneFromDb(status: string): string {
  if (status === "void") return "red";
  if (status === "draft") return "neutral";
  if (status === "sent" || status === "issued") return "blue";
  return "green";
}

function formatDate(value: string): string {
  if (!value) return "";
  return value.replaceAll("-", "/");
}
