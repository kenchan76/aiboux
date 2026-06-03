import { shopProducts, type ShopOrder, type ShopOrderItem } from "@/data/shop-sample-data";

export type ShopDocumentKind = "delivery" | "invoice" | "receipt";

const issuer = {
  name: "AIBOUX STORE",
  registrationNumber: "T7010001243121",
  postalCode: "100-0001",
  address: "東京都千代田区千代田1-1",
  email: "support@shop.aiboux.com",
  tel: "03-0000-0000",
  logoUrl: "/brand/aiboux-logo.svg",
};

type TaxSummary = {
  rate: 10 | 8;
  gross: number;
  tax: number;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatYen(value: number) {
  return `¥${Math.round(value).toLocaleString("ja-JP")}`;
}

function documentTitle(kind: ShopDocumentKind) {
  if (kind === "delivery") return "納品書";
  if (kind === "receipt") return "領収書";
  return "適格請求書";
}

function documentPrefix(kind: ShopDocumentKind) {
  if (kind === "delivery") return "D";
  if (kind === "receipt") return "R";
  return "I";
}

function productImage(productId: string) {
  return shopProducts.find((product) => product.id === productId)?.image ?? "";
}

function lineGrossTotal(items: ShopOrderItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function taxRateForItem(item: ShopOrderItem): 10 | 8 {
  const text = `${item.name} ${item.sku}`.toLowerCase();
  return text.includes("food") || text.includes("食品") ? 8 : 10;
}

function summarizeTax(order: ShopOrder): TaxSummary[] {
  const subtotal = lineGrossTotal(order.items);
  const adjustment = order.total - subtotal;
  const summaries: Record<10 | 8, TaxSummary> = {
    10: { rate: 10, gross: 0, tax: 0 },
    8: { rate: 8, gross: 0, tax: 0 },
  };

  for (const item of order.items) {
    const rate = taxRateForItem(item);
    summaries[rate].gross += item.price * item.quantity;
  }
  if (adjustment !== 0) summaries[10].gross += adjustment;

  for (const summary of Object.values(summaries)) {
    const net = Math.round(summary.gross / (1 + summary.rate / 100));
    summary.tax = summary.gross - net;
  }

  return [summaries[10], summaries[8]];
}

function buildItemRows(order: ShopOrder) {
  const subtotal = lineGrossTotal(order.items);
  const adjustment = order.total - subtotal;
  const rows = order.items
    .map((item) => {
      const image = productImage(item.productId);
      const rate = taxRateForItem(item);
      return `
        <tr>
          <td class="image-cell">${image ? `<img src="${escapeHtml(image)}" alt="" />` : `<div class="image-fallback">NO IMAGE</div>`}</td>
          <td>
            <div class="item-name">${escapeHtml(item.name)}</div>
            <div class="muted">SKU: ${escapeHtml(item.sku)}</div>
          </td>
          <td class="number">${item.quantity}</td>
          <td class="number">${formatYen(item.price)}</td>
          <td class="number">${rate}%</td>
          <td class="number strong">${formatYen(item.price * item.quantity)}</td>
        </tr>`;
    })
    .join("");

  if (adjustment === 0) return rows;
  return `${rows}
        <tr>
          <td class="image-cell"><div class="image-fallback">SHIP</div></td>
          <td>
            <div class="item-name">送料・調整額</div>
            <div class="muted">注文合計との差額</div>
          </td>
          <td class="number">1</td>
          <td class="number">${formatYen(adjustment)}</td>
          <td class="number">10%</td>
          <td class="number strong">${formatYen(adjustment)}</td>
        </tr>`;
}

function buildTaxRows(order: ShopOrder) {
  return summarizeTax(order)
    .map(
      (summary) => `
        <tr>
          <th>${summary.rate}%対象 税込対価</th>
          <td class="number">${formatYen(summary.gross)}</td>
          <th>${summary.rate}%対象 消費税額</th>
          <td class="number">${formatYen(summary.tax)}</td>
        </tr>`,
    )
    .join("");
}

function buildDocumentPage(order: ShopOrder, kind: ShopDocumentKind) {
  const title = documentTitle(kind);
  const documentNumber = `${documentPrefix(kind)}-${order.id.replace("#", "")}`;
  const issuedAt = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const receiptNote =
    kind === "receipt"
      ? `<section class="receipt-note">上記金額を正に領収いたしました。<br />但し、${escapeHtml(order.id)}の商品代金として。</section>`
      : "";

  return `
    <article class="paper">
      <header class="doc-header">
        <section class="recipient-box">
          <div class="doc-title">${escapeHtml(title)}</div>
          <div class="recipient-label">ご請求先 / お届け先</div>
          <div class="recipient-name">${escapeHtml(order.customerName)} <span>様</span></div>
          <div class="recipient-email">${escapeHtml(order.customerEmail)}</div>
        </section>
        <section class="issuer-box">
          <img class="shop-logo" src="${escapeHtml(issuer.logoUrl)}" alt="aiboux" />
          <div class="issuer-name">${escapeHtml(issuer.name)}</div>
          <div>登録番号: ${escapeHtml(issuer.registrationNumber)}</div>
          <div>〒${escapeHtml(issuer.postalCode)} ${escapeHtml(issuer.address)}</div>
          <div>TEL: ${escapeHtml(issuer.tel)} / ${escapeHtml(issuer.email)}</div>
        </section>
      </header>

      <section class="doc-info-grid">
        <div><span>書類番号</span><strong>${escapeHtml(documentNumber)}</strong></div>
        <div><span>注文番号</span><strong>${escapeHtml(order.id)}</strong></div>
        <div><span>注文日</span><strong>${escapeHtml(order.orderedAt)}</strong></div>
        <div><span>発行日</span><strong>${issuedAt}</strong></div>
        <div><span>決済状況</span><strong>${escapeHtml(order.paymentStatus)}</strong></div>
        <div><span>配送状況</span><strong>${escapeHtml(order.trackingNumber || order.deliveryStatus)}</strong></div>
      </section>

      <table class="items-table" aria-label="明細">
        <thead>
          <tr>
            <th class="image-cell">画像</th>
            <th>商品</th>
            <th class="number">数量</th>
            <th class="number">単価(税込)</th>
            <th class="number">税率</th>
            <th class="number">金額(税込)</th>
          </tr>
        </thead>
        <tbody>${buildItemRows(order)}</tbody>
      </table>

      <section class="bottom-grid">
        <div class="notes">
          <strong>備考</strong>
          <p>本書類は適格請求書等保存方式の記載事項に合わせ、登録番号、取引日、取引内容、税率ごとの税込対価、消費税額、交付先を表示しています。</p>
        </div>
        <div class="totals">
          <table aria-label="税率別合計">
            <tbody>
              ${buildTaxRows(order)}
              <tr class="grand-total"><th colspan="3">合計金額</th><td class="number">${formatYen(order.total)}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      ${receiptNote}
      <footer class="doc-footer">
        <span>${escapeHtml(issuer.name)}</span>
        <span>${escapeHtml(title)} ${escapeHtml(documentNumber)}</span>
      </footer>
    </article>`;
}

function buildDocumentCss() {
  return `
    @page { size: A4; margin: 0; }
    * {
      box-sizing: border-box;
      font-family: "Noto Sans JP", "Yu Gothic UI", "Yu Gothic", "Hiragino Kaku Gothic ProN", Meiryo, system-ui, sans-serif !important;
    }
    html, body { margin: 0; min-height: 100%; color: #171717; background: #e5e5e5; }
    body { font-size: 12px; line-height: 1.55; }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      width: 210mm;
      margin: 0 auto;
      padding: 10px 0;
      background: #e5e5e5;
    }
    .toolbar button {
      height: 32px;
      border: 1px solid #d4d4d4;
      border-radius: 6px;
      background: #fff;
      padding: 0 12px;
      color: #171717;
      cursor: pointer;
    }
    .paper {
      position: relative;
      width: 210mm;
      height: 297mm;
      margin: 0 auto 14px;
      padding: 15mm 16mm 13mm;
      overflow: hidden;
      background: #fff;
      page-break-after: always;
    }
    .paper:last-child { page-break-after: auto; }
    .doc-header {
      display: grid;
      grid-template-columns: 1.15fr .85fr;
      gap: 14mm;
      padding-bottom: 8mm;
      border-bottom: 1px solid #171717;
    }
    .doc-title {
      margin-bottom: 13mm;
      font-size: 25px;
      font-weight: 700;
      letter-spacing: .08em;
    }
    .recipient-label, .muted { color: #737373; font-size: 10px; }
    .recipient-name { margin-top: 3mm; font-size: 19px; font-weight: 700; }
    .recipient-name span { margin-left: 3mm; font-size: 13px; font-weight: 500; }
    .recipient-email { margin-top: 1mm; color: #525252; }
    .issuer-box { text-align: right; color: #404040; font-size: 11px; }
    .shop-logo { width: 39mm; max-height: 14mm; object-fit: contain; object-position: right center; margin-bottom: 3mm; }
    .issuer-name { margin-bottom: 1mm; color: #171717; font-size: 15px; font-weight: 700; }
    .doc-info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      margin-top: 7mm;
      border: 1px solid #d4d4d4;
      background: #d4d4d4;
    }
    .doc-info-grid div { min-height: 12mm; background: #fff; padding: 2.3mm 3mm; }
    .doc-info-grid span { display: block; color: #737373; font-size: 10px; }
    .doc-info-grid strong { display: block; margin-top: 1mm; font-size: 12px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; }
    .items-table { margin-top: 8mm; border: 1px solid #d4d4d4; }
    th {
      background: #f5f5f5;
      border-bottom: 1px solid #d4d4d4;
      padding: 2.4mm 2.6mm;
      color: #404040;
      font-size: 10.5px;
      font-weight: 700;
      text-align: left;
    }
    td {
      border-top: 1px solid #e5e5e5;
      padding: 2.4mm 2.6mm;
      vertical-align: middle;
    }
    .image-cell { width: 18mm; text-align: center; }
    .image-cell img, .image-fallback {
      display: inline-flex;
      width: 12mm;
      height: 12mm;
      align-items: center;
      justify-content: center;
      border: 1px solid #e5e5e5;
      border-radius: 3px;
      object-fit: cover;
      color: #a3a3a3;
      font-size: 7px;
    }
    .item-name { color: #171717; font-weight: 600; }
    .number { text-align: right; white-space: nowrap; }
    .strong { font-weight: 700; }
    .bottom-grid {
      display: grid;
      grid-template-columns: 1fr 88mm;
      gap: 8mm;
      margin-top: 8mm;
      align-items: start;
    }
    .notes {
      min-height: 34mm;
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      padding: 3mm;
      color: #525252;
      font-size: 10px;
    }
    .notes p { margin: 2mm 0 0; }
    .totals table { border: 1px solid #d4d4d4; }
    .totals th, .totals td { border: 1px solid #e5e5e5; padding: 2.4mm 2.8mm; }
    .totals th { width: 34%; background: #fafafa; }
    .grand-total th, .grand-total td { background: #171717; color: #fff; font-size: 15px; font-weight: 700; }
    .receipt-note {
      margin-top: 7mm;
      border: 1px solid #d4d4d4;
      border-radius: 5px;
      padding: 4mm;
      font-size: 13px;
      font-weight: 600;
    }
    .doc-footer {
      position: absolute;
      right: 16mm;
      bottom: 8mm;
      left: 16mm;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #e5e5e5;
      padding-top: 2mm;
      color: #737373;
      font-size: 10px;
    }
    @media print {
      html, body { width: 210mm; background: #fff; }
      .toolbar { display: none; }
      .paper { margin: 0; box-shadow: none; }
    }`;
}

export function buildShopDocumentsHtml(orders: ShopOrder[], kind: ShopDocumentKind) {
  const title = documentTitle(kind);
  const pages = orders.map((order) => buildDocumentPage(order, kind)).join("\n");
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} 一括出力</title>
  <style>${buildDocumentCss()}</style>
</head>
<body>
  <div class="toolbar">
    <button onclick="window.print()">印刷 / PDF保存</button>
    <button onclick="window.close()">閉じる</button>
  </div>
  ${pages}
</body>
</html>`;
}

export function buildShopDocumentHtml(order: ShopOrder, kind: ShopDocumentKind) {
  return buildShopDocumentsHtml([order], kind);
}

export function printShopDocuments(orders: ShopOrder[], kind: ShopDocumentKind) {
  const printWindow = window.open("", "_blank", "width=980,height=920");
  if (!printWindow) return false;
  printWindow.document.open();
  printWindow.document.write(buildShopDocumentsHtml(orders, kind));
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 350);
  return true;
}

export function printShopDocument(order: ShopOrder, kind: ShopDocumentKind) {
  return printShopDocuments([order], kind);
}
