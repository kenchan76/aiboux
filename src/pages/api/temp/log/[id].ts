import type { APIRoute } from 'astro';
import {
  getTempLogShare,
  getTempLogShareHeaders,
  isTempLogShareExpired,
} from '@/lib/server/tempLogShares';

export const prerender = false;

export const GET: APIRoute = ({ params, request }) => {
  const url = new URL(request.url);
  const share = getTempLogShare(params.id);

  if (!share || url.searchParams.get('token') !== share.token) {
    return new Response('Not found', {
      status: 404,
      headers: getTempLogShareHeaders(),
    });
  }

  if (isTempLogShareExpired(share)) {
    return new Response('This temporary log URL has expired.', {
      status: 410,
      headers: getTempLogShareHeaders(share),
    });
  }

  return new Response(share.content, {
    status: 200,
    headers: {
      ...getTempLogShareHeaders(share),
      'content-type': 'text/markdown; charset=utf-8',
      'content-disposition': `inline; filename="${share.filename}"`,
    },
  });
};
