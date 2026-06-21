import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/auth';

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Décoder la session si elle existe
  let session = null;
  if (sessionToken) {
    try {
      session = await decrypt(sessionToken);
    } catch (e) {
      // Token invalide
    }
  }

  // Si on est sur une route admin sans session valide -> redirection vers login
  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si on a une session valide et qu'on essaie d'aller sur login/signup -> redirection vers admin
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/signup'],
};
