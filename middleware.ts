// next-csp.ts (utility to generate nonce per request)
import { NextRequest, NextResponse } from 'next/server';

export function generateNonce() {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

export function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const response = NextResponse.next();
  response.headers.set('x-nonce', nonce);
  return response;
}

export const config = {
  matcher: '/:path*',
};
