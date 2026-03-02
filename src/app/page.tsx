// app/page.tsx
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";

export default function Home() {
  return (
    // Sử dụng Fragment hoặc div để không lặp lại thẻ <main> từ layout
    <div className="relative flex flex-col gap-10">
      
      {/* Hero Section: Điểm chạm đầu tiên với hiệu ứng Neon */}
      <Hero />

      {/* Features Section: Kiểm chứng hệ thống bg-muted và bg-card */}
      <Features />

      {/* Footer: Sử dụng border-border để tự động đổi màu theo theme */}
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

    </div>
  );
}
