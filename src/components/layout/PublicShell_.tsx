"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import { Menu, X, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-screen bg-background transition-colors duration-300">
        {/* SIDEBAR - Cố định bên trái */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0
            bg-card/80 backdrop-blur-2xl border-r border-border
            transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-16 landscape:h-12 flex items-center justify-between px-6 border-b border-border">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <span className="font-bold tracking-tighter text-foreground text-sm uppercase whitespace-nowrap">
                TÂM<span className="text-neon-cyan"> VIỆT</span>
              </span>
            </Link>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2"><X size={16} /></button>
          </div>
          <div className="h-[calc(100vh-4rem)] landscape:h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar">
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </div>
        </aside>

        {/* BACKDROP */}
        {isOpen && (
          <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" />
        )}

        {/* VÙNG NỘI DUNG CHÍNH */}
        <div className="flex-1 flex flex-col min-w-0 w-full relative">
          
          {/* CHỖ FIX QUAN TRỌNG NHẤT:
              Dùng một container trung gian để ép Header và Main luôn luôn cùng chiều rộng 
          */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-7xl flex flex-col">
              
              {/* HEADER: Bây giờ nó bị khống chế bởi max-w-7xl của thẻ cha */}
              <header className="sticky top-0 z-30 h-16 landscape:h-12 
                               flex items-center 
                               px-4 sm:px-6 md:px-8 /* Lề Header đồng bộ */
                               border-b border-border bg-background/80 backdrop-blur-md">
                <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 mr-2 hover:bg-foreground/5 rounded-md">
                  <Menu size={20} />
                </button>
                <div className="lg:hidden font-bold text-[10px] tracking-[0.2em] uppercase opacity-50 whitespace-nowrap">
                  Tâm Việt Platform
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Link href="/cart" className="p-2 relative"><ShoppingCart size={20} /></Link>
                </div>
              </header>

              {/* MAIN CONTENT: Thẳng hàng tuyệt đối với Header */}
              <main className="flex-1 
                             px-0 sm:px-6 md:px-8 /* Mobile dọc tràn viền, xoay ngang có lề */
                             pb-10 pt-4">
                {children}
              </main>

            </div>
          </div>
        </div>
      </div>
      <Toast />
    </>
  );
}
