'use client';

import { useActionState, useState } from 'react';
import { updatePassword } from '@/lib/authActions/auth';
import { Lock, Loader2, ShieldCheck, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function SecurityTab() {
  const [state, formAction, isPending] = useActionState(updatePassword, null);
  const [showPass, setShowPass] = useState(false);

  return (
    <section className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER TAB */}
      <div className="p-6 border-b border-border flex items-center justify-between bg-white/5">
        <h2 className="font-bold flex items-center gap-2">
          <ShieldCheck size={18} className="text-neon-purple" />
          Bảo mật tài khoản
        </h2>
        {state?.success && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase animate-bounce">
            <CheckCircle2 size={12} /> Đã cập nhật
          </span>
        )}
      </div>

      <div className="p-8 space-y-6">
        {/* INFO BOX */}
        <div className="p-4 rounded-2xl bg-neon-purple/5 border border-neon-purple/20 flex gap-3">
          <AlertCircle size={18} className="text-neon-purple shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Việc đổi mật mã sẽ yêu cầu bạn phải đăng nhập lại trên các thiết bị khác để đảm bảo tính đồng bộ và an toàn.
          </p>
        </div>

        {/* FORM */}
        <form action={formAction} className="space-y-5 max-w-md">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Mật mã mới</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-neon-purple transition-colors" size={18} />
              <input 
                name="password" 
                type={showPass ? "text" : "password"} 
                required 
                disabled={isPending} 
                className="w-full bg-background border border-border/60 rounded-2xl py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-neon-purple/20 focus:border-neon-purple transition-all text-base md:text-sm" 
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Xác nhận mật mã</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-neon-purple transition-colors" size={18} />
              <input 
                name="confirmPassword" 
                type={showPass ? "text" : "password"} 
                required 
                disabled={isPending} 
                className="w-full bg-background border border-border/60 rounded-2xl py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-neon-purple/20 focus:border-neon-purple transition-all text-base md:text-sm" 
              />
            </div>
          </div>

          {state?.error && (
            <div className="text-red-500 text-[11px] font-bold p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
              {state.error.toUpperCase()}
            </div>
          )}

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isPending} 
              className="w-full md:w-auto px-8 bg-foreground text-background font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  ĐANG XỬ LÝ...
                </>
              ) : "CẬP NHẬT MẬT MÃ"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
