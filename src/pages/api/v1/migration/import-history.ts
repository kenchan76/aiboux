import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { requestGeminiStructuredJson } from '../../../../lib/server/gemini';
import { resolveTenantFromRequest, tenantJsonError } from '../../../../lib/server/tenantContext';

export const prerender = false;

type ExtractedSale = {
  transaction_date: string;
  customer_name: string;
  customer_bank_account_kana: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  confidence: number;
};

type ExtractionResult = {
  sales: ExtractedSale[];
};

const schema = {
  type: 'object',
  properties: {
    sales: {
      type: 'array',
      items: {
          type: 'object',
          properties: {
            transaction_date: { type: 'string' },
            customer_name: { type: 'string' },
            customer_bank_account_kana: { type: 'string' },
            product_name: { type: 'string' },
            quantity: { type: 'integer' },
            unit_price: { type: 'integer' },
            confidence: { type: 'number' },
          },
        required: ['transaction_date', 'customer_name', 'customer_bank_account_kana', 'product_name', 'quantity', 'unit_price', 'confidence'],
      },
    },
  },
  required: ['sales'],
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const tenant = await resolveTenantFromRequest(request);
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return Response.json({ success: false, error: '`file` is required.' }, { status: 400 });
    }

    const text = await readFileAsText(file);
    const fallback = extractCsvFallback(text);
    const extracted = await requestGeminiStructuredJson<ExtractionResult>(
      [
        'Extract historical sales rows from this Japanese legacy CSV/OCR text.',
        'Return only valid JSON matching the schema. Dates must be YYYY-MM-DD. Quantity and unit_price must be integers.',
        'When customer kana is absent, infer a conservative Japanese kana reading from the customer name or return an empty string.',
        `Tenant boundary: ${tenant.tenantId}. Do not include any other tenant context.`,
        text.slice(0, 80000),
      ].join('\n\n'),
      schema,
      { sales: fallback },
    );

    const validRows = extracted.sales.map(normalizeSale).filter((row): row is ExtractedSale => row !== null).slice(0, 1000);
    if (validRows.length === 0) {
      return Response.json({ success: false, error: 'No importable sales rows were extracted.' }, { status: 422 });
    }

    const batchStatements: D1PreparedStatement[] = [];
    const customerKeys = new Set<string>();
    const productKeys = new Set<string>();

    for (const row of validRows) {
      const customerKey = row.customer_name.trim();
      if (customerKey && !customerKeys.has(customerKey)) {
        customerKeys.add(customerKey);
        batchStatements.push(
          env.DB.prepare(
            'INSERT OR IGNORE INTO b2b_customers (id, tenant_id, customer_name, bank_account_kana) VALUES (?, ?, ?, ?)',
          ).bind(`cust_auto_${crypto.randomUUID()}`, tenant.tenantId, customerKey, row.customer_bank_account_kana || null),
        );
      }

      const productSku = buildAutoSku(row.product_name);
      if (!productKeys.has(productSku)) {
        productKeys.add(productSku);
        batchStatements.push(
          env.DB.prepare(
            'INSERT OR IGNORE INTO b2b_products (id, tenant_id, sku, name, current_stock, selling_price, unit_cost, markup_rate, is_active) VALUES (?, ?, ?, ?, 0, ?, ?, 1.0, 1)',
          ).bind(`prod_auto_${crypto.randomUUID()}`, tenant.tenantId, productSku, row.product_name, row.unit_price, row.unit_price),
        );
      }

      batchStatements.push(
        env.DB.prepare(
          'INSERT INTO b2b_historical_sales (id, tenant_id, source_file_name, transaction_date, product_name, quantity, unit_price, total_amount, confidence) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ).bind(
          `hist_${crypto.randomUUID()}`,
          tenant.tenantId,
          file.name,
          row.transaction_date,
          row.product_name,
          row.quantity,
          row.unit_price,
          row.quantity * row.unit_price,
          row.confidence,
        ),
      );
    }

    await env.DB.batch(batchStatements);

    const totalAmount = validRows.reduce((sum, row) => sum + row.quantity * row.unit_price, 0);
    await env.DB.prepare(
      'INSERT INTO b2b_ai_command_logs (id, tenant_id, command_text, function_name, arguments_json, result_json) VALUES (?, ?, ?, ?, ?, ?)',
    )
      .bind(
        `cmd_${crypto.randomUUID()}`,
        tenant.tenantId,
        `過去データ移行: ${file.name}`,
        'import_historical_sales',
        JSON.stringify({ fileName: file.name, fileSize: file.size, fileType: file.type || 'application/octet-stream' }),
        JSON.stringify({
          imported: validRows.length,
          learnedCustomers: customerKeys.size,
          learnedProducts: productKeys.size,
          totalAmount,
          firstDate: validRows[0]?.transaction_date ?? null,
          lastDate: validRows.at(-1)?.transaction_date ?? null,
        }),
      )
      .run();

    return Response.json({
      success: true,
      imported: validRows.length,
      learned_customers: customerKeys.size,
      learned_products: productKeys.size,
      file_name: file.name,
      message: `${validRows.length}件の過去売上データを移行し、顧客${customerKeys.size}件・商品${productKeys.size}件をマスタ学習しました。`,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TenantResolutionError') return tenantJsonError(error);
    return Response.json({ success: false, error: error instanceof Error ? error.message : 'Historical import failed.' }, { status: 500 });
  }
};

async function readFileAsText(file: File): Promise<string> {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return `PDF filename: ${file.name}\nPDF binary size: ${file.size}\nGemini should infer from OCR text only when provided by upstream scanner.`;
  }
  return file.text();
}

function extractCsvFallback(text: string): ExtractedSale[] {
  const lines = text.split(/\r?\n/).slice(0, 1000);
  const rows: ExtractedSale[] = [];
  for (const line of lines) {
    const cells = line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''));
    if (cells.length < 4) continue;
    const date = normalizeDate(cells[0]);
    if (!date || !cells[1]) continue;
    const customerName = cells.length >= 5 ? cells[1] : '未設定取引先';
    const productName = cells.length >= 5 ? cells[2] : cells[1];
    const normalizedQuantity = cells.length >= 5 ? Number.parseInt(cells[3], 10) : Number.parseInt(cells[2], 10);
    const normalizedUnitPrice = cells.length >= 5 ? Number.parseInt(cells[4], 10) : Number.parseInt(cells[3], 10);
    if (!Number.isSafeInteger(normalizedQuantity) || !Number.isSafeInteger(normalizedUnitPrice)) continue;
    rows.push({
      transaction_date: date,
      customer_name: customerName,
      customer_bank_account_kana: '',
      product_name: productName,
      quantity: normalizedQuantity,
      unit_price: normalizedUnitPrice,
      confidence: 0.75,
    });
  }
  return rows;
}

function normalizeSale(value: ExtractedSale): ExtractedSale | null {
  const date = normalizeDate(value.transaction_date);
  const quantity = Number(value.quantity);
  const unitPrice = Number(value.unit_price);
  const productName = String(value.product_name ?? '').trim();
  const customerName = String(value.customer_name ?? '').trim() || '未設定取引先';
  const customerKana = String(value.customer_bank_account_kana ?? '').trim();
  if (!date || !productName || !Number.isSafeInteger(quantity) || quantity <= 0 || !Number.isSafeInteger(unitPrice) || unitPrice < 0) return null;
  return {
    transaction_date: date,
    customer_name: customerName.slice(0, 200),
    customer_bank_account_kana: customerKana.slice(0, 200),
    product_name: productName.slice(0, 200),
    quantity,
    unit_price: unitPrice,
    confidence: clamp(Number(value.confidence), 0, 1),
  };
}

function normalizeDate(value: string): string | null {
  const text = String(value ?? '').trim().replaceAll('/', '-');
  const matched = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!matched) return null;
  return `${matched[1]}-${matched[2].padStart(2, '0')}-${matched[3].padStart(2, '0')}`;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function buildAutoSku(productName: string): string {
  let hash = 2166136261;
  for (const char of productName.normalize('NFKC')) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `AUTO-${(hash >>> 0).toString(36).toUpperCase().padStart(7, '0')}`;
}
