import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [], // CSP nonce/middleware not needed for static export
};
