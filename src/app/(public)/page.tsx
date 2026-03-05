import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";

export default function PublicPage() {
  return (
    // Sử dụng Fragment hoặc div để không lặp lại thẻ <main> từ layout
    <div className="relative flex flex-col gap-10">
      <Hero />
      <Features />
    </div>
  );
}