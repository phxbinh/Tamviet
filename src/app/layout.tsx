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
"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import Sidebar from "@/components/sidebar/Sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mặc định đóng trên mobile
  const pathname = usePathname();

  // Reset trạng thái khi chuyển trang hoặc đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize(); // Chạy lần đầu
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pathname]);

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased overflow-hidden bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          <div className="flex h-screen w-full overflow-hidden relative">
            
            {/* 1. BACKDROP: Lớp nền mờ khi mở Menu trên Mobile */}
            <div 
              className={`
                fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] transition-opacity duration-300 md:hidden
                ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
              `}
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* 2. SIDEBAR: Hiệu ứng trượt (Slide-in) */}
            <aside 
              className={`
                fixed md:relative h-full w-64 border-r border-border bg-card/90 md:bg-card/40 backdrop-blur-xl z-50
                transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}
              `}
            >
              <div className="h-full flex flex-col w-64">
                <div className="h-16 flex items-center px-6 border-b border-border/50 justify-between shrink-0">
                  <Link href="/" className="font-bold text-xl tracking-tighter text-neon-cyan">
                    NEON<span className="text-foreground">TODO</span>
                  </Link>
                  {/* Nút đóng nhanh chỉ hiện trên mobile */}
                  <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 hover:bg-accent rounded-lg">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <Sidebar onNavigate={() => { if (window.innerWidth < 768) setIsSidebarOpen(false) }} />
                </div>
              </div>
            </aside>

            {/* 3. KHU VỰC NỘI DUNG */}
            <div className="flex-1 flex flex-col min-w-0 h-full relative">
              
              {/* HEADER: Chứa Burger Icon */}
              <header className="h-16 shrink-0 border-b border-border bg-background/60 backdrop-blur-md z-40 flex items-center px-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-neon-cyan transition-all"
                  aria-label="Toggle Menu"
                >
                  {/* Trên mobile hiện Burger, trên Desktop hiện Panel Toggle */}
                  <div className="md:hidden">
                    <Menu size={24} /> 
                  </div>
                  <div className="hidden md:block">
                    {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                  </div>
                </button>
                
                <div className="ml-4 font-bold md:hidden text-neon-cyan tracking-tighter">NEON</div>
                <div className="ml-auto hidden sm:block text-[10px] font-mono opacity-30 italic">NODE_STATUS: ACTIVE</div>
              </header>

              {/* VÙNG CUỘN CHÍNH */}
              <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="p-4 md:p-10 max-w-6xl mx-auto">
                  {children}
                </div>
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





