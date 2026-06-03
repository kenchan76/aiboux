export function toCsv(rows: Array<Array<string | number | null | undefined>>): string {
  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
}

export function withUtf8Bom(value: string): Uint8Array {
  const body = new TextEncoder().encode(value);
  const output = new Uint8Array(body.length + 3);
  output.set([0xef, 0xbb, 0xbf], 0);
  output.set(body, 3);
  return output;
}

export function csvDownloadResponse(fileName: string, body: string | Uint8Array, contentType = 'text/csv; charset=utf-8'): Response {
  const responseBody: BodyInit = typeof body === 'string' ? body : new Uint8Array(body);

  return new Response(responseBody, {
    headers: {
      'content-type': contentType,
      'content-disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      'cache-control': 'no-store',
    },
  });
}

function escapeCsvCell(value: string | number | null | undefined): string {
  const text = value === null || value === undefined ? '' : String(value);
  if (!/[",\r\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}
