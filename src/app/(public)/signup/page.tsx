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
import { Mail, Lock, Loader2, UserPlus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

type FormState =
  | {
      error?: string;
      success?: boolean;
      message?: string;
    }
  | null;

export default function SignupPage() {
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

  return (
    <div className="h-full flex items-center justify-center p-6">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />

      <div className={`w-full max-w-[420px] relative ${shouldShake ? 'animate-shake' : ''}`}>
        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)]">
          
          <div className="flex flex-col items-center mb-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <UserPlus className="text-white" size={26} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">Khởi tạo tài khoản</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1 font-bold">Gia nhập hệ sinh thái NEON</p>
            </div>
          </div>

          {/* Trạng thái thành công - Thông báo chuyên nghiệp */}
          {state?.success ? (
            <div className="space-y-6 py-4 animate-in fade-in zoom-in duration-500 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="text-emerald-500" size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-emerald-500">Đăng ký hoàn tất!</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {state.message || "Vui lòng kiểm tra hộp thư email để kích hoạt tài khoản trước khi đăng nhập."}
                </p>
              </div>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-all"
              >
                QUAY LẠI ĐĂNG NHẬP
              </Link>
            </div>
          ) : (
            <form action={formAction} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Email định danh</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    disabled={isPending}
                    className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Mật mã truy cập</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    name="password"
                    type="password"
                    placeholder="Tối thiểu 6 ký tự"
                    required
                    disabled={isPending}
                    className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Error Message */}
              {state?.error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold p-3 rounded-xl animate-in fade-in slide-in-from-top-1">
                  LỖI HỆ THỐNG: {state.error.toUpperCase()}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-foreground text-background font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl disabled:opacity-70"
              >
                {isPending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    XÁC NHẬN ĐĂNG KÝ
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="pt-2">
                <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                  Bằng cách nhấn đăng ký, bạn đồng ý với <Link href="#" className="underline">Điều khoản dịch vụ</Link> và <Link href="#" className="underline">Chính sách bảo mật</Link> của chúng tôi.
                </p>
              </div>
            </form>
          )}

          {/* Footer Card */}
          {!state?.success && (
            <div className="mt-8 text-center pt-6 border-t border-border/40">
              <p className="text-xs text-muted-foreground font-medium">
                Đã là thành viên?{' '}
                <Link href="/login" className="text-emerald-500 font-bold hover:underline">Đăng nhập</Link>
              </p>
            </div>
          )}
        </div>

        {/* Security Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale">
          <div className="flex items-center gap-1 text-[10px] font-mono tracking-tighter italic">
            <ShieldCheck size={12} />
            END-TO-END_ENCRYPTED
          </div>
        </div>
      </div>
    </div>
  );
}









