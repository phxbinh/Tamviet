// app/page.tsx
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Features />
      
      {/* Footer đơn giản */}
      <footer className="py-10 text-center border-t border-border text-sm text-gray-500">
        © 2026 Dự án Next.js TypeScript của bạn.
      </footer>
    </main>
  );
}
