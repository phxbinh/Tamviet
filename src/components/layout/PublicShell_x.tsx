// src/components/layout/PublicShell.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import { Menu, X } from "lucide-react";
import Link from "next/link";

//export default 
function PublicShell_({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
<div className="flex min-h-[100dvh] bg-background overflow-x-hidden border-2 border-blue-400"> {/* Chốt: h-svh và overflow-hidden ở cha */}
      
      {/* 1. SIDEBAR (Fixed/Hidden on Mobile) */}
      <aside
        className={`
          fixed inset-y-0 left-5 z-50 w-64 
          bg-card/70 backdrop-blur-xl border-r border-border
          transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <span className="font-bold tracking-tighter uppercase">
              Tâm <span className="text-primary">Việt</span>
            </span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-2">
            <X size={20} />
          </button>
        </div>
        
        {/* Scroll riêng cho Sidebar để không ảnh hưởng trang chính */}
        <div className="h-[calc(100svh-4rem)] overflow-y-auto custom-scrollbar">
          <Sidebar onNavigate={() => setIsOpen(false)} />
        </div>
      </aside>

      {/* BACKDROP MOBILE */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full border-2 border-yellow-400">
        
        {/* 2. HEADER: Quản lý riêng biệt */}
        <header className="sticky top-0 z-30 h-14 md:h-16 flex items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 mr-2 hover:bg-accent rounded-md"
            >
              <Menu size={22} />
            </button>
            {/* Có thể thêm Breadcrumb hoặc Page Title ở đây */}
          </div>
          <div className="flex items-center gap-2">
             {/* Khu vực cho Search hoặc User Icon */}
          </div>
        </header>

        {/* 3. MAIN: Vùng cuộn độc lập */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth bg-secondary/10 border-2 border-green-500">
          <div className="container mx-auto px-4 py-4 md:px-6 md:py-8">
            {children}
          </div>
          
          {/* 4. FOOTER: Nằm trong vùng cuộn của Main */}
          <footer className="mt-auto border-t border-border/50 py-6 px-4 text-center text-sm text-muted-foreground">
             <p>© 2026 TÂM VIỆT. Refined by Lê Nguyễn.</p>
          </footer>
        </main>
      </div>

      <Toast />

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
}


// src/components/layout/PublicShell.tsx
/*
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import { Menu, X } from "lucide-react";
import Link from "next/link";
*/

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      
      {/* 1. SIDEBAR: Ép ẩn trên cả Mobile Landscape */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 
          bg-card/80 backdrop-blur-2xl border-r border-border
          transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          /* Chỉ hiện Sidebar cố định từ màn hình Desktop thực thụ (1024px trở lên) */
          lg:relative lg:translate-x-0 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link href="/" onClick={() => setIsOpen(false)} className="group">
            <span className="font-bold tracking-tighter text-xl uppercase">
              Tâm <span className="text-primary group-hover:text-neon-cyan transition-colors">Việt</span>
            </span>
          </Link>
          {/* Nút đóng: Hiện khi Menu mở trên mọi màn hình trừ Desktop lớn */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden p-2 hover:bg-accent rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="h-[calc(100svh-4rem)] overflow-y-auto py-4 custom-scrollbar">
          <Sidebar onNavigate={() => setIsOpen(false)} />
        </div>
      </aside>

      {/* BACKDROP: Hiện khi Menu mở, phủ toàn bộ kể cả khi xoay ngang */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {/* 2. HEADER: Luôn hiện nút Menu nếu chưa đạt chuẩn Desktop (lg) */}
        <header className="sticky top-0 z-30 h-14 md:h-16 flex items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              /* Nút Menu này sẽ xuất hiện trên cả Mobile dọc, ngang và Tablet dọc */
              className="lg:hidden p-2 mr-2 hover:bg-accent rounded-md transition-all active:scale-95"
            >
              <Menu size={24} />
            </button>
            <div className="lg:hidden font-semibold tracking-tight">TÂM VIỆT</div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Chỗ này để Search Icon hoặc Profile */}
          </div>
        </header>

        {/* 3. MAIN CONTAINER */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth bg-secondary/5">
          <div className="container mx-auto px-4 py-4 md:px-8 md:py-10">
            {children}
          </div>
          
          <footer className="mt-auto border-t border-border/40 py-8 px-4 text-center">
             <p className="text-xs tracking-widest text-muted-foreground uppercase opacity-70">
                © 2026 TÂM VIỆT · Established for Excellence
             </p>
          </footer>
        </main>
      </div>

      <Toast />

      {/* Floating Theme Toggle - Tinh chỉnh vị trí để không che nội dung quan trọng */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <ThemeToggle />
      </div>
    </div>
  );
}


