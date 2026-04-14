// app/layout.tsx
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import AppShell from "@/components/layout/AppShell";
import { CartProvider } from "@/components/cart/CartProvider";

// src/app/layout.tsx
import { InstallPrompt } from "@/components/InstallPrompt"; // Đường dẫn đến file bạn vừa tạo
import type { Metadata, Viewport } from "next";


// Sử dụng cho font
// app/fonts.ts hoặc ngay trong app/layout.tsx
import { Inter, Montserrat } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap', // QUAN TRỌNG: Giúp giảm render-blocking bằng cách hiện font hệ thống trước
  variable: '--font-inter', // Dùng để kết hợp với Tailwind
});

export const montserrat = Montserrat({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-montserrat',
});


// 1. Cấu hình Viewport để tối ưu hiển thị trên Mobile (Chống zoom khi focus input)
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover", // Quan trọng: Tràn màn hình qua cả phần tai thỏ iPhone
};


// 2. Cấu hình Metadata chính
export const metadata: Metadata = {
  title: "Tâm Việt | Nâng Tầm Trải Nghiệm Cầu Lông Cao Cấp",
  description: "Cung cấp trang thiết bị và phụ kiện cầu lông cao cấp. Khám phá hệ sinh thái Tâm Việt Luxury - Nơi đam mê hội tụ.",
  verification: {
    google: "f3lJRo-QGQu7SMmasdZGmvV4MOe3J92lN4icOfGRe64",
  },
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
      { url: "/icon.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" }, 
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

//const inter = Inter({ subsets: ["latin"] });

import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

/*
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <AppShell>{children}</AppShell>
            <InstallPrompt />
          </CartProvider>
        </ThemeProvider>

        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
*/

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      {/* Thêm font variable vào đây */}
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange // Thêm cái này để tránh nháy CSS khi đổi theme
        >
          <CartProvider>
            <AppShell>{children}</AppShell>
          </CartProvider>
        </ThemeProvider>

        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

/*
Sử dụng cho font tự chọn
2. Nếu bạn dùng Font nội bộ (Local Font)
Nếu bạn có tệp font riêng (ví dụ: .woff2 trong thư mục public/fonts), hãy dùng next/font/local:
```typescript
app/font.ts
import localFont from 'next/font/local';

const myCustomFont = localFont({
  src: './fonts/my-font.woff2',
  display: 'swap',
  variable: '--font-custom',
});

cấu hình trong next.config.mjs
Trong file next.config.js bạn đã gửi,
để bổ trợ cho việc tải font nhanh hơn
và giảm thiểu lỗi "Render-blocking",
bạn nên thêm cấu hình Headers để
trình duyệt Cache font lâu hơn:

  async headers() {
    return [
      // ... các cấu hình cũ của bạn
      {
        // Cấu hình Cache vĩnh viễn cho Fonts (vì chúng hiếm khi thay đổi)
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },



*/







