
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSupabaseServerClient } from './lib/supabase/server'

export const config = {
  matcher: [
    '/welcome/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  // 🔒 CHƯA LOGIN → KHÔNG VÀO APP / ADMIN
  if (
    (pathname.startsWith('/welcome') ||
      pathname.startsWith('/admin')) &&
    !user
  ) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 🔁 ĐÃ LOGIN → KHÔNG QUAY LẠI LOGIN / SIGNUP
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/welcome', req.url))
  }

  return res
}
