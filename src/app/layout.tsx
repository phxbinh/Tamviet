import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle"; // Import nút chuyển theme
import Link from "next/link";

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
          
          {/* Navbar bây giờ chỉ chứa Logo và Menu */}
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

          {/* NÚT THEME NỔI (FIXED) - Tách biệt hoàn toàn */}
{/*
          <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
            <div className="p-1 rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_32px_rgba(34,211,238,0.15)] hover:scale-105 transition-all duration-300">
              <ThemeToggle__ />
            </div>
          </div>
*/
          {/* Theme Toggle FAB */}
          <div className="fixed bottom-8 right-8 z-[100]">
            <ThemeToggle />
          </div>

        </ThemeProvider>
      </body>
    </html>
  );
}
