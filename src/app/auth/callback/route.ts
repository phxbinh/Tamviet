// src/app/auth/callback/route.ts
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Lấy địa chỉ trang tiếp theo (mặc định là /change-password như đã cài ở hàm requestPasswordReset)
  const next = searchParams.get('next') ?? '/welcome';

  if (code) {
    const supabase = await createSupabaseServerClient();
    
    // Đổi code lấy session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Xác thực thành công -> Đi tới trang đổi mật khẩu hoặc trang chủ
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Nếu lỗi, về trang login với thông báo lỗi
  return NextResponse.redirect(`${origin}/login?error=Xác thực link không hợp lệ hoặc đã hết hạn`);
}
