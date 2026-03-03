// src/app/(public)/signup/page.tsx

/*
'use client';

import { useActionState } from 'react';
import { signUp } from '@/lib/authActions/auth';

type FormState =
  | {
      error?: string;
      success?: boolean;
      message?: string;
    }
  | null;

export default function SignupPage() {
  const [state, formAction, isPending] =
    useActionState<FormState, FormData>(signUp, null);

  return (
    <form
      action={formAction}
      className="max-w-sm mx-auto mt-20 space-y-4"
    >
      <h1 className="text-2xl font-bold">Sign Up</h1>

      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="w-full border p-2"
      />

      <input
        name="password"
        type="password"
        required
        placeholder="Password"
        className="w-full border p-2"
      />

      {state?.error && (
        <p className="text-red-500 text-sm">
          {state.error}
        </p>
      )}

      {state?.success && (
        <p className="text-green-600 text-sm">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-black text-white p-2 disabled:opacity-50"
      >
        {isPending ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}
*/

'use client';

import { useActionState, useEffect, useState } from 'react';
import { signUp } from '@/lib/authActions/auth';
import { Mail, Lock, Loader2, UserPlus, ArrowRight, ShieldCheck, CheckCircle2, Timer } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Thêm router
import LegalModal from '@/components/modals/LegalModal';

type FormState =
  | {
      error?: string;
      success?: boolean;
      message?: string;
    }
  | null;

 function SignupPage__() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(signUp, null);
  const [shouldShake, setShouldShake] = useState(false);

  // Hiệu ứng rung và phản hồi vật lý khi có lỗi
  useEffect(() => {
    if (state?.error) {
      setShouldShake(true);
      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate([50, 30, 50]);
      }
      const timer = setTimeout(() => setShouldShake(false), 300);
      return () => clearTimeout(timer);
    }
  }, [state]);



// Thêm vào trong component SignupPage
const [modalConfig, setModalConfig] = useState<{isOpen: boolean, title: string, type: 'terms' | 'privacy'}>({
  isOpen: false,
  title: '',
  type: 'terms'
});

// Hàm tiện ích để mở modal
const openModal = (type: 'terms' | 'privacy') => {
  setModalConfig({
    isOpen: true,
    title: type === 'terms' ? 'Điều khoản dịch vụ' : 'Chính sách bảo mật',
    type
  });
};

  return (
    <> {/* <--- THÊM THẺ MỞ NÀY */}
      <div className="h-full flex items-center justify-center p-6">
        {/* Background Decor */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />

        <div className={`w-full max-w-[420px] relative ${shouldShake ? 'animate-shake' : ''}`}>
          <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)]">
            
            {/* Header Form */}
            <div className="flex flex-col items-center mb-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <UserPlus className="text-white" size={26} />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight">Khởi tạo tài khoản</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1 font-bold">Gia nhập hệ sinh thái TÂM VIỆT</p>
              </div>
            </div>

            {state?.success ? (
              // Khối Success
              <div className="space-y-6 py-4 animate-in fade-in zoom-in duration-500 text-center">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="text-emerald-500" size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-emerald-500">Đăng ký hoàn tất!</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {state.message || "Vui lòng kiểm tra hộp thư email để kích hoạt tài khoản."}
                  </p>
                </div>
                <Link href="/login" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-foreground text-background font-bold rounded-2xl">
                  QUAY LẠI ĐĂNG NHẬP
                </Link>
              </div>
            ) : (
              // Khối Form
              <form action={formAction} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Email định danh</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500" size={18} />
                    <input name="email" type="email" placeholder="name@company.com" required disabled={isPending} className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Mật mã truy cập</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500" size={18} />
                    <input name="password" type="password" placeholder="Tối thiểu 6 ký tự" required disabled={isPending} className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                  </div>
                </div>

                {state?.error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold p-3 rounded-xl">
                    LỖI HỆ THỐNG: {state.error.toUpperCase()}
                  </div>
                )}

                <button type="submit" disabled={isPending} className="w-full bg-foreground text-background font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl disabled:opacity-70">
                  {isPending ? <Loader2 size={20} className="animate-spin" /> : <>XÁC NHẬN ĐĂNG KÝ <ArrowRight size={18} /></>}
                </button>

                <div className="pt-2">
                  <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                    Bằng việc nhấn đăng ký, bạn đồng ý với{' '}
                    <button type="button" onClick={() => openModal('terms')} className="underline hover:text-emerald-500">Điều khoản dịch vụ</button>
                    {' '}và{' '}
                    <button type="button" onClick={() => openModal('privacy')} className="underline hover:text-emerald-500">Chính sách bảo mật</button>
                    {' '}của chúng tôi.
                  </p>
                </div>
              </form>
            )}

            {!state?.success && (
              <div className="mt-8 text-center pt-6 border-t border-border/40">
                <p className="text-xs text-muted-foreground font-medium">
                  Đã là thành viên? <Link href="/login" className="text-emerald-500 font-bold hover:underline">Đăng nhập</Link>
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale">
            <div className="flex items-center gap-1 text-[10px] font-mono tracking-tighter italic">
              <ShieldCheck size={12} /> END-TO-END_ENCRYPTED
            </div>
          </div>
        </div>
      </div>

      {/* ĐẶT MODAL Ở ĐÂY - TRONG FRAGMENT NHƯNG NGOÀI DIV CHÍNH */}
      <LegalModal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} 
        title={modalConfig.title}
        type={modalConfig.type}
      />
    </> // <--- THÊM THẺ ĐÓNG NÀY
  );
}





export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUp, null);
  const [shouldShake, setShouldShake] = useState(false);
  const [countdown, setCountdown] = useState(5); // State đếm ngược 5 giây
  const router = useRouter();

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    type: 'terms' as 'terms' | 'privacy'
  });

  // Hiệu ứng đếm ngược và tự động chuyển hướng khi thành công
  useEffect(() => {
    if (state?.success) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        router.push('/login'); // Chuyển hướng khi về 0
      }
    }
  }, [state?.success, countdown, router]);

  // Hiệu ứng rung khi lỗi (giữ nguyên)
  useEffect(() => {
    if (state?.error) {
      setShouldShake(true);
      const timer = setTimeout(() => setShouldShake(false), 300);
      return () => clearTimeout(timer);
    }
  }, [state?.error]);

  const openModal = (type: 'terms' | 'privacy') => {
    setModalConfig({
      isOpen: true,
      title: type === 'terms' ? 'Điều khoản dịch vụ' : 'Chính sách bảo mật',
      type
    });
  };

  return (
    <>
      <div className="h-full flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />

        <div className={`w-full max-w-[420px] relative ${shouldShake ? 'animate-shake' : ''}`}>
          <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)]">
            
            {/* Header Form */}
            <div className="flex flex-col items-center mb-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <UserPlus className="text-white" size={26} />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight">Khởi tạo tài khoản</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1 font-bold">Gia nhập hệ sinh thái TÂM VIỆT</p>
              </div>
            </div>

            {state?.success ? (
              /* --- KHỐI THÀNH CÔNG VỚI ĐẾM NGƯỢC --- */
              <div className="space-y-6 py-4 animate-in fade-in zoom-in duration-500 text-center">
                <div className="relative mx-auto w-20 h-20">
                    {/* Vòng tròn đếm ngược visual */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="40" cy="40" r="36"
                            stroke="currentColor" strokeWidth="4" fill="transparent"
                            className="text-emerald-500/10"
                        />
                        <circle
                            cx="40" cy="40" r="36"
                            stroke="currentColor" strokeWidth="4" fill="transparent"
                            strokeDasharray="226.2"
                            strokeDashoffset={226.2 - (226.2 * countdown) / 5}
                            className="text-emerald-500 transition-all duration-1000 ease-linear"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 className="text-emerald-500" size={32} />
                    </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-emerald-500">Đăng ký hoàn tất!</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed px-4">
                    Vui lòng kiểm tra email kích hoạt. Hệ thống sẽ đưa bạn quay lại trang đăng nhập sau...
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 py-2 rounded-full border border-emerald-500/10">
                        <Timer size={14} className="animate-pulse" />
                        TỰ ĐỘNG CHUYỂN HƯỚNG TRONG: {countdown}S
                    </div>
                    
                    <Link href="/login" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-all active:scale-95">
                        ĐĂNG NHẬP NGAY
                        <ArrowRight size={18} />
                    </Link>
                </div>
              </div>
            ) : (
              /* --- KHỐI FORM ĐĂNG KÝ (Giữ nguyên logic của bạn) --- */
              <form action={formAction} className="space-y-5">
                {/* ... Các trường input giữ nguyên ... */}
                
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Email định danh</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500" size={18} />
                    <input name="email" type="email" placeholder="name@company.com" required disabled={isPending} className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Mật mã truy cập</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500" size={18} />
                    <input name="password" type="password" placeholder="Tối thiểu 6 ký tự" required disabled={isPending} className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                  </div>
                </div>

                {state?.error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold p-3 rounded-xl animate-in fade-in slide-in-from-top-1">
                    LỖI HỆ THỐNG: {state.error.toUpperCase()}
                  </div>
                )}

                <button type="submit" disabled={isPending} className="w-full bg-foreground text-background font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl disabled:opacity-70 transition-all active:scale-95">
                  {isPending ? <Loader2 size={20} className="animate-spin" /> : <>XÁC NHẬN ĐĂNG KÝ <ArrowRight size={18} /></>}
                </button>

                <div className="pt-2 text-[10px] text-center text-muted-foreground leading-relaxed">
                    Bằng việc nhấn đăng ký, bạn đồng ý với{' '}
                    <button type="button" onClick={() => openModal('terms')} className="underline hover:text-emerald-500">Điều khoản dịch vụ</button>
                    {' '}và{' '}
                    <button type="button" onClick={() => openModal('privacy')} className="underline hover:text-emerald-500">Chính sách bảo mật</button>
                </div>
              </form>
            )}

            {!state?.success && (
              <div className="mt-8 text-center pt-6 border-t border-border/40">
                <p className="text-xs text-muted-foreground font-medium">
                  Đã là thành viên? <Link href="/login" className="text-emerald-500 font-bold hover:underline">Đăng nhập</Link>
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale">
            <div className="flex items-center gap-1 text-[10px] font-mono tracking-tighter italic">
              <ShieldCheck size={12} /> END-TO-END_ENCRYPTED
            </div>
          </div>
        </div>
      </div>

      <LegalModal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} 
        title={modalConfig.title}
        type={modalConfig.type}
      />
    </>
  );
}







