// src/components/layout/PublicShell.tsx



"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import { Menu, X } from "lucide-react";
import Link from "next/link";

/// ----- RÚT GỌN DIV
/*
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import { Menu, X } from "lucide-react";
import Link from "next/link";
*/
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






