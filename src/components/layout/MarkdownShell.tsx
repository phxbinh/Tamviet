// src/components/layout/MarkdownShell.tsx
/*
"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { Menu, X } from "lucide-react";
import Link from "next/link";




export default function MarkdownShell({
  children,
}: {
  children: React.ReactNode;
}) {
const [isOpen, setIsOpen] = useState(false);
  return (
    <>

 {children} 

      <Toast />
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </>
  );
}
*/






//////
"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function MarkdownShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* 1. SIDEBAR (CHỈ DÀNH CHO DESKTOP HOẶC KHI OPEN TRÊN MOBILE) */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-[60] w-72 border-r border-border bg-card/50 backdrop-blur-xl
          transition-transform duration-300 ease-in-out shrink-0 flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <span className="font-bold tracking-tighter text-lg">
              TÂM<span className="text-neon-cyan"> VIỆT</span>
            </span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <Sidebar onNavigate={() => setIsOpen(false)} />
        </div>
      </aside>

      {/* BACKDROP MOBILE - Khi mở Sidebar */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-[55] md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* 2. VÙNG NỘI DUNG CHÍNH (CONTENT AREA) */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {/* HEADER CỐ ĐỊNH PHÍA TRÊN */}
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-[40]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 -ml-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="text-[10px] font-black uppercase tracking-[0.25em] opacity-30 hidden sm:block">
              System Terminal v1.0
            </div>
          </div>
          
          {/* Bạn có thể thêm Breadcrumbs hoặc Search ở đây */}
          <div className="flex items-center gap-4">
             {/* Chỗ trống cho các action khác */}
          </div>
        </header>

        {/* PHẦN CUỘN NỘI DUNG CHÍNH (CHỨA MARKDOWN + TOC) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative selection:bg-neon-cyan/30">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>

      {/* CÁC THÀNH PHẦN FIXED TOÀN TRANG */}
      <Toast />
      <div className="fixed bottom-6 right-6 z-[70]">
        <ThemeToggle />
      </div>
    </div>
  );
}

















