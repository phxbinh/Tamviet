// src/components/layout/MarkdownShell.tsx
"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import Sidebar from "@/components/sidebar/Sidebar";
import { SidebarHeader } from "./SidebarHeaderMarkdown";
import { Menu } from "lucide-react";

export default function MarkdownShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);
  const openSidebar = () => setIsOpen(true);

  return (
    <>
      <div className="flex min-h-screen w-full overflow-y-auto no-scrollbar bg-background text-foreground">
        
        {/* CỘT 1: SIDEBAR */}
        <aside
          className={`
            fixed md:relative inset-y-0 left-0 z-50 w-64 border-r border-border bg-card/50 backdrop-blur-xl
            transition-transform duration-300 ease-in-out shrink-0 flex flex-col
            ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* Sử dụng component đã tách */}
          <SidebarHeader onClose={closeSidebar} />

          <div className="flex-1 overflow-y-auto no-scrollbat">
            <Sidebar onNavigate={closeSidebar} />
          </div>
        </aside>

        {/* BACKDROP MOBILE */}
        {isOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/60 z-40 md:hidden animate-in fade-in duration-200"
          />
        )}

        {/* CỘT 2: CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          
          {/* HEADER CHÍNH */}
          <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center px-4 shrink-0 z-10">
            <button
              onClick={openSidebar}
              className="md:hidden p-2 mr-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 hidden sm:block">
              System Terminal
            </div>
          </header>

          {/* SCROLL AREA */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col bg-transparent">
            <main className="flex-1 p-2 md:p-8 w-full max-w-6xl mx-auto overflow-x-visible shrink-0">
              {children}
            </main>

            <footer className="mt-auto py-4 border-t border-border/40 px-6 shrink-0 text-center md:text-left">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                © 2026 Tâm Việt — All Systems Operational
              </p>
            </footer>
          </div>
        </div>
      </div>

      <Toast />
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </>
  );
}
