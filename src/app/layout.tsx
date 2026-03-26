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
  title: "Tâm Việt | Nâng Tầm Trải Nghiệm Cầu Lông Cao Cấp",
  description: "Cung cấp trang thiết bị và phụ kiện cầu lông cao cấp. Khám phá hệ sinh thái Tâm Việt Luxury - Nơi đam mê hội tụ.",
  metadataBase: new URL('https://tamviet.vercel.app'), // Thay bằng domain thật của bạn
  alternates: {
    canonical: '/',
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tâm Việt",
  },
  formatDetection: {
    telephone: false,
  },
  // Thêm phần này để hiển thị ảnh khi chia sẻ link
  openGraph: {
    title: "Tâm Việt Luxury",
    description: "Nâng tầm trải nghiệm cầu lông cao cấp",
    url: 'https://tamviet.vercel.app',
    siteName: 'Tâm Việt Luxury',
    images: [
      {
        url: '/og-image.png', // Bạn cần để 1 tấm ảnh 1200x630 trong thư mục public
        width: 1200,
        height: 630,
        alt: 'Tâm Việt Luxury Preview',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" }, 
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
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
*/


import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen overflow-y-auto no-scrollbar`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
          {/* <InstallPrompt /> */}
        </ThemeProvider>

        <ServiceWorkerRegister />
      </body>
    </html>
  );
}



