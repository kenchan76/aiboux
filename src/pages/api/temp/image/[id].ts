import type { APIRoute } from 'astro';
import {
  buildTempImageResponse,
  getTempImageShare,
  getTempImageShareHeaders,
  isTempImageShareExpired,
} from '@/lib/server/tempImageShares';

export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
  const share = getTempImageShare(params.id);

  if (!share || url.searchParams.get('token') !== share.token) {
    return new Response('Not found', {
      status: 404,
      headers: getTempImageShareHeaders(),
    });
  }

  if (isTempImageShareExpired(share)) {
    return new Response('This temporary image URL has expired.', {
      status: 410,
      headers: getTempImageShareHeaders(share),
    });
  }

  return buildTempImageResponse(share, url.origin);
};
