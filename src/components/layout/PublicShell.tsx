// src/components/layout/PublicShell.tsx
/*
"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import Sidebar from "@/components/sidebar/Sidebar";
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
      <div className="flex h-full w-full overflow-hidden bg-background">
        
     
        <aside
          className={`
            fixed md:relative inset-y-0 left-0 z-50 w-64 border-r border-border bg-card/50 backdrop-blur-xl
            transition-transform duration-300 ease-in-out shrink-0 flex flex-col
            ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
            <Link href="/">
              <span className="font-bold tracking-tighter">
                TÂM<span className="text-neon-cyan"> VIỆT</span>
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </div>
        </aside>

     
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />
        )}

    
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          
     
          <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center px-4 shrink-0 z-10">
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 mr-2 hover:bg-accent rounded-lg"
            >
              <Menu size={22} />
            </button>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 hidden sm:block">
              System Terminal
            </div>
          </header>

  
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col bg-transparent">
            
            <main className="flex-1 px-1 py-2 md:p-8 w-full max-w-6xl mx-auto overflow-x-visible shrink-0">
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
*/


"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import { Menu, X } from "lucide-react";
import Link from "next/link";

//export default
function PublicShell_({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ROOT */}
      <div className="flex min-h-screen bg-background">

        {/* ================= SIDEBAR ================= */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 
            bg-card/70 backdrop-blur-xl border-r border-border
            transform transition-transform duration-300 ease-in-out
            will-change-transform
            md:relative md:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* HEADER */}
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

          {/* SCROLL SIDEBAR */}
          <div className="h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
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

        {/* ================= MAIN ================= */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* HEADER */}
          <header className="sticky top-0 z-10 h-16 flex items-center px-4 border-b border-border bg-background/70 backdrop-blur-md">
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 mr-2 hover:bg-accent rounded-lg"
            >
              <Menu size={22} />
            </button>

            <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 hidden sm:block">
              System Terminal
            </div>
          </header>

          {/* ================= SCROLL AREA (ONLY ONE) ================= */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">

            <div className="max-w-6xl mx-auto w-full px-2 md:px-8 py-4 flex flex-col min-h-full">

              {/* MAIN CONTENT */}
              <main className="flex-1">
                {children}
              </main>

              {/* FOOTER */}
              <footer className="mt-10 pt-4 border-t border-border/40">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center md:text-left">
                  © 2026 Tâm Việt — All Systems Operational
                </p>
              </footer>

            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL UI */}
      <Toast />

      <div className="fixed bottom-6 right-6 z-[100]">
        <ThemeToggle />
      </div>
    </>
  );
}



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
          <main className="flex-1 overflow-y-auto px-2 md:px-8 py-4">
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






