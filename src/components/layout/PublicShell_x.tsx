// src/components/layout/PublicShell.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle_";
import { Toast } from "@/components/Toast";
import { Menu, X, ShoppingCart } from "lucide-react";
import Link from "next/link";
import SupportPolicies from "@/components/chinhsachbaomat/ChinhSachBaoMat";

//export default 
function PublicShell_({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-svh w-full flex-col lg:flex-row 
                    landscape:max-w-[800px] landscape:mx-auto 
                    bg-background relative">

      {/* 1. SIDEBAR: Giữ nguyên logic Drawer/Relative */}
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
          <button onClick={() => setIsOpen(false)} aria-label="Đóng menu" className="lg:hidden p-2">
            <X size={16} />
          </button>
        </div>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          <Sidebar onNavigate={() => setIsOpen(false)} />
        </div>
      </aside>

      {/* BACKDROP */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* 2. KHỐI NỘI DUNG CHÍNH (Gồm Header + Main) */}
      <div className="flex-1 flex flex-col min-w-0 w-full relative">
        
        {/* HEADER CHÍNH: Bây giờ nó sẽ sticky dựa trên thẻ div cha này */}
        <header className="sticky top-0 z-30 
                         h-16 landscape:h-12 
                         flex items-center px-4 
                         border-b border-border 
                         bg-background/80 backdrop-blur-md 
                         transition-all duration-300 w-full">
          <button
            onClick={() => setIsOpen(true)} aria-label="Menu"
            className="lg:hidden p-2 mr-2 hover:bg-foreground/5 rounded-md"
          >
            <Menu size={20} />
          </button>
          
          <div className="lg:hidden font-bold text-[10px] tracking-[0.2em] uppercase opacity-90">
            Tâm Việt Platform
          </div>

          <div className="ml-auto mr-4 flex items-center gap-2">
            <Link href="/cart" className="p-2 relative" aria-label="Giỏ hàng"> 
              <ShoppingCart size={20} />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan text-[9px] text-black font-bold border-2 border-background">
                0
              </span>
            </Link>
          </div>

          {/* Theme Toggle */} {/*
          <div className="z-[100] scale-80 landscape:scale-80 transition-transform">
            <ThemeToggle />
          </div>*/}

        </header>

        {/* MAIN: Nằm ngay dưới Header trong cùng một Flex-col */}
        <main className="flex-1 min-w-0 p-1 md:p-6 lg:p-12 bg-background">
          <div className="mx-auto max-w-full">
            {children}
          </div>
        </main>

        <SupportPolicies />

        <footer className="p-4 border-t border-border text-center text-[10px] uppercase tracking-widest">
            © 2026 Tâm Việt Platform
        </footer>

      </div>
      <Toast />
    </div>
  );
}



/*
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle_";
import { Toast } from "@/components/Toast";
import { Menu, X, ShoppingCart } from "lucide-react";
import Link from "next/link";
import SupportPolicies from "@/components/chinhsachbaomat/ChinhSachBaoMat";
*/



// Danh sách loại sản phẩm mẫu
const PRODUCT_TYPES = ["Tất cả", "Trang sức", "Đồng hồ", "Phụ kiện", "Quà tặng", "Limited"];

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeType, setActiveType] = useState("Tất cả");

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
                         flex items-center px-4 
                         border-b border-border 
                         bg-background/80 backdrop-blur-md 
                         w-full">
          <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 mr-2">
            <Menu size={20} />
          </button>
          
          <div className="lg:hidden font-bold text-[10px] tracking-[0.2em] uppercase opacity-90">
            Tâm Việt Platform
          </div>

          <div className="ml-auto mr-4 flex items-center gap-2">
            <Link href="/cart" className="p-2 relative"> 
              <ShoppingCart size={20} />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan text-[9px] text-black font-bold border-2 border-background">
                0
              </span>
            </Link>
          </div>
          {/*<ThemeToggle /> */}
        </header>

        {/* FEATURE: STICKY PRODUCT TYPES FILTER */} {/*
        <nav className="sticky top-16 landscape:top-12 z-20 
                        w-full border-b border-border 
                        bg-background/90 backdrop-blur-sm
                        overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 px-4 h-12 landscape:h-10 min-w-max">
            {PRODUCT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`text-[10px] uppercase tracking-widest font-bold transition-all relative py-2
                  ${activeType === type ? "text-neon-cyan" : "text-foreground/50 hover:text-foreground"}
                `}
              >
                {type}
                {activeType === type && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-cyan shadow-[0_0_8px_#00ffff]" />
                )}
              </button>
            ))}
          </div>
        </nav>
*/}
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






