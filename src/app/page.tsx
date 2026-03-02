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

    </div>
  );
}
