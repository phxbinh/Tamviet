// src/app/(public)/welcome/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout';
import { CheckCircle2, ShieldCheck, ArrowRight, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default async function WelcomePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="h-full flex items-center justify-center p-2">
      {/* Background trang trí nhẹ nhàng, không gây rối mắt */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
          
          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Badge xác thực thành công */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide uppercase">
              <ShieldCheck size={14} />
              Xác thực hệ thống thành công
            </div>

            {/* Avatar giả lập & Lời chào */}
            <div className="space-y-2">
              <div className="relative mx-auto w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 rounded-full animate-pulse" />
                <div className="relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-white">
                   <UserCircle size={48} strokeWidth={1.5} />
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-background border-2 border-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Chào mừng trở lại,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
                  {user.email?.split('@')[0]}
                </span>
              </h1>
              
              <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                Mọi thứ đã sẵn sàng. Hệ thống đã đồng bộ hóa dữ liệu cá nhân của bạn để bắt đầu phiên làm việc mới.
              </p>
            </div>

            {/* Thông tin tài khoản gọn gàng */}
            <div className="w-full py-4 px-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/40 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Tài khoản đăng nhập</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
              <div className="h-8 w-px bg-border/50" />
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Trạng thái</p>
                <p className="text-sm font-medium text-emerald-500 italic">Đang hoạt động</p>
              </div>
            </div>

            {/* Nhóm nút điều hướng chính */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <Link
                href="/dashboard"
                className="flex-1 w-full flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-bold rounded-2xl hover:scale-[1.02] transition-all active:scale-95 group shadow-xl"
              >
                VÀO BẢNG ĐIỀU KHIỂN
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="w-full sm:w-auto">
                <LogoutButton />
              </div>
            </div>

          </div>
        </div>

        {/* Footer trang chào mừng */}
        <p className="mt-8 text-center text-xs text-muted-foreground/60 uppercase tracking-[0.3em]">
          Secure Session ID: {user.id.slice(0, 8)}...
        </p>
      </div>
    </div>
  );
}



