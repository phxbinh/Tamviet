// app/page.tsx
/*
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";

export default function Home() {
  return (
    // Sử dụng Fragment hoặc div để không lặp lại thẻ <main> từ layout
    <div className="relative flex flex-col gap-10">

      
      <Hero />

      
      <Features />

    </div>
  );
}
*/

// app/page.tsx
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";

export default function Home() {
  return (
    <div className="relative flex flex-col gap-10 min-h-screen">

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

    </div>
  );
}
