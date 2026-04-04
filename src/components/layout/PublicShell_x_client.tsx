
// src/components/layout/PublicShell.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle_";
import { Toast } from "@/components/Toast";
import { Menu, X, ShoppingCart, ShieldCheck } from "lucide-react";
import Link from "next/link";
import SupportPolicies from "@/components/chinhsachbaomat/ChinhSachBaoMat_";
import { UserAvatar } from '@/components/dashboard/UserAvatar';
import { CartProvider } from "@/components/cart/CartProvider";
import { useCart } from "@/components/cart/CartProvider";

/* Cách dùng ở App route 
import { getCurrentUser } from '@/lib/authActions/getUser';
import PublicShell from '@/components/layout/PublicShell_x_client';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // Ở đây không truyền hàm, chỉ truyền dữ liệu (Data)
  return (
    <PublicShell user={user}>
      {children}
    </PublicShell>
  );
}
*/


export default function PublicShell({ children, user }: { children: React.ReactNode; user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeType, setActiveType] = useState("Tất cả");
  // Lấy số lượng sản phẩm trong giỏ hàng
  const { cart, loading } = useCart();
  const totalQty = cart?.totalQuantity ?? 0;

  return (
    <div className="flex min-h-svh w-full flex-col lg:flex-row 
                    landscape:max-w-[800px] landscape:mx-auto 
                    bg-background relative">

      {/* 1. SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 
          bg-card/80 backdrop-blur-2xl border-r border-border
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-16 landscape:h-12 flex items-center justify-between px-6 border-b border-border">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <span className="font-bold tracking-tighter text-sm uppercase">
              TÂM<span className="text-neon-cyan"> VIỆT</span>
            </span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2">
            <X size={16} />
          </button>

         {/* Theme Toggle */}
          <div className="z-[100] scale-80 landscape:scale-80 transition-transform">
            <ThemeToggle />
          </div>
        </div>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          <Sidebar onNavigate={() => setIsOpen(false)} />
        </div>
      </aside>

      {/* BACKDROP */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" />
      )}

      {/* 2. KHỐI NỘI DUNG CHÍNH */}
      <div className="flex-1 flex flex-col min-w-0 w-full relative">
        
        {/* HEADER CHÍNH */}
        <header className="sticky top-0 z-30 
                         h-16 landscape:h-12 
                         flex items-center px-4 justify-between
                         border-b border-border 
                         bg-background/80 backdrop-blur-md 
                         w-full">
          
          {/* Nhóm bên trái: Menu Mobile & Logo */}
          <div className="flex items-center gap-2">
            <button onClick={() => setIsOpen(true)} className="lg:hidden p-2">
              <Menu size={20} />
            </button>
            
            <div className="lg:hidden font-bold text-[10px] tracking-[0.2em] uppercase opacity-90">
              Tâm Việt
            </div>
          </div>
        
          {/* Nhóm bên phải: Cart & User Profile */}
          <div className="flex items-center gap-1 sm:gap-3">
            
            {/* Cart Icon */} {/*
            <Link href="/cart" className="p-2 relative hover:bg-foreground/5 rounded-full transition-colors"> 
              <ShoppingCart size={20} className="text-foreground/80" />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan text-[9px] text-black font-bold border-2 border-background">
                0
              </span>
            </Link>*/}
{/* Cart Icon */}
<CartProvider>
<Link
  href="/cart"
  className="p-2 relative hover:bg-foreground/5 rounded-full transition-colors"
>
  <ShoppingCart size={20} className="text-foreground/80" />

  {!loading && totalQty > 0 && (
    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan text-[9px] text-black font-bold border-2 border-background">
      {totalQty}
    </span>
  )}
</Link>
</CartProvider>

            {/* User Profile Capsule */}
            <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-secondary/50 border border-border/50 hover:border-neon-cyan/30 transition-all cursor-pointer">
              <div className="ring-2 ring-background rounded-full overflow-hidden">
                <UserAvatar email={user?.email || ''} avatarUrl={user?.avatar_url} size="sm" />
              </div>
              
              <div className="sm:flex flex-col justify-center max-w-[100px]">
                <span className="text-[11px] font-semibold leading-tight truncate">
                  {user?.email?.split('@')[0] || 'Guest'}
                </span>
                <div className="flex items-center gap-1 opacity-70">
                  {user?.role && (<ShieldCheck size={10} className="text-neon-cyan" />)}
                  <span className="text-[8px] uppercase font-bold tracking-tighter">
                    {user?.role || ''}
                  </span>
                </div>
              </div>
            </div>
        
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 min-w-0 p-1 md:p-6 lg:p-12 bg-background">
          <div className="mx-auto max-w-full">
            {children}
          </div>
        </main>

        <SupportPolicies />

        <footer className="p-4 border-t border-border text-center text-[10px] uppercase tracking-widest text-foreground/40">
            © 2026 Tâm Việt Platform
        </footer>

      </div>
      <Toast />
    </div>
  );
}


/*

// HEADER CHÍNH 
<header className="sticky top-0 z-30 
                 h-16 landscape:h-12 
                 flex items-center px-4 justify-between
                 border-b border-border 
                 bg-background/80 backdrop-blur-md 
                 w-full">
  
  // Nhóm bên trái: Menu Mobile & Logo 
  <div className="flex items-center gap-2">
    <button onClick={() => setIsOpen(true)} className="lg:hidden p-2">
      <Menu size={20} />
    </button>
    
    <div className="lg:hidden font-bold text-[10px] tracking-[0.2em] uppercase opacity-90">
      Tâm Việt
    </div>
  </div>

  // Nhóm bên phải: Cart & User Profile 
  <div className="flex items-center gap-1 sm:gap-3">
    
    // Cart Icon 
    <Link href="/cart" className="p-2 relative hover:bg-foreground/5 rounded-full transition-colors"> 
      <ShoppingCart size={20} className="text-foreground/80" />
      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan text-[9px] text-black font-bold border-2 border-background">
        0
      </span>
    </Link>

    // User Profile Capsule 
    <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-secondary/50 border border-border/50 hover:border-neon-cyan/30 transition-all cursor-pointer">
      <div className="ring-2 ring-background rounded-full overflow-hidden">
        <UserAvatar email={user?.email || ''} avatarUrl={user?.avatar_url} size="sm" />
      </div>
      
      <div className="hidden sm:flex flex-col justify-center max-w-[100px]">
        <span className="text-[11px] font-semibold leading-tight truncate">
          {user?.email?.split('@')[0] || 'Guest'}
        </span>
        <div className="flex items-center gap-1 opacity-70">
          <ShieldCheck size={10} className="text-neon-cyan" />
          <span className="text-[8px] uppercase font-bold tracking-tighter">
            {user?.role || 'User'}
          </span>
        </div>
      </div>
    </div>

  </div>
</header>
*/












