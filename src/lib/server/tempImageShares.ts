export type TempImageShare = {
  id: string;
  token: string;
  expiresAt: string;
  filename: string;
  contentType: string;
  publicPath: `/temp/imagegen/${string}`;
  localPath: `output/imagegen/${string}`;
  sourceInstruction: string;
};

const tempImageShares: Record<string, TempImageShare> = {};

export function getTempImageShare(id: string | undefined): TempImageShare | undefined {
  if (!id) return undefined;
  return tempImageShares[id];
}

export function getTempImageShareHeaders(share?: TempImageShare): HeadersInit {
  return {
    'cache-control': 'no-store, max-age=0',
    'x-content-type-options': 'nosniff',
    'x-robots-tag': 'noindex, nofollow, noarchive',
    ...(share ? { expires: new Date(share.expiresAt).toUTCString() } : {}),
  };
}

export function isTempImageShareExpired(share: TempImageShare): boolean {
  const expiresAt = new Date(share.expiresAt).getTime();
  return Number.isNaN(expiresAt) || Date.now() > expiresAt;
}

export async function buildTempImageResponse(share: TempImageShare, origin: string): Promise<Response> {
  const assetUrl = new URL(share.publicPath, origin);
  const assetResponse = await fetch(assetUrl);

  if (!assetResponse.ok || !assetResponse.body) {
    return new Response('Image not found', {
      status: 404,
      headers: getTempImageShareHeaders(share),
    });
  }

  return new Response(assetResponse.body, {
    status: 200,
    headers: {
      ...getTempImageShareHeaders(share),
      'content-type': share.contentType,
      'content-disposition': `inline; filename="${share.filename}"`,
    },
  });
}
