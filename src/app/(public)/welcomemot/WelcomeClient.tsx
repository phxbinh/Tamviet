'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout';
import { CheckCircle2, ShieldCheck, ArrowRight, UserCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface WelcomeClientProps {
  user: any;
}

export default function WelcomeClient({ user }: WelcomeClientProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);
  const totalTime = 30;

  useEffect(() => {
    // Timer đếm ngược mỗi giây
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Tự động chuyển hướng sau 30 giây
    const redirectTimeout = setTimeout(() => {
      router.push('/dashboard');
    }, totalTime * 1000);

    // Dọn dẹp bộ nhớ khi Component bị unmount
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="h-full flex items-center justify-center p-2 relative">
      <div className="max-w-2xl w-full relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Thanh Progress Bar ở đỉnh Card */}
          <div 
            className="absolute top-0 left-0 h-1 bg-linear-to-r from-neon-cyan to-neon-purple transition-all duration-1000 ease-linear" 
            style={{ width: `${(countdown / totalTime) * 100}%` }}
          />

          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Countdown Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-border/40 text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              <Loader2 size={12} className="animate-spin text-neon-cyan" />
              Tự động vào Dashboard sau {countdown}s
            </div>

            <div className="space-y-2">
              <div className="relative mx-auto w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-neon-cyan blur-2xl opacity-20 rounded-full animate-pulse" />
                <div className="relative flex items-center justify-center w-full h-full rounded-full bg-linear-to-br from-neon-cyan to-neon-purple text-white shadow-xl">
                   <UserCircle size={48} strokeWidth={1.5} />
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-background border-2 border-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Hệ thống đã sẵn sàng,
                <span className="block text-neon-cyan mt-1">
                  {user.email?.split('@')[0]}
                </span>
              </h1>
            </div>

            {/* Profile Info Row */}
            <div className="w-full py-4 px-6 rounded-2xl bg-foreground/5 border border-border/40 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Phiên làm việc</p>
                <p className="text-sm font-medium truncate max-w-[150px]">{user.email}</p>
              </div>
              <div className="h-8 w-px bg-border/50" />
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Bảo mật</p>
                <div className="flex items-center gap-1 text-emerald-500">
                  <ShieldCheck size={12} />
                  <span className="text-xs font-bold uppercase">SSL Encrypted</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <Link
                href="/dashboard"
                className="flex-1 w-full flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-bold rounded-2xl hover:scale-[1.02] transition-all active:scale-95 group shadow-xl"
              >
                VÀO DASHBOARD NGAY
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="w-full sm:w-auto">
                <LogoutButton />
              </div>
            </div>

          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-muted-foreground/40 uppercase tracking-[0.4em]">
          Tâm Việt v3.0 • Auto-sync Active
        </p>
      </div>
    </div>
  );
}
