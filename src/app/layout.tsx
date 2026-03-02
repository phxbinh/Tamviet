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
      {/* Thêm overscroll-none để tránh giật trên mobile */}
      <body className={`${inter.className} antialiased h-screen overflow-hidden bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          <div className="flex h-full w-full relative">
            
            {/* 1. SIDEBAR (Cố định chiều rộng, không gây giật layout) */}
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

            {/* 2. BACKDROP (Mờ dần mượt mà) */}
            <div 
              onClick={() => setIsOpen(false)} 
              className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            />

            {/* 3. NỘI DUNG CHÍNH (Chiếm trọn màn hình) */}
            <div className="flex-1 flex flex-col min-w-0 h-full relative md:pl-64 transition-[padding] duration-300">
              
              {/* Header (Sticky cố định trên cùng) */}
              <header className="h-16 border-b border-border flex items-center px-4 shrink-0 bg-background/60 backdrop-blur-md sticky top-0 z-30 w-full">
                <button onClick={() => setIsOpen(true)} className="md:hidden p-2 mr-2 hover:bg-accent rounded-lg transition-transform active:scale-90">
                  <Menu size={24} />
                </button>
                <div className="font-semibold text-sm tracking-tight opacity-70">Hệ thống / Dashboard</div>
              </header>

              {/* Vùng cuộn duy nhất của cả ứng dụng */}
              <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar scroll-smooth">
                {/* Content wrapper để tránh nội dung sát mép */}
                <div className="p-4 md:p-8 max-w-6xl mx-auto w-full min-h-full flex flex-col">
                  <div className="flex-1">
                    {children}
                  </div>
                  
                  {/* Footer đơn giản nằm trong main để cuộn theo nội dung */}
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





