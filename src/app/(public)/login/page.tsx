// src/app/(public)/login/page.tsx
/*
'use client';

import { signIn } from '@/lib/authActions/auth';
import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState('');

  return (
    <form
      action={async (formData) => {
        const res = await signIn(formData);
        if (res?.error) setError(res.error);
      }}
      className="max-w-sm mx-auto mt-20 space-y-4"
    >
      <h1 className="text-2xl font-bold">Login</h1>

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="border p-2 w-full"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="border p-2 w-full"
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 w-full"
      >
        Login
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
*/

/*
'use client';

import { signIn } from '@/lib/authActions/auth';
import { useState, useTransition } from 'react';
import { Mail, Lock, Loader2, ChevronRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    setError('');
    startTransition(async () => {
      const res = await signIn(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="h-full flex items-center justify-center p-6">
   
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.05),transparent)] pointer-events-none" />

      <div className="w-full max-w-[400px] relative">
   
        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)]">
          
          <div className="flex flex-col items-center mb-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">Đăng nhập hệ thống</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mt-1">Hạt nhân quản trị NEON</p>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Tài khoản Email</label>
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

       
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Mật mã bảo mật</label>
                <Link href="#" className="text-[10px] font-bold text-emerald-500 hover:underline">Quên mật mã?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isPending}
                  className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

          
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold p-3 rounded-xl animate-in fade-in slide-in-from-top-1">
                XÁC THỰC THẤT BẠI: {error.toUpperCase()}
              </div>
            )}

          
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-foreground text-background font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl disabled:opacity-70"
            >
              {isPending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  TIẾP TỤC TRUY CẬP
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

         
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground font-medium">
              Chưa có tài khoản?{' '}
              <Link href="/signup" className="text-emerald-500 font-bold hover:underline">Đăng ký ngay</Link>
            </p>
          </div>
        </div>

        
        <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale">
          <div className="flex items-center gap-1 text-[10px] font-mono tracking-tighter">
            <ShieldCheck size={12} />
            SSL_ENCRYPTED
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono tracking-tighter">
            <Lock size={12} />
            SUPABASE_AUTH
          </div>
        </div>
      </div>
    </div>
  );
}
*/


'use client';

import { signIn } from '@/lib/authActions/auth';
import { useState, useTransition } from 'react';
import { Mail, Lock, Loader2, ChevronRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [shouldShake, setShouldShake] = useState(false); // Trạng thái rung
  const [isPending, startTransition] = useTransition();

  const triggerError = (msg: string) => {
    setError(msg);
    setShouldShake(true);
    
    // Rung vật lý trên Mobile (Haptic Feedback)
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate([50, 30, 50]); // Rung nhẹ 2 nhịp
    }

    // Tắt hiệu ứng rung sau 300ms để có thể trigger lại lần sau
    setTimeout(() => setShouldShake(false), 300);
  };

  const handleSubmit = async (formData: FormData) => {
    setError('');
    startTransition(async () => {
      const res = await signIn(formData);
      if (res?.error) {
        triggerError(res.error);
      }
    });
  };

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.05),transparent)] pointer-events-none" />

      {/* Thêm class animate-shake khi có lỗi */}
      <div className={`w-full max-w-[400px] relative ${shouldShake ? 'animate-shake' : ''}`}>
        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)]">
          
          <div className="flex flex-col items-center mb-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">Đăng nhập hệ thống</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mt-1">Hạt nhân quản trị NEON</p>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Tài khoản Email</label>
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

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Mật mã bảo mật</label>
                <Link href="#" className="text-[10px] font-bold text-emerald-500 hover:underline">Quên mật mã?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isPending}
                  className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold p-3 rounded-xl animate-in fade-in slide-in-from-top-1">
                XÁC THỰC THẤT BẠI: {error.toUpperCase()}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-foreground text-background font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl disabled:opacity-70"
            >
              {isPending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  TIẾP TỤC TRUY CẬP
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground font-medium">
              Chưa có tài khoản?{' '}
              <Link href="/signup" className="text-emerald-500 font-bold hover:underline">Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}










