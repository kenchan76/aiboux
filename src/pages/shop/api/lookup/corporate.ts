import type { APIRoute } from 'astro';

export const prerender = false;

type CorporateRecord = {
  corporateNumber: string;
  companyName: string;
  postalCode: string;
  address: string;
};

const corporateRecords: CorporateRecord[] = [
  {
    corporateNumber: '7010001243121',
    companyName: '株式会社AIBOUX',
    postalCode: '1000001',
    address: '東京都千代田区千代田1-1',
  },
  {
    corporateNumber: '3020001189981',
    companyName: '株式会社サンプル商事',
    postalCode: '1500001',
    address: '東京都渋谷区神宮前1-2-3',
  },
  {
    corporateNumber: '5120001204455',
    companyName: '合同会社北浜ストア',
    postalCode: '5410041',
    address: '大阪府大阪市中央区北浜2-1-1',
  },
];

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const query = (url.searchParams.get('q') ?? url.searchParams.get('corporateNumber') ?? '').trim();
  const normalized = query.replace(/\D/g, '');
  const lowered = query.toLowerCase();

  const suggestions = corporateRecords.filter((record) => {
    if (!query) return true;
    return (
      record.corporateNumber.includes(normalized) ||
      record.companyName.toLowerCase().includes(lowered) ||
      record.address.toLowerCase().includes(lowered)
    );
  });

  return Response.json({
    success: true,
    source: 'mock',
    suggestions: suggestions.slice(0, 5),
  });
};
