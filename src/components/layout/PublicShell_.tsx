"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import { Menu, X, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-screen bg-background">
        {/* SIDEBAR - Giữ nguyên */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 
            bg-card/80 backdrop-blur-2xl border-r border-border
            transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-16 landscape:h-12 flex items-center justify-between px-6 border-b border-border transition-all">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <span className="font-bold tracking-tighter text-foreground text-sm uppercase">
                TÂM<span className="text-neon-cyan"> VIỆT</span>
              </span>
            </Link>
            <button 
              onClick={() => setIsOpen(false)} 
              className="lg:hidden p-2 hover:bg-foreground/5 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
          <div className="h-[calc(100vh-4rem)] landscape:h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar">
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </div>
        </aside>

        {/* BACKDROP */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          />
        )}

        {/* MAIN CONTENT AREA: Fix responsive tại đây */}
        <div className="flex-1 flex flex-col min-w-0 max-w-7xl mx-auto w-full">
          
          {/* HEADER CHÍNH: Giờ nó sẽ thẳng hàng với nội dung bên dưới vì chung thẻ cha max-w-7xl */}
          <header className="sticky top-0 z-30 
                           h-16 landscape:h-12 
                           flex items-center px-4 md:px-8
                           border-b border-border 
                           bg-background/80 backdrop-blur-md 
                           transition-all duration-300">
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 mr-2 hover:bg-foreground/5 rounded-md"
            >
              <Menu size={20} />
            </button>
            
            <div className="lg:hidden font-bold text-[10px] tracking-[0.2em] uppercase opacity-50">
              Tâm Việt Platform
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Link 
                href="/cart" 
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors relative text-foreground/80 hover:text-foreground"
              >
                <ShoppingCart size={20} />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan text-[9px] text-black font-bold border-2 border-background">
                  0
                </span>
              </Link>
            </div>
          </header>

          {/* MAIN CONTENT: Xóa max-w-7xl ở đây đi vì thẻ cha đã có rồi */}
          <main className="flex-1 px-0 md:px-8 pb-10 pt-0">
             {children}
          </main>

        </div>
      </div>

      <Toast />

      <div className="fixed bottom-4 right-4 z-[100] landscape:scale-75 transition-transform">
        <ThemeToggle />
      </div>
    </>
  );
}
