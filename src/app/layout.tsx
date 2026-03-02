import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Cấu hình Font chữ hiện đại
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
    // suppressHydrationWarning: Cực kỳ quan trọng khi dùng next-themes 
    // để tránh lỗi mismatch giữa Server và Client
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"       // Sử dụng class .dark để đổi theme
          defaultTheme="system"   // Mặc định theo hệ điều hành
          enableSystem            // Cho phép tự động đồng bộ với OS
          disableTransitionOnChange // Tránh giật lag khi chuyển theme nhanh
        >
          {/* Layout Wrapper */}
          <div className="relative min-h-screen flex flex-col">
            {/* Bạn có thể đặt Navbar chung ở đây nếu muốn */}
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
