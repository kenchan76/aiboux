import { useMemo, useRef } from "react";
import { ExternalLink, FileDown, Printer, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export type DeliveryPreviewLine = {
  id: string;
  lineNo: number;
  lineKind: "product" | "note";
  productCode: string;
  productName: string;
  spec: string;
  unit: string;
  packageQuantity: number | string;
  quantity: number | string;
  unitPrice: number;
  taxRate: 10 | 8;
  amount: number;
  note: string;
};

export type DeliveryPrintModel = {
  documentNumber: string;
  deliveryDate: string;
  customerName: string;
  customerContact: string;
  destinationName: string;
  destinationDepartment: string;
  destinationContact: string;
  destinationPostalCode: string;
  destinationAddress: string;
  destinationPhone: string;
  memo: string;
  subtotal: number;
  tax10: number;
  tax8: number;
  total: number;
  includedTax: number;
  lines: DeliveryPreviewLine[];
};

type DeliveryPrintPreviewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: DeliveryPrintModel;
};

export function DeliveryPrintPreview({ open, onOpenChange, model }: DeliveryPrintPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const html = useMemo(() => buildDeliveryPrintHtml(model), [model]);

  function printFrame() {
    const frameWindow = iframeRef.current?.contentWindow;
    if (!frameWindow) {
      toast.error("印刷プレビューを準備できませんでした");
      return;
    }
    frameWindow.focus();
    frameWindow.print();
  }

  function openWindow() {
    const previewWindow = window.open("", "_blank", "width=980,height=920");
    if (!previewWindow) {
      toast.error("別ウィンドウを開けませんでした");
      return;
    }
    previewWindow.document.open();
    previewWindow.document.write(html);
    previewWindow.document.close();
  }

  function downloadPdf() {
    const fileName = `delivery-note-${model.documentNumber}.pdf`;
    const blob = buildDeliveryPdfBlob(model);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[50%] max-h-[96vh] max-w-[1180px] gap-0 overflow-hidden rounded-md border border-neutral-200 bg-white p-0 shadow-xl"
        data-testid="delivery-print-preview-dialog"
      >
        <div className="flex h-11 items-center justify-between border-b border-neutral-200 bg-white/95 px-3">
          <DialogTitle className="text-sm font-semibold">印刷プレビュー</DialogTitle>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={printFrame}>
              <Printer className="size-3.5" />
              印刷
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={downloadPdf} data-testid="delivery-pdf-download">
              <FileDown className="size-3.5" />
              PDFダウンロード
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={openWindow}>
              <ExternalLink className="size-3.5" />
              別ウィンドウで開く
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1 px-2" onClick={() => onOpenChange(false)}>
              <X className="size-4" />
              閉じる
            </Button>
          </div>
        </div>
        <div className="h-[calc(96vh-44px)] bg-neutral-100 p-3">
          <iframe
            ref={iframeRef}
            title={`${model.documentNumber} 印刷プレビュー`}
            srcDoc={html}
            className="h-full w-full rounded-sm border border-neutral-200 bg-white"
            data-testid="delivery-print-preview-frame"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function buildDeliveryPrintHtml(model: DeliveryPrintModel) {
  const rows = model.lines.map((line) => {
    if (line.lineKind === "note") {
      return `
        <tr class="note-row">
          <td class="no">${line.lineNo}</td>
          <td colspan="8">${escapeHtml(line.note || line.productName)}</td>
        </tr>
      `;
    }
    return `
      <tr>
        <td class="no">${line.lineNo}</td>
        <td class="code">${escapeHtml(line.productCode)}</td>
        <td>${escapeHtml(line.productName)}<div class="spec">${escapeHtml(line.spec)}</div></td>
        <td class="unit">${escapeHtml(line.unit)}</td>
        <td class="num">${line.packageQuantity}</td>
        <td class="num">${line.quantity}</td>
        <td class="num">${formatCurrency(line.unitPrice)}</td>
        <td class="tax">${line.taxRate}%</td>
        <td class="num">${formatCurrency(line.amount)}</td>
      </tr>
    `;
  }).join("");

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>delivery-note-${escapeHtml(model.documentNumber)}.pdf</title>
  <style>${printCss}</style>
</head>
<body>
  <article class="page">
    <header class="header">
      <div class="company">
        <div class="brand">aiboux CORE</div>
        <div>株式会社AIBOUX</div>
        <div>〒100-0001 東京都千代田区丸の内1-1-1</div>
        <div>TEL 03-0000-0000</div>
      </div>
      <div class="title-block">
        <h1>納品書</h1>
        <dl>
          <div><dt>納品書番号</dt><dd>${escapeHtml(model.documentNumber)}</dd></div>
          <div><dt>納品日</dt><dd>${escapeHtml(model.deliveryDate)}</dd></div>
        </dl>
      </div>
    </header>

    <section class="recipient">
      <div>
        <div class="label">取引先</div>
        <div class="recipient-name">${escapeHtml(model.customerName)} 御中</div>
        <div class="contact">${escapeHtml(model.customerContact)} 様</div>
      </div>
      <div>
        <div class="label">納品先</div>
        <div class="recipient-name">${escapeHtml(model.destinationName)}</div>
        <div>${escapeHtml(model.destinationDepartment)} ${escapeHtml(model.destinationContact)} 様</div>
        <div>${escapeHtml(model.destinationPostalCode)} ${escapeHtml(model.destinationAddress)}</div>
        <div>TEL ${escapeHtml(model.destinationPhone)}</div>
      </div>
    </section>

    <section class="total-box">
      <span>合計金額</span>
      <strong>${formatCurrency(model.total)}</strong>
    </section>

    <table>
      <thead>
        <tr>
          <th class="no">No.</th>
          <th class="code">商品コード</th>
          <th>商品名 / 規格</th>
          <th class="unit">単位</th>
          <th class="num">入数</th>
          <th class="num">数量</th>
          <th class="num">単価</th>
          <th class="tax">税率</th>
          <th class="num">金額</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <section class="memo">
      <div class="label">備考・メモ</div>
      <p>${escapeHtml(model.memo).replaceAll("\n", "<br />")}</p>
    </section>

    <section class="summary">
      <dl>
        <div><dt>小計</dt><dd>${formatCurrency(model.subtotal)}</dd></div>
        <div><dt>消費税 10%</dt><dd>${formatCurrency(model.tax10)}</dd></div>
        <div><dt>消費税 8%</dt><dd>${formatCurrency(model.tax8)}</dd></div>
        <div class="grand"><dt>合計金額</dt><dd>${formatCurrency(model.total)}</dd></div>
        <div><dt>内消費税</dt><dd>${formatCurrency(model.includedTax)}</dd></div>
      </dl>
    </section>
  </article>
</body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildDeliveryPdfBlob(model: DeliveryPrintModel) {
  const pdf = createMinimalJapanesePdf(model);
  const bytes = new Uint8Array(pdf.length);
  for (let index = 0; index < pdf.length; index += 1) {
    bytes[index] = pdf.charCodeAt(index) & 0xff;
  }
  return new Blob([bytes], { type: "application/pdf" });
}

function createMinimalJapanesePdf(model: DeliveryPrintModel) {
  const productLines = model.lines
    .slice(0, 12)
    .map((line) => line.lineKind === "note"
      ? `${line.lineNo}. ${line.note}`
      : `${line.lineNo}. ${line.productCode} ${line.productName} ${line.spec} ${line.quantity}${line.unit} ${formatCurrency(line.amount)} ${line.taxRate}%`);
  const lines = [
    "納品書",
    `納品書番号 ${model.documentNumber}`,
    `納品日 ${model.deliveryDate}`,
    `取引先 ${model.customerName} 御中`,
    `納品先 ${model.destinationName}`,
    "",
    ...productLines,
    "",
    `小計 ${formatCurrency(model.subtotal)}`,
    `消費税 10% ${formatCurrency(model.tax10)}`,
    `消費税 8% ${formatCurrency(model.tax8)}`,
    `合計金額 ${formatCurrency(model.total)}`,
    `内消費税 ${formatCurrency(model.includedTax)}`,
    "",
    model.memo.replaceAll("\n", " "),
  ];
  const textOps = lines.map((line, index) => {
    const fontSize = index === 0 ? 22 : 10;
    const x = index === 0 ? 260 : 56;
    const y = 790 - index * 24;
    return `BT /F1 ${fontSize} Tf ${x} ${y} Td ${toPdfUnicodeHex(line)} Tj ET`;
  }).join("\n");
  const stream = `${textOps}\n`;
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 7 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type0 /BaseFont /HeiseiKakuGo-W5 /Encoding /UniJIS-UTF16-H /DescendantFonts [5 0 R] >>\nendobj\n",
    "5 0 obj\n<< /Type /Font /Subtype /CIDFontType0 /BaseFont /HeiseiKakuGo-W5 /CIDSystemInfo 6 0 R /FontDescriptor << /Type /FontDescriptor /FontName /HeiseiKakuGo-W5 /Flags 4 /Ascent 880 /Descent -120 /CapHeight 700 /ItalicAngle 0 /StemV 80 >> >>\nendobj\n",
    "6 0 obj\n<< /Registry (Adobe) /Ordering (Japan1) /Supplement 5 >>\nendobj\n",
    `7 0 obj\n<< /Length ${byteLength(stream)} >>\nstream\n${stream}endstream\nendobj\n`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(byteLength(pdf));
    pdf += object;
  }
  const xrefOffset = byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return pdf;
}

function toPdfUnicodeHex(value: string) {
  const bytes: string[] = [];
  for (const codeUnit of value) {
    const code = codeUnit.charCodeAt(0);
    bytes.push(code.toString(16).padStart(4, "0"));
  }
  return `<${bytes.join("")}>`;
}

function byteLength(value: string) {
  return new TextEncoder().encode(value).length;
}

const printCss = `
  @page { size: A4 portrait; margin: 10mm; }
  html, body { margin: 0; background: #f3f4f6; color: #111827; font-family: "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif; }
  .page { box-sizing: border-box; width: 210mm; min-height: 297mm; margin: 0 auto; padding: 14mm; background: #fff; font-size: 10.5px; line-height: 1.55; }
  .header { display: grid; grid-template-columns: 1fr 82mm; gap: 12mm; border-bottom: 2px solid #111827; padding-bottom: 7mm; }
  .brand { font-size: 18px; font-weight: 800; margin-bottom: 4mm; }
  h1 { margin: 0 0 5mm; text-align: right; font-size: 26px; letter-spacing: 0.22em; }
  dl { margin: 0; }
  .title-block dl div, .summary dl div { display: grid; grid-template-columns: 28mm 1fr; align-items: center; min-height: 7mm; border-bottom: 1px solid #d1d5db; }
  dt { color: #6b7280; }
  dd { margin: 0; text-align: right; font-weight: 700; }
  .recipient { display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; margin-top: 9mm; }
  .label { margin-bottom: 1.5mm; color: #6b7280; font-size: 10px; }
  .recipient-name { border-bottom: 1px solid #111827; padding-bottom: 1.5mm; font-size: 15px; font-weight: 800; }
  .contact { margin-top: 2mm; }
  .total-box { display: flex; align-items: baseline; justify-content: space-between; width: 78mm; margin: 9mm 0; border: 2px solid #111827; padding: 3mm 4mm; }
  .total-box span { font-weight: 800; }
  .total-box strong { font-size: 20px; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th { border: 1px solid #111827; background: #f3f4f6; padding: 1.8mm 1.5mm; text-align: left; font-weight: 800; }
  td { border: 1px solid #d1d5db; padding: 1.8mm 1.5mm; vertical-align: top; }
  .no { width: 7mm; text-align: center; }
  .code { width: 27mm; }
  .unit { width: 9mm; text-align: center; }
  .num { width: 18mm; text-align: right; }
  .tax { width: 11mm; text-align: center; }
  .spec { margin-top: 0.6mm; color: #6b7280; font-size: 9.5px; }
  .note-row td:nth-child(2) { color: #374151; }
  .memo { min-height: 22mm; margin-top: 8mm; border: 1px solid #d1d5db; padding: 3mm; }
  .memo p { margin: 0; }
  .summary { width: 72mm; margin: 7mm 0 0 auto; }
  .summary .grand { border-top: 2px solid #111827; border-bottom: 2px solid #111827; }
  .summary .grand dt, .summary .grand dd { color: #111827; font-size: 13px; font-weight: 800; }
  @media print {
    html, body { background: #fff !important; }
    .page { width: auto; min-height: auto; margin: 0; padding: 0; }
  }
`;
