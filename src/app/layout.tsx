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
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";
import Sidebar from "@/components/sidebar/Sidebar"; // Import Sidebar của bạn
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo Neon 2026",
  description: "Hệ thống quản trị phong cách tương lai",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased overflow-hidden bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          {/* TOAST HỆ THỐNG (Luôn trên cùng) */}
          <Toast />

          <div className="flex h-screen w-full overflow-hidden">
            
            {/* CỘT 1: SIDEBAR (Cố định bên trái) */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/30 backdrop-blur-xl">
               {/* Logo Area trong Sidebar */}
               <div className="h-16 flex items-center px-6 border-b border-border/50">
                  <Link href="/" className="font-bold text-xl tracking-tighter transition-transform hover:scale-105 active:scale-95">
                    NEON<span className="text-neon-cyan">TODO</span>
                  </Link>
               </div>
               
               {/* Nội dung danh sách link */}
               <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <Sidebar />
               </div>
            </aside>

            {/* CỘT 2: KHU VỰC NỘI DUNG CHÍNH (Header + Content) */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
              
              {/* HEADER (Nằm trong Cột 2, dính lên top) */}
              <header className="h-16 border-b border-border bg-background/60 backdrop-blur-md flex items-center justify-between px-6 z-30">
                <div className="flex items-center gap-4">
                  {/* Chỗ này sau này có thể thêm nút Breadcrumb hoặc Search */}
                  <h2 className="text-sm font-medium text-muted-foreground italic">System / Dashboard</h2>
                </div>

                <nav className="flex items-center gap-6">
                  <Link href="/todos" className="text-sm hover:text-neon-cyan transition-colors">
                    Nhiệm vụ
                  </Link>
                  <div className="h-4 w-[1px] bg-border" />
                  <span className="text-xs font-mono text-neon-purple opacity-70">v1.0.4-STABLE</span>
                </nav>
              </header>

              {/* VÙNG CUỘN NỘI DUNG (children của các page.tsx) */}
              <main className="flex-1 overflow-y-auto custom-scrollbar relative p-4 md:p-8">
                 {/* Hiệu ứng Ambient Light nền nội dung cho chuyên nghiệp */}
                 <div className="absolute top-0 left-1/4 w-1/2 h-64 bg-neon-cyan/5 blur-[120px] pointer-events-none -z-10" />
                 
                 <div className="max-w-6xl mx-auto">
                    {children}
                 </div>
              </main>

            </div>
          </div>

          {/* Nút Theme nổi cố định */}
          <div className="fixed bottom-6 right-6 z-50">
            <ThemeToggle />
          </div>

        </ThemeProvider>
      </body>
    </html>
  );
}




