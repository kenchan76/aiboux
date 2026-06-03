import { z } from "zod";

export const coreDocumentLineSchema = z.object({
  id: z.string().trim().optional().default(""),
  line_no: z.coerce.number().int().positive().optional().default(1),
  lineKind: z.enum(["product", "note"]).optional().default("product"),
  productCode: z.string().trim().max(80, "商品コードは80文字以内です。").optional().default(""),
  productName: z.string().trim().min(1, "品目名は必須です。").max(180, "品目名は180文字以内です。"),
  spec: z.string().trim().max(160, "規格は160文字以内です。").optional().default(""),
  unit: z.string().trim().max(20, "単位は20文字以内です。").optional().default(""),
  packageQuantity: z.coerce.number().nonnegative("入数は0以上です。").max(999999, "入数が大きすぎます。").optional().default(1),
  quantity: z.coerce.number().positive("数量は0より大きい数値で入力してください。").max(999999, "数量が大きすぎます。"),
  unitPrice: z.coerce.number().int("単価は整数で入力してください。").min(0, "単価は0以上です。").max(999999999, "単価が大きすぎます。"),
  taxRate: z.coerce.number().refine((value) => value === 10 || value === 8, "税率は10%または8%です。").optional().default(10),
  note: z.string().trim().max(240, "備考は240文字以内です。").optional().default(""),
});

export const coreDocumentFormSchema = z.object({
  id: z.string().trim().optional().default(""),
  type: z.enum(["quote", "order", "delivery", "invoice", "payment", "purchase-order"]).default("quote"),
  documentNumber: z.string().trim().min(1, "帳票番号は必須です。").max(80, "帳票番号は80文字以内です。"),
  customerName: z.string().trim().min(1, "顧客名は必須です。").max(160, "顧客名は160文字以内です。"),
  issueDate: z.string().trim().min(1, "日付は必須です。").max(20, "日付の形式が長すぎます。"),
  status: z.enum(["draft", "issued", "sent", "accepted", "delivered", "void"]).default("draft"),
  memo: z.string().trim().max(1000, "メモは1000文字以内です。").default(""),
  lines: z.array(coreDocumentLineSchema).min(1, "明細は1行以上必要です。").max(200, "明細は200行以内です。"),
  actorId: z.string().trim().max(120).optional().default(""),
});

export type CoreDocumentFormValues = z.infer<typeof coreDocumentFormSchema>;
export type CoreDocumentLineValues = z.infer<typeof coreDocumentLineSchema>;

export function calculateDocumentTotals(values: Pick<CoreDocumentFormValues, "lines">) {
  const lineTotals = values.lines.map((line) => {
    if (line.lineKind === "note") return 0;
    return Math.floor(Number(line.quantity || 0) * Number(line.unitPrice || 0));
  });
  const subtotal = lineTotals.reduce((sum, value) => sum + value, 0);
  const tax10 = values.lines.reduce((sum, line, index) => {
    if (line.lineKind === "note" || Number(line.taxRate ?? 10) !== 10) return sum;
    return sum + Math.floor((lineTotals[index] ?? 0) * 0.1);
  }, 0);
  const tax8 = values.lines.reduce((sum, line, index) => {
    if (line.lineKind === "note" || Number(line.taxRate ?? 10) !== 8) return sum;
    return sum + Math.floor((lineTotals[index] ?? 0) * 0.08);
  }, 0);
  const tax = tax10 + tax8;
  return {
    lineTotals,
    subtotal,
    tax10,
    tax8,
    tax,
    total: subtotal + tax,
  };
}

export function documentTypeLabel(type: CoreDocumentFormValues["type"]): string {
  if (type === "quote") return "見積書";
  if (type === "order") return "注文書";
  if (type === "delivery") return "納品書";
  if (type === "invoice") return "請求書";
  if (type === "payment") return "入金伝票";
  return "発注書";
}
