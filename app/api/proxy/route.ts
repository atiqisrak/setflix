import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
      'Access-Control-Allow-Headers': 'Range,Content-Type,Accept',
    },
  });
}

export async function GET(req: Request) {
  try {
    const urlObj = new URL(req.url);
    const target = urlObj.searchParams.get('url');
    if (!target) return new Response('Missing `url` query param', { status: 400 });

    const range = req.headers.get('range') || undefined;

    const upstream = await fetch(target, {
      method: 'GET',
      headers: range ? { Range: range } : undefined,
      redirect: 'follow',
    });

    // Build headers to return to client
    const headers = new Headers(upstream.headers);

    // Ensure CORS and expose range-related headers so the browser can access them
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Range,Content-Type,Accept');
    headers.set('Access-Control-Expose-Headers', 'Accept-Ranges,Content-Encoding,Content-Length,Content-Range');

    // Return the upstream body/stream with original status and headers
    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (err: any) {
    return new Response(String(err?.message || 'Proxy error'), { status: 502 });
  }
}
