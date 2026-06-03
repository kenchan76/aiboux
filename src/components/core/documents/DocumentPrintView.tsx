export type PrintableDocument = {
  id: string;
  type: "quote" | "delivery" | "invoice";
  typeLabel: string;
  documentNumber: string;
  customerName: string;
  issueDate: string;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  lines: Array<{
    id: string;
    lineNo: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

type DocumentPrintViewProps = {
  document: PrintableDocument;
};

const company = {
  name: "株式会社雪花",
  service: "aiboux CORE",
  postalCode: "049-3521",
  address: "北海道山越郡長万部町字長万部",
  phone: "01377-0-0000",
  invoiceNumber: "T0000000000000",
};

export function DocumentPrintView({ document }: DocumentPrintViewProps) {
  return (
    <>
      <style>{printCss}</style>
      <div className="print-toolbar print-actions">
        <button type="button" id="print-document-button">
          印刷 / PDF保存
        </button>
      </div>
      <article className="document-print-page">
        <header className="document-header">
          <div>
            <div className="brand">aiboux</div>
            <div className="service">{company.service}</div>
          </div>
          <div className="document-title">{document.typeLabel}</div>
        </header>

        <section className="document-meta">
          <div className="customer-block">
            <div className="label">御中</div>
            <div className="customer-name">{document.customerName}</div>
            <p>下記の通り{document.type === "delivery" ? "納品いたしました。" : document.type === "quote" ? "お見積り申し上げます。" : "ご請求申し上げます。"}</p>
          </div>
          <dl className="number-block">
            <div>
              <dt>帳票番号</dt>
              <dd>{document.documentNumber}</dd>
            </div>
            <div>
              <dt>発行日</dt>
              <dd>{formatDate(document.issueDate)}</dd>
            </div>
          </dl>
        </section>

        <section className="company-block">
          <div className="company-name">{company.name}</div>
          <div>〒{company.postalCode}</div>
          <div>{company.address}</div>
          <div>TEL {company.phone}</div>
          <div>登録番号 {company.invoiceNumber}</div>
        </section>

        <section className="total-hero">
          <span>合計金額</span>
          <strong>{formatCurrency(document.totalAmount)}</strong>
        </section>

        <table className="line-table">
          <thead>
            <tr>
              <th className="no">No.</th>
              <th>品名</th>
              <th className="qty">数量</th>
              <th className="price">単価</th>
              <th className="amount">金額</th>
            </tr>
          </thead>
          <tbody>
            {document.lines.map((line) => (
              <tr key={line.id}>
                <td className="no">{line.lineNo}</td>
                <td>{line.productName}</td>
                <td className="qty">{formatQuantity(line.quantity)}</td>
                <td className="price">{formatCurrency(line.unitPrice)}</td>
                <td className="amount">{formatCurrency(line.lineTotal)}</td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 10 - document.lines.length) }).map((_, index) => (
              <tr key={`blank-${index}`} className="blank-row">
                <td className="no">&nbsp;</td>
                <td />
                <td className="qty" />
                <td className="price" />
                <td className="amount" />
              </tr>
            ))}
          </tbody>
        </table>

        <section className="summary-block">
          <dl>
            <div>
              <dt>小計</dt>
              <dd>{formatCurrency(document.subtotalAmount)}</dd>
            </div>
            <div>
              <dt>消費税 10%</dt>
              <dd>{formatCurrency(document.taxAmount)}</dd>
            </div>
            <div className="grand-total">
              <dt>合計</dt>
              <dd>{formatCurrency(document.totalAmount)}</dd>
            </div>
          </dl>
        </section>

        <footer className="document-footer">
          <div>備考</div>
          <p>本帳票はAIBOUX Coreで作成されています。内容をご確認のうえ保管してください。</p>
        </footer>
      </article>
    </>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function formatQuantity(value: number) {
  return Number.isInteger(value) ? String(value) : String(value.toFixed(2)).replace(/\.?0+$/, "");
}

const printCss = `
  @page {
    size: A4 portrait;
    margin: 0;
  }

  html,
  body {
    margin: 0;
    background: #f5f5f5;
    color: #111827;
    font-family: 'Noto Sans JP', sans-serif;
  }

  .print-toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    padding: 12px;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
  }

  .print-toolbar button {
    border: 1px solid #111827;
    background: #111827;
    color: #ffffff;
    border-radius: 6px;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .document-print-page {
    box-sizing: border-box;
    width: 210mm;
    min-height: 297mm;
    margin: 12mm auto;
    padding: 18mm 16mm;
    background: #ffffff;
    box-shadow: 0 8px 30px rgba(15, 23, 42, 0.12);
  }

  .document-header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: start;
    gap: 16mm;
    border-bottom: 2px solid #111827;
    padding-bottom: 8mm;
  }

  .brand {
    font-size: 24px;
    font-weight: 800;
    line-height: 1;
  }

  .service {
    margin-top: 2mm;
    font-size: 11px;
    letter-spacing: 0.04em;
    color: #4b5563;
  }

  .document-title {
    font-size: 27px;
    font-weight: 800;
    letter-spacing: 0.18em;
  }

  .document-meta {
    display: grid;
    grid-template-columns: 1fr 70mm;
    gap: 12mm;
    margin-top: 12mm;
  }

  .label {
    font-size: 12px;
    color: #6b7280;
  }

  .customer-name {
    width: 100%;
    border-bottom: 1px solid #111827;
    padding: 2mm 0 3mm;
    font-size: 20px;
    font-weight: 700;
  }

  .customer-block p {
    margin: 5mm 0 0;
    font-size: 12px;
    color: #374151;
  }

  .number-block,
  .summary-block dl {
    margin: 0;
  }

  .number-block div,
  .summary-block div {
    display: grid;
    grid-template-columns: 28mm 1fr;
    border-bottom: 1px solid #d1d5db;
    min-height: 8mm;
    align-items: center;
  }

  dt {
    font-size: 11px;
    color: #6b7280;
  }

  dd {
    margin: 0;
    text-align: right;
    font-size: 12px;
    font-weight: 600;
  }

  .company-block {
    margin: 8mm 0 0 auto;
    width: 70mm;
    font-size: 11px;
    line-height: 1.7;
  }

  .company-name {
    font-size: 14px;
    font-weight: 800;
  }

  .total-hero {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    width: 78mm;
    margin-top: 10mm;
    border: 2px solid #111827;
    padding: 4mm 5mm;
  }

  .total-hero span {
    font-size: 12px;
    font-weight: 700;
  }

  .total-hero strong {
    font-size: 22px;
    line-height: 1;
  }

  .line-table {
    width: 100%;
    margin-top: 10mm;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 11px;
  }

  .line-table th {
    border: 1px solid #111827;
    background: #f3f4f6;
    padding: 2.2mm;
    text-align: left;
    font-weight: 800;
  }

  .line-table td {
    border: 1px solid #d1d5db;
    padding: 2.2mm;
    height: 8mm;
    vertical-align: middle;
  }

  .line-table .no {
    width: 10mm;
    text-align: center;
  }

  .line-table .qty {
    width: 20mm;
    text-align: right;
  }

  .line-table .price,
  .line-table .amount {
    width: 28mm;
    text-align: right;
  }

  .blank-row td {
    color: transparent;
  }

  .summary-block {
    width: 72mm;
    margin: 8mm 0 0 auto;
  }

  .summary-block .grand-total {
    border-top: 2px solid #111827;
    border-bottom: 2px solid #111827;
  }

  .summary-block .grand-total dt,
  .summary-block .grand-total dd {
    color: #111827;
    font-size: 15px;
    font-weight: 800;
  }

  .document-footer {
    margin-top: 14mm;
    border: 1px solid #d1d5db;
    min-height: 24mm;
    padding: 3mm;
    font-size: 11px;
  }

  .document-footer div {
    font-weight: 700;
  }

  .document-footer p {
    margin: 2mm 0 0;
    color: #4b5563;
  }

  @media print {
    html,
    body {
      width: 210mm;
      min-height: 297mm;
      background: #ffffff !important;
    }

    .print-actions {
      display: none !important;
    }

    .document-print-page {
      width: 210mm;
      min-height: 297mm;
      margin: 0;
      box-shadow: none;
      page-break-after: always;
    }
  }
`;
