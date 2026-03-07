
// src/app/(auth)/change-password/page.tsx
// Sử dụng cho thay đổi password -

/*
'use client';

import { useActionState, useEffect, useState } from 'react';
import { updatePassword } from '@/lib/authActions/auth';
import { Lock, Loader2, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, null);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => router.push('/welcome'), 3000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-[420px] relative animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 shadow-2xl">
          
          <div className="flex flex-col items-center mb-8 space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Thiết lập mật mã mới</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">An toàn & Bảo mật tuyệt đối</p>
          </div>

          {state?.success ? (
            <div className="space-y-4 py-4 text-center">
              <div className="inline-flex items-center gap-2 text-emerald-500 font-bold bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                <CheckCircle2 size={18} /> MẬT MÃ ĐÃ THAY ĐỔI
              </div>
              <p className="text-xs text-muted-foreground">Đang đưa bạn trở lại khu vực an toàn...</p>
            </div>
          ) : (
            <form action={formAction} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Mật mã mới</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input name="password" type={showPass ? "text" : "password"} required disabled={isPending} className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-12 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Xác nhận mật mã</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input name="confirmPassword" type={showPass ? "text" : "password"} required disabled={isPending} className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-12 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
              </div>

              {state?.error && <div className="text-red-500 text-[11px] font-bold p-3 bg-red-500/10 border border-red-500/20 rounded-xl">{state.error.toUpperCase()}</div>}

              <button type="submit" disabled={isPending} className="w-full bg-foreground text-background font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl">
                {isPending ? <Loader2 size={20} className="animate-spin" /> : "XÁC NHẬN THAY ĐỔI"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
*/


import ChangePasswordForm from './ChangePasswordForm';

export default function ChangePasswordPage() {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-[420px] relative animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 shadow-2xl">

{/*
          <div className="flex flex-col items-center mb-8 space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              Thiết lập mật mã
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              Thiết lập mật mã mới
            </h1>

            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
              An toàn & Bảo mật tuyệt đối
            </p>
          </div>
*/}

       <div className="flex flex-col items-center mb-8 space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Thiết lập mật mã mới</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">An toàn & Bảo mật tuyệt đối</p>
          </div>





          <ChangePasswordForm />

        </div>
      </div>
    </div>
  );
}



