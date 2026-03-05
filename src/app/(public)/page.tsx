// src/app/(public)/page.tsx
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import Link  from "next/link";
export default function PublicPage() {
  return (
    <div className="relative flex flex-col gap-10 min-h-screen">
      <Hero />
      <Features />
    </div>
  );
}