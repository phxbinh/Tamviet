'use client';

import { useActionState, useEffect, useState } from 'react';
import { requestPasswordReset } from '@/lib/authActions/auth';
import { Mail, Loader2, ArrowLeft, SendHorizontal, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, null);
  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    if (state?.error) {
      setShouldShake(true);
      const timer = setTimeout(() => setShouldShake(false), 300);
      return () => clearTimeout(timer);
    }
  }, [state?.error]);

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className={`w-full max-w-[400px] relative ${shouldShake ? 'animate-shake' : ''}`}>
        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 shadow-xl">
          
          <div className="flex flex-col items-center mb-8 space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
              <Mail size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Quên mật mã?</h1>
            <p className="text-xs text-muted-foreground leading-relaxed px-4">
              Nhập email liên kết với tài khoản của bạn, chúng tôi sẽ gửi một đường dẫn để khôi phục quyền truy cập.
            </p>
          </div>

          {state?.success ? (
            <div className="space-y-6 py-4 animate-in fade-in zoom-in duration-500 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {state.message}
              </p>
              <Link href="/login" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-foreground text-background font-bold rounded-2xl">
                QUAY LẠI ĐĂNG NHẬP
              </Link>
            </div>
          ) : (
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Email khôi phục</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-cyan-500 transition-colors" size={18} />
                  <input name="email" type="email" placeholder="name@company.com" required disabled={isPending} className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all" />
                </div>
              </div>

              {state?.error && <div className="text-red-500 text-[11px] font-bold p-3 bg-red-500/10 border border-red-500/20 rounded-xl">{state.error.toUpperCase()}</div>}

              <button type="submit" disabled={isPending} className="w-full bg-foreground text-background font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                {isPending ? <Loader2 size={20} className="animate-spin" /> : <>GỬI YÊU CẦU <SendHorizontal size={18} /></>}
              </button>

              <Link href="/login" className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors pt-2">
                <ArrowLeft size={14} /> TRỞ LẠI ĐĂNG NHẬP
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
