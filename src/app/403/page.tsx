import Link from 'next/link';
import { ShieldAlert, Home, LogIn } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    // Sử dụng h-full thay vì min-h-screen để khớp với vùng main cuộn của Layout
    <div className="h-full flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Icon cảnh báo với hiệu ứng Neon Đỏ/Cam */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
          <ShieldAlert size={80} className="text-orange-500 relative z-10" />
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl font-black tracking-tighter italic">
            403<span className="text-orange-500">!</span>
          </h1>
          <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">
            Truy cập bị từ chối
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            Tài khoản của bạn không có đủ thẩm quyền để thực thi yêu cầu này. 
            Vui lòng liên hệ quản trị viên hoặc chuyển đổi tài khoản.
          </p>
        </div>

        {/* Console-like Status */}
        <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3 font-mono text-[10px] text-orange-500/70 border border-orange-500/20">
          ERROR_CODE: ACCESS_CONTROL_VIOLATION
          <br />
          PERMISSION_STATUS: UNAUTHORIZED
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-bold hover:scale-105 transition-transform active:scale-95"
          >
            <Home size={18} />
            VỀ TRANG CHỦ
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-accent hover:border-orange-500/50 transition-all font-bold"
          >
            <LogIn size={18} />
            ĐĂNG NHẬP LẠI
          </Link>
        </div>
      </div>
    </div>
  );
}
