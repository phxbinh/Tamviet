
// src/middleware.ts
/*
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

  // 3. Định nghĩa các nhóm Route
  const isAuthPage = pathname === '/login' || 
                     pathname === '/signup' || 
                     pathname === '/forgot-password' || 
                     pathname === '/change-password';

  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/welcome') || 
                           pathname.startsWith('/admin');

  // 🔒 TRƯỜNG HỢP 1: Chưa đăng nhập mà cố vào vùng cấm
  if (!user && isProtectedRoute) {
    // Lưu lại trang định vào để sau khi login xong quay lại (Optionally)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 🔁 TRƯỜNG HỢP 2: Đã đăng nhập rồi thì không cho vào các trang Auth (trừ đổi mật khẩu nếu cần)
  // Lưu ý: Nếu user đang dùng link Reset Pass, họ cần vào /change-password, 
  // nhưng thường link đó đã qua /auth/callback rồi nên user đã có session.
  if (user && isAuthPage) {
    // Nếu là admin thì về admin, không thì về dashboard
    // Ở đây mình tạm thời đẩy về /dashboard vì đó là trục chính
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
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

  // 1. Khởi tạo Supabase Client cho Middleware
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

  // 2. Lấy thông tin User và Pathname
  // Lưu ý: getUser() là cách an toàn nhất để kiểm tra session trong middleware
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // 3. Định nghĩa các nhóm Route
  
  // Trang CHỈ dành cho khách (Người đã login KHÔNG được vào lại)
  const isGuestOnlyPage = pathname === '/login' || 
                          pathname === '/signup' || 
                          pathname === '/forgot-password';

  // Trang Đổi mật khẩu (Cần cho phép cả người dùng mới click link reset email)
  const isChangePasswordPage = pathname === '/change-password';

  // Các vùng bảo vệ (Cần login mới được vào)
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/welcome') || 
                           pathname.startsWith('/admin');

  // --- LOGIC ĐIỀU HƯỚNG ---

  // 🔒 TH1: Cố tình vào trang bảo vệ hoặc trang đổi mật khẩu mà CHƯA có session
  if (!user && (isProtectedRoute || isChangePasswordPage)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 🔁 TH2: Đã đăng nhập rồi thì KHÔNG cho vào Login/Signup/Forgot-Pass
  // Nhưng cho phép vào /change-password để thực hiện đổi mật khẩu
  if (user && isGuestOnlyPage) {
    // Nếu là admin thì bạn có thể thêm logic check role ở đây
    return NextResponse.redirect(new URL('/dashboard', request.url))
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


