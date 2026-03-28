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
    <div className="h-[100dvh] flex flex-col bg-background text-foreground">

      {/* HEADER */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-background shrink-0">
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 mr-2"
          >
            <Menu size={22} />
          </button>

          <Link href="/" className="font-semibold tracking-tight">
            TÂM VIỆT
          </Link>
        </div>

        <ThemeToggle />
      </header>

      {/* BODY = SIDEBAR + MAIN */}
      <div className="flex flex-1 min-h-0">

        {/* SIDEBAR */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72
            bg-card border-r border-border
            transform transition-transform duration-300
            lg:relative lg:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-14 flex items-center justify-between px-4 border-b border-border">
            <span className="font-bold">Menu</span>
            <button onClick={() => setIsOpen(false)} className="lg:hidden">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </div>
        </aside>

        {/* BACKDROP */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}

        {/* MAIN */}
        <main className="flex-1 min-w-0 overflow-y-auto">

          {/* CONTENT WRAPPER giống #app max-width */}
          <div className="max-w-screen-md mx-auto w-full px-4 py-4">
            {children}
          </div>

          {/* FOOTER */}
          <footer className="border-t border-border text-center py-6 text-sm opacity-70">
            © 2026 TÂM VIỆT
          </footer>
        </main>
      </div>

      <Toast />

      {/* FLOAT BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}