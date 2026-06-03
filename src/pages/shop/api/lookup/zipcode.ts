import type { APIRoute } from 'astro';

export const prerender = false;

const zipcodeRecords: Record<string, { postalCode: string; prefecture: string; city: string; street: string; address: string }> = {
  '1000001': {
    postalCode: '1000001',
    prefecture: '東京都',
    city: '千代田区',
    street: '千代田',
    address: '東京都千代田区千代田',
  },
  '1500001': {
    postalCode: '1500001',
    prefecture: '東京都',
    city: '渋谷区',
    street: '神宮前',
    address: '東京都渋谷区神宮前',
  },
  '5410041': {
    postalCode: '5410041',
    prefecture: '大阪府',
    city: '大阪市中央区',
    street: '北浜',
    address: '大阪府大阪市中央区北浜',
  },
};

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const postalCode = (url.searchParams.get('postalCode') ?? url.searchParams.get('zipcode') ?? '').replace(/\D/g, '');

  if (!/^\d{7}$/.test(postalCode)) {
    return Response.json(
      {
        success: false,
        error: 'postalCode must be 7 digits.',
      },
      { status: 400 },
    );
  }

  const record = zipcodeRecords[postalCode] ?? {
    postalCode,
    prefecture: '東京都',
    city: '港区',
    street: '南青山',
    address: '東京都港区南青山',
  };

  return Response.json({
    success: true,
    source: zipcodeRecords[postalCode] ? 'mock' : 'mock_fallback',
    address: record,
  });
};
