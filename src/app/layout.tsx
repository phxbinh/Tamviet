/*
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle"; // Import nút chuyển theme
import Link from "next/link";
import { Toast } from "@/components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo Neon 2026",
  description: "Ứng dụng ghi chú phong cách tương lai với Next.js 15",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          
          <header className="sticky top-0 z-40 w-full border-b border-border bg-background/60 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="font-bold text-xl tracking-tighter">
                NEON<span className="text-neon-cyan">TODO</span>
              </Link>
              <nav className="flex gap-6">
                <Link href="/todos" className="text-sm hover:text-neon-cyan transition-colors">
                  Danh sách Todo
                </Link>
              </nav>
            </div>
          </header>

          <main className="relative min-h-screen">
            {children}
          </main>

          
          <Toast />

          <footer className="py-12 mt-auto border-t border-border bg-background/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2026 <span className="text-neon-cyan font-bold">Todo Neon</span>. All rights reserved.
              </p>
              
              <div className="flex gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-neon-purple transition-colors">Chính sách</a>
                <a href="#" className="hover:text-neon-cyan transition-colors">Điều khoản</a>
                <a href="#" className="hover:text-foreground transition-colors">Github</a>
              </div>
            </div>
          </footer>

          
          <div className="fixed bottom-5 right-5 z-[100]">
            <ThemeToggle />
          </div>

        </ThemeProvider>
      </body>
    </html>
  );
}
*/

// src/app/layout.tsx
/*
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import Sidebar from "@/components/sidebar/Sidebar";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Đóng sidebar khi đổi trang trên mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <html lang="vi" suppressHydrationWarning>
      
      <body className={`${inter.className} antialiased h-screen overflow-hidden bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          <div className="flex h-full w-full relative">
            
            
            <aside className={`
              fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card
              transition-transform duration-300 ease-in-out
              md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
              <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 shrink-0 font-bold text-xl">
                <Link href="/" className="font-bold text-xl tracking-tighter">
                  NEON<span className="text-neon-cyan">TODO</span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="md:hidden p-1 hover:bg-accent rounded"><X size={20}/></button>
              </div>
              <div className="h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
                <Sidebar onNavigate={() => setIsOpen(false)} />
              </div>
            </aside>

            
            <div 
              onClick={() => setIsOpen(false)} 
              className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            />

            
            <div className="flex-1 flex flex-col min-w-0 h-full relative md:pl-64 transition-[padding] duration-300">
              
              
              <header className="h-16 border-b border-border flex items-center px-4 shrink-0 bg-background/60 backdrop-blur-md sticky top-0 z-30 w-full">
                <button onClick={() => setIsOpen(true)} className="md:hidden p-2 mr-2 hover:bg-accent rounded-lg transition-transform active:scale-90">
                  <Menu size={24} />
                </button>
                <div className="font-semibold text-sm tracking-tight opacity-70">Hệ thống / Dashboard</div>
              </header>

              
              <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar scroll-smooth">
                
                <div className="p-4 md:p-8 max-w-6xl mx-auto w-full min-h-full flex flex-col">
                  <div className="flex-1">
                    {children}
                  </div>
                  
                  
                  <footer className="mt-12 py-6 border-t border-border/40 text-[11px] text-muted-foreground">
                    © 2026 Todo Neon - Built for performance.
                  </footer>
                </div>
              </main>
            </div>

          </div>

          <Toast />
          <div className="fixed bottom-6 right-6 z-[60]"><ThemeToggle /></div>

        </ThemeProvider>
      </body>
    </html>
  );
}
*/


/*
"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Toast } from "@/components/Toast";
import Sidebar from "@/components/sidebar/Sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, Menu } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Tự động đóng sidebar trên mobile khi chuyển trang
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased overflow-hidden bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          <div className="flex h-screen w-full overflow-hidden relative">
            
            
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden transition-opacity"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            
            <aside 
              className={`
                fixed md:relative h-full border-r border-border bg-card/80 md:bg-card/40 backdrop-blur-xl z-50
                transition-all duration-300 ease-in-out
                ${isSidebarOpen 
                  ? 'w-64 translate-x-0 opacity-100' 
                  : 'w-0 -translate-x-full opacity-0 md:w-0 md:translate-x-0 md:border-none'} 
                overflow-hidden
              `}
            >

              <div className="h-full w-64 flex flex-col shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-border/50 justify-between shrink-0">
                  <Link href="/" className="font-bold text-xl tracking-tighter text-neon-cyan">
                    NEON<span className="text-foreground">TODO</span>
                  </Link>
                  
                  <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-muted-foreground">
                    <PanelLeftClose size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <Sidebar onNavigate={() => { if (window.innerWidth < 768) setIsSidebarOpen(false) }} />
                </div>
              </div>
            </aside>

            
            <div className="flex-1 flex flex-col min-w-0 h-full relative">
              
              
              <header className="h-16 shrink-0 border-b border-border bg-background/60 backdrop-blur-md z-40 flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-neon-cyan transition-all"
                  >
                    {isSidebarOpen ? <PanelLeftClose size={20} /> : <Menu size={20} />}
                  </button>
                  <Link href="/" className="md:hidden font-bold text-sm tracking-tighter text-neon-cyan">NEON</Link>
                </div>

                <div className="flex items-center gap-4 italic text-[10px] text-muted-foreground/40 font-mono hidden sm:block">
                  LIVE_SYSTEM_NODE_01
                </div>
              </header>

              
              <main className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
                <div className="flex-1 p-4 md:p-8">
                  <div className="absolute top-0 left-1/4 w-1/2 h-64 bg-neon-cyan/5 blur-[120px] pointer-events-none -z-10" />
                  <div className="max-w-6xl mx-auto">
                    {children}
                  </div>
                </div>

                <footer className="py-6 border-t border-border/40 bg-background/40 px-6">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center md:text-left">
                    © 2026 Todo Neon Protocol
                  </p>
                </footer>
              </main>

            </div>
          </div>

          <Toast />
          <div className="fixed bottom-5 right-5 z-[100]">
            <ThemeToggle />
          </div>

        </ThemeProvider>
      </body>
    </html>
  );
}
*/


/*
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import Sidebar from "@/components/sidebar/Sidebar";
import { Menu, X } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Đóng sidebar khi đổi trang trên mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <html lang="vi" suppressHydrationWarning>
      
      <body className={`${inter.className} antialiased h-screen overflow-hidden bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          <div className="flex h-full w-full relative">
            
            
            <aside className={`
              fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card
              transition-transform duration-300 ease-in-out
              md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
              <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 shrink-0 font-bold text-xl">
                <span>NEON<span className="text-neon-cyan">TODO</span></span>
                <button onClick={() => setIsOpen(false)} className="md:hidden p-1 hover:bg-accent rounded"><X size={20}/></button>
              </div>
              <div className="h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
                <Sidebar onNavigate={() => setIsOpen(false)} />
              </div>
            </aside>

            
            <div 
              onClick={() => setIsOpen(false)} 
              className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            />

            
            <div className="flex-1 flex flex-col min-w-0 h-full relative md:pl-64 transition-[padding] duration-300">
              
              
              <header className="h-16 border-b border-border flex items-center px-4 shrink-0 bg-background/60 backdrop-blur-md sticky top-0 z-30 w-full">
                <button onClick={() => setIsOpen(true)} className="md:hidden p-2 mr-2 hover:bg-accent rounded-lg transition-transform active:scale-90">
                  <Menu size={24} />
                </button>
                <div className="font-semibold text-sm tracking-tight opacity-70">Hệ thống / Dashboard</div>
              </header>

              
              <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar scroll-smooth">
                
                <div className="p-4 md:p-8 max-w-6xl mx-auto w-full min-h-full flex flex-col">
                  <div className="flex-1">
                    {children}
                  </div>
                  
                  
                  <footer className="mt-12 py-6 border-t border-border/40 text-[11px] text-muted-foreground">
                    © 2026 Todo Neon - Built for performance.
                  </footer>
                </div>
              </main>
            </div>

          </div>

          <Toast />
          <div className="fixed bottom-6 right-6 z-[60]"><ThemeToggle /></div>

        </ThemeProvider>
      </body>
    </html>
  );
}
*/
/*
"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import Sidebar from "@/components/sidebar/Sidebar";
import { Menu, X } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="vi" suppressHydrationWarning>
      
      <body className={`${inter.className} h-screen w-screen overflow-hidden bg-background antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          <div className="flex h-full w-full relative">
            
            
            <aside className={`
              fixed md:relative inset-y-0 left-0 z-50 w-64 border-r border-border bg-card
              transition-transform duration-300 ease-in-out shrink-0 flex flex-col
              ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
              <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 shrink-0">
                <span className="font-bold text-xl tracking-tighter">NEON<span className="text-neon-cyan">TODO</span></span>
                <button onClick={() => setIsOpen(false)} className="md:hidden p-2 hover:bg-accent rounded-lg">
                  <X size={20}/>
                </button>
              </div>
              
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <Sidebar onNavigate={() => setIsOpen(false)} />
              </div>
            </aside>

            
            {isOpen && (
              <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity" />
            )}

            
            <div className="flex-1 flex flex-col min-w-0 h-full">
              
              
              <header className="h-16 border-b border-border flex items-center px-4 shrink-0 bg-background/60 backdrop-blur-md">
                <button onClick={() => setIsOpen(true)} className="md:hidden p-2 hover:bg-accent rounded-lg mr-2">
                  <Menu size={24} />
                </button>
                <h1 className="font-semibold text-sm opacity-80">Workspace / Tasks</h1>
              </header>

              
              <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-background/50 relative">
                <div className="p-1 md:p-8 max-w-6xl mx-auto min-h-full">
                  {children}
                </div>
              </main>

            </div>
          </div>

          <Toast />
          <div className="fixed bottom-6 right-6 z-50 shadow-2xl">
            <ThemeToggle />
          </div>

        </ThemeProvider>
      </body>
    </html>
  );
}
*/



"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import Sidebar from "@/components/siderbar/Sidebar";
import { Menu, X } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="vi" suppressHydrationWarning>
      {/* KHÓA body: Không cho phép scroll ở tầng cao nhất */}
      <body className={`${inter.className} h-screen w-screen overflow-hidden bg-background antialiased text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          <div className="flex h-full w-full relative overflow-hidden">
            
            {/* --- SIDEBAR --- */}
            <aside className={`
              fixed md:relative inset-y-0 left-0 z-50 w-64 border-r border-border bg-card
              transition-transform duration-300 ease-in-out shrink-0 flex flex-col
              ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
              <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
                <span className="font-bold">NEON<span className="text-neon-cyan">TODO</span></span>
                <button onClick={() => setIsOpen(false)} className="md:hidden"><X size={20}/></button>
              </div>
              {/* Sidebar chỉ scroll bên trong vùng này */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                <Sidebar onNavigate={() => setIsOpen(false)} />
              </div>
            </aside>

            {/* BACKDROP cho Mobile */}
            {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-40 md:hidden" />}

            {/* --- KHU VỰC HIỂN THỊ CHÍNH --- */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
              
              {/* HEADER: Fix cứng chiều cao, không scroll */}
              <header className="h-16 border-b border-border bg-background/60 backdrop-blur-md flex items-center px-4 shrink-0 z-10">
                <button onClick={() => setIsOpen(true)} className="md:hidden p-2 mr-2"><Menu size={24} /></button>
                <div className="text-xs uppercase tracking-widest opacity-50 font-bold">Workspace</div>
              </header>

              {/* VÙNG CHỨA DUY NHẤT ĐƯỢC SCROLL: Chứa Main + Footer */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col custom-scrollbar">
                
                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 w-full max-w-6xl mx-auto shrink-0">
                  {children}
                </main>

                {/* Footer bám cuối */}
                <footer className="mt-auto py-8 border-t border-border/40 px-6 shrink-0">
                  <div className="max-w-6xl mx-auto flex justify-between text-[10px] text-muted-foreground uppercase">
                    <span>© 2026 Neon System</span>
                    <span>Stable v1.0</span>
                  </div>
                </footer>

              </div>
            </div>
          </div>

          <Toast />
          <div className="fixed bottom-6 right-6 z-[60]"><ThemeToggle /></div>

        </ThemeProvider>
      </body>
    </html>
  );
}














