// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import AppShell from "@/components/layout/AppShell";

// src/app/layout.tsx
import { InstallPrompt } from "@/components/InstallPrompt"; // Đường dẫn đến file bạn vừa tạo
import type { Metadata, Viewport } from "next";

// 1. Cấu hình Viewport để tối ưu hiển thị trên Mobile (Chống zoom khi focus input)
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Quan trọng: Tràn màn hình qua cả phần tai thỏ iPhone
};

// 2. Cấu hình Metadata chính
export const metadata: Metadata = {
  title: "Tâm Việt Luxury",
  description: "Nâng tầm trải nghiệm cầu lông cao cấp",
  manifest: "/manifest.json", // Khai báo file manifest trong thư mục public
  appleWebApp: {
    capable: true, // Biến Web thành App khi "Thêm vào MH chính"
    statusBarStyle: "default", // Hoặc "black-translucent" nếu muốn trong suốt
    title: "Tâm Việt",
  },
  formatDetection: {
    telephone: false, // Tránh tự động đổi màu số điện thoại thành link xanh
  },
  icons: {
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" }, // Icon khi hiện ngoài màn hình iPhone
    ],
  },
};

const inter = Inter({ subsets: ["latin"] });
/*
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} h-full`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
*/

/*
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen overflow-y-auto`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
          <InstallPrompt />
        </ThemeProvider>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) { console.log('Tâm Việt SW: OK'); },
                    function(err) { console.log('Tâm Việt SW: Lỗi', err); }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
*/


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen overflow-y-auto`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
          <InstallPrompt />
        </ThemeProvider>

        {/* Đăng ký Service Worker & Xin quyền lưu trữ bền vững */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) { 
                      console.log('Tâm Việt SW: OK');
                      
                      // XIN QUYỀN LƯU TRỮ BỀN VỮNG TẠI ĐÂY
                      if (navigator.storage && navigator.storage.persist) {
                        navigator.storage.persist().then(granted => {
                          if (granted) console.log("Tâm Việt: Đã chiếm quyền lưu trữ bền vững!");
                        });
                      }
                    },
                    function(err) { console.log('Tâm Việt SW: Lỗi', err); }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}






