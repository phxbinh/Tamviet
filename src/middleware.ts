
// src/middleware.ts
/*
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
*/


import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Khởi tạo Supabase Client đặc biệt cho Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 2. Refresh session (Quan trọng nhất để không bị văng login)
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 🔒 Logic bảo vệ Route
  if (!user && (pathname.startsWith('/welcome') || pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 🔁 Đã login thì không cho quay lại auth pages
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/welcome', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match tất cả các request ngoại trừ:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (images, fonts, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}


