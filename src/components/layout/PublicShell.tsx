// src/components/layout/PublicShell.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import { Menu, X } from "lucide-react";
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

        {/* SIDEBAR */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 
            bg-card/80 backdrop-blur-2xl border-r border-border
            transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Header của Sidebar - Cũng nên mỏng lại khi xoay ngang */}
          <div className="h-16 landscape:h-12 flex items-center justify-between px-6 border-b border-border transition-all">
            <Link href="/">
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

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* HEADER - Tối ưu sticky cho landscape */}
          <header className="sticky top-0 z-30 
                           h-16 landscape:h-12 
                           flex items-center px-4 
                           border-b border-border 
                           bg-background/80 backdrop-blur-md 
                           transition-all duration-300">
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 mr-2 hover:bg-foreground/5 rounded-md"
            >
              <Menu size={20} />
            </button>
            
            {/* Logo nhỏ hiện ở Header khi Menu ẩn (tùy chọn) */}
            <div className="lg:hidden font-bold text-[10px] tracking-[0.2em] uppercase opacity-50">
              Tâm Việt Platform
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="flex-1 px-4 lg:px-8 pb-10 pt-4">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

        </div>
      </div>

      <Toast />

      {/* Theme Toggle - Ẩn bớt khi xoay ngang để đỡ vướng nội dung */}
      <div className="fixed bottom-4 right-4 z-[100] landscape:scale-75 transition-transform">
        <ThemeToggle />
      </div>
    </>
  );
}










//export default
function PublicShell_({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-screen bg-background">

        {/* SIDEBAR */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 
            bg-card/70 backdrop-blur-xl border-r border-border
            transform transition-transform duration-300
            md:relative md:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <Link href="/">
              <span className="font-bold tracking-tighter">
                TÂM<span className="text-neon-cyan"> VIỆT</span>
              </span>
            </Link>

            <button onClick={() => setIsOpen(false)} className="md:hidden p-2">
              <X size={18} />
            </button>
          </div>

          <div className="h-[calc(100vh-4rem)] overflow-y-auto">
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </div>
        </aside>

        {/* BACKDROP */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}

        {/* MAIN */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* HEADER */}
          <header className="sticky top-0 z-30 h-16 flex items-center px-4 border-b border-border bg-background/70 backdrop-blur-md">
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 mr-2"
            >
              <Menu size={22} />
            </button>
          </header>

          {/* ✅ SCROLL CONTAINER - KHÔNG WRAPPER */}
          <main className="flex-1 px-1 md:px-8 pb-4 pt-0">
            {children}
          </main>

        </div>
      </div>

      <Toast />

      <div className="fixed bottom-6 right-6 z-[100]">
        <ThemeToggle />
      </div>
    </>
  );
}






