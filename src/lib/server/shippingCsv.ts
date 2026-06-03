import { csvDownloadResponse, toCsv, withUtf8Bom } from './csv';

export type ShippingCarrier = 'yamato' | 'sagawa';

export type ShippingInvoiceRow = {
  invoice_id: string;
  total_amount: number;
  customer_name: string;
  postal_code: string | null;
  address_line1: string | null;
  address_line2: string | null;
  phone_number: string | null;
};

export function normalizeShippingCarrier(value: unknown): ShippingCarrier | null {
  const carrier = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (carrier === 'yamato' || carrier === 'ヤマト') return 'yamato';
  if (carrier === 'sagawa' || carrier === '佐川') return 'sagawa';
  return null;
}

export function createShippingCsv(carrier: ShippingCarrier, rows: ShippingInvoiceRow[]): string {
  if (carrier === 'yamato') {
    return toCsv([
      [
        'お客様管理番号',
        '送り状種類',
        'クール区分',
        '出荷予定日',
        'お届け先電話番号',
        'お届け先郵便番号',
        'お届け先住所',
        'お届け先名称',
        'ご依頼主電話番号',
        'ご依頼主郵便番号',
        'ご依頼主住所',
        'ご依頼主名称',
        '品名コード1',
        '品名1',
        'コレクト代金引換金額',
      ],
      ...rows.map((row) => [
        row.invoice_id,
        0,
        0,
        '',
        normalizePhone(row.phone_number),
        normalizePostalCode(row.postal_code),
        joinAddress(row),
        row.customer_name,
        '',
        '',
        '',
        'AIBOUX',
        '',
        'AIBOUX基幹出荷品',
        0,
      ]),
    ]);
  }

  return toCsv([
    [
      'お届け先コード',
      'お届け先電話番号',
      'お届け先郵便番号',
      'お届け先住所１',
      'お届け先住所２',
      'お届け先名称１',
      'ご依頼主コード',
      '品名１',
      '品名２',
      '便種(通常/クール)',
      '代引金額',
    ],
    ...rows.map((row) => [
      '',
      normalizePhone(row.phone_number),
      normalizePostalCode(row.postal_code),
      row.address_line1 || 'お届け先住所サンプルフラット文字列',
      row.address_line2 || '',
      row.customer_name,
      '',
      'AIBOUX基幹出荷品',
      '',
      '000',
      0,
    ]),
  ]);
}

export function shippingCsvResponse(carrier: ShippingCarrier, rows: ShippingInvoiceRow[]): Response {
  const csv = createShippingCsv(carrier, rows);
  return csvDownloadResponse(`${carrier}_delivery_${Date.now()}.csv`, withUtf8Bom(csv), 'text/csv; charset=utf-8');
}

function joinAddress(row: ShippingInvoiceRow): string {
  return [row.address_line1 || 'お届け先住所サンプルフラット文字列', row.address_line2 || '']
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');
}

function normalizePostalCode(value: string | null): string {
  const text = value?.trim() ?? '';
  return text || '000-0000';
}

function normalizePhone(value: string | null): string {
  const text = value?.trim() ?? '';
  return text || '090-0000-0000';
}
