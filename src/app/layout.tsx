// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"] });

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
          {/*<div className="fixed bottom-6 right-6 z-50"><ThemeToggle /></div>*/}
        </ThemeProvider>
      </body>
    </html>
  );
}