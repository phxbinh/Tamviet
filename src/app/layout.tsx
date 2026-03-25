// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import AppShell from "@/components/layout/AppShell";

// src/app/layout.tsx
import { InstallPrompt } from "@/components/InstallPrompt"; // Đường dẫn đến file bạn vừa tạo

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

export const metadata: Metadata = {
  manifest: "/manifest.json", // Thêm dòng này
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tâm Việt",
  },
};



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
        
      </body>
    </html>
  );
}
