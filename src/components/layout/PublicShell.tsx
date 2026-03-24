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
            bg-card/70 backdrop-blur-xl border-r border-border
            transition-transform duration-300 ease-in-out
            /* Trên Desktop (lg trở lên): Hiện cố định, không dùng transform */
            lg:relative lg:translate-x-0
            /* Trên Mobile & Tablet (kể cả xoay ngang): Ẩn bằng transform */
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <Link href="/">
              <span className="font-bold tracking-tighter text-foreground">
                TÂM<span className="text-neon-cyan"> VIỆT</span>
              </span>
            </Link>

            {/* Nút đóng chỉ hiện trên mobile/tablet */}
            <button 
              onClick={() => setIsOpen(false)} 
              className="lg:hidden p-2 hover:bg-foreground/5 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </div>
        </aside>

        {/* BACKDROP - Chỉ hiện trên mobile/tablet khi menu mở */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          />
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* HEADER */}
          <header className="sticky top-0 z-30 h-16 flex items-center px-4 border-b border-border bg-background/70 backdrop-blur-md">
            {/* Nút Burger - Chỉ hiện trên lg:hidden (Mobile & Tablet xoay ngang) */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 mr-2 hover:bg-foreground/5 rounded-md transition-colors"
            >
              <Menu size={22} />
            </button>
            
            <div className="flex-1" />
            
            {/* Có thể thêm Breadcrumb hoặc User Profile ở đây */}
          </header>

          {/* MAIN CONTENT */}
          <main className="flex-1 px-4 lg:px-8 pb-4 pt-2 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

        </div>
      </div>

      <Toast />

      {/* Theme Toggle nổi */}
      <div className="fixed bottom-6 right-6 z-[100]">
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






