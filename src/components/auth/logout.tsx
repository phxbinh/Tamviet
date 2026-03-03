// src/components/auth/logout.tsx
/*
'use client'
import { signOut } from '@/lib/authActions/auth';

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500"
      >
        Logout
      </button>
    </form>
  );
}
*/


'use client'
import { signOut } from '@/lib/authActions/auth';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  return (
    <form action={signOut} className="w-full sm:w-auto">
      <button
        type="submit"
        className="group relative flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl 
          border border-border/60 bg-card/20 text-muted-foreground font-semibold 
          hover:bg-red-500/5 hover:text-red-500 hover:border-red-500/30 
          transition-all duration-300 active:scale-95"
      >
        {/* Icon Logout với hiệu ứng trượt nhẹ khi hover */}
        <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
        
        <span className="text-sm tracking-wide uppercase font-bold">Thoát tài khoản</span>
        
        {/* Hiệu ứng tia sáng mờ khi hover để tạo cảm giác Neon nhẹ */}
        <div className="absolute inset-0 rounded-2xl bg-red-500/0 group-hover:bg-red-500/[0.02] transition-colors pointer-events-none" />
      </button>
    </form>
  );
}



