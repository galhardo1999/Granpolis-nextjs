import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('granpolis_session');

  // Rotas protegidas
  if (req.nextUrl.pathname.startsWith('/game')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Se estiver logado e tentar acessar login/registro, manda pro game
  if (token && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/registro')) {
    return NextResponse.redirect(new URL('/game', req.url));
  }

  // Landing page (página raiz) para não autenticados
  if (req.nextUrl.pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/game', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/registro', '/game/:path*'],
};
