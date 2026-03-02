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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* HEADER CHUNG - Luôn hiện ở mọi trang */}
          <header className="sticky top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              {/* Logo / Brand */}
              <Link href="/" className="group flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform">
                  <span className="text-black font-black text-xs">N26</span>
                </div>
                <span className="font-bold text-xl tracking-tighter text-foreground">
                  NEON<span className="text-neon-cyan">TODO</span>
                </span>
              </Link>

              {/* Navigation & Theme Toggle */}
              <nav className="flex items-center gap-6">
                <Link 
                  href="/todos" 
                  className="text-sm font-medium text-muted-foreground hover:text-neon-cyan transition-colors"
                >
                  Danh sách Todo
                </Link>
                
                {/* Nút chuyển theme xuất hiện ở đây */}
                <ThemeToggle />
              </nav>
            </div>
          </header>

          {/* NỘI DUNG TRANG CHÍNH */}
          <main className="relative min-h-[calc(100-64px)] flex flex-col">
            {children}
          </main>

          {/* FOOTER CHUNG (Nếu bạn muốn hiện ở mọi nơi) */}
          <footer className="py-8 border-t border-border text-center text-xs text-muted-foreground">
            © 2026 Neon Todo System • Built with Next.js 15
          </footer>
          
        </ThemeProvider>
      </body>
    </html>
  );
}
