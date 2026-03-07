
// src/app/(public)/roadmap/page.tsx
/*
"use client";

import React from 'react';
import { CheckCircle2, Database, Lock, Map, Rocket, Search } from 'lucide-react';
import { useElementOnScreen } from '@/hooks/useElementOnScreen'; // Sử dụng hook đã tạo ở câu trả lời trước

const steps = [
  {
    title: "Khởi tạo Next.js 15 & TS",
    desc: "Thiết lập cấu trúc App Router, tối ưu hóa Hydration và sử dụng React 19 Actions.",
    icon: <Rocket className="w-6 h-6" />,
    color: "bg-blue-500"
  },
  {
    title: "Auth với Supabase",
    desc: "Triển khai Middleware để bảo vệ Route và quản lý Session người dùng qua SSR.",
    icon: <Lock className="w-6 h-6" />,
    color: "bg-emerald-500"
  },
  {
    title: "Database tại Neon (Serverless)",
    desc: "Kết nối PostgreSQL từ Neon.tech để tận dụng tính năng Auto-scaling và Branching.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-indigo-500"
  },
  {
    title: "Sitemap & SEO Google",
    desc: "Tự động tạo sitemap.xml và robots.txt bằng Metadata API của Next.js để index nhanh hơn.",
    icon: <Search className="w-6 h-6" />,
    color: "bg-orange-500"
  },
  {
    title: "Vercel Deployment",
    desc: "CI/CD tự động, tối ưu hóa Edge Runtime và phân phối nội dung qua Global CDN.",
    icon: <Map className="w-6 h-6" />,
    color: "bg-black"
  }
];

const RoadmapStep = ({ step, index }: { step: any, index: number }) => {
  const [containerRef, isVisible] = useElementOnScreen({ threshold: 0.3, freezeOnceVisible: true });

  return (
    <div 
      ref={containerRef as any}
      className={`flex items-start mb-12 transition-all duration-1000 delay-${index * 100} 
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
    >
      <div className={`p-3 rounded-full text-white ${step.color} shadow-lg z-10`}>
        {step.icon}
      </div>
      <div className="ml-6 border-l-2 border-gray-100 pl-8 pb-4 relative">
        <div className="absolute top-5 -left-[9px] w-4 h-4 bg-white border-2 border-gray-200 rounded-full" />
        <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
        <p className="text-gray-600 mt-2 max-w-md leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
};

export default function Roadmap() {
  return (
    <main className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Project Roadmap <span className="text-blue-600">2026</span>
          </h1>
          <p className="text-lg text-gray-500">Quy trình xây dựng ứng dụng Fullstack hiện đại</p>
        </div>

        <div className="relative">
          {steps.map((step, idx) => (
            <RoadmapStep key={idx} step={step} index={idx} />
          ))}
        </div>
      </div>
    </main>
  );
}
*/


"use client";

import React from 'react';
import { Database, Lock, Map, Rocket, Search } from 'lucide-react';
import { useElementOnScreen } from '@/hooks/useElementOnScreen';

const steps = [
  {
    title: "Next.js 15 & Tailwind 4",
    desc: "Khởi tạo Project với cấu trúc App Router mới nhất, tối ưu Hydration.",
    icon: <Rocket className="w-6 h-6" />,
    // Sử dụng màu neon từ globals.css
    colorClass: "bg-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.4)]",
    borderClass: "border-neon-cyan"
  },
  {
    title: "Supabase Auth",
    desc: "Xác thực người dùng qua Middleware, bảo mật Route phía Server.",
    icon: <Lock className="w-6 h-6" />,
    colorClass: "bg-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]",
    borderClass: "border-neon-purple"
  },
  {
    title: "Neon Serverless DB",
    desc: "Lưu trữ dữ liệu tại Neon.tech, kết nối PostgreSQL hiệu năng cao.",
    icon: <Database className="w-6 h-6" />,
    colorClass: "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]",
    borderClass: "border-primary"
  },
  {
    title: "SEO & Sitemap",
    desc: "Tạo Mapsite tự động, cấu hình Robots.txt để tối ưu Google Search.",
    icon: <Search className="w-6 h-6" />,
    colorClass: "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]",
    borderClass: "border-orange-500"
  },
  {
    title: "Vercel Deploy",
    desc: "Đẩy dự án lên Vercel, cấu hình ENV và tối ưu Edge Network.",
    icon: <Map className="w-6 h-6" />,
    colorClass: "bg-foreground text-background",
    borderClass: "border-foreground"
  }
];

const RoadmapStep = ({ step, index }: { step: any; index: number }) => {
  // Hook của bạn
  const [containerRef, isVisible] = useElementOnScreen({ 
    threshold: 0.2, 
    freezeOnceVisible: true 
  });

  return (
    <div 
      ref={containerRef as any}
      className={`flex items-start mb-16 transition-all duration-1000 ease-out
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Icon Circle - Sử dụng animation 'breathe' từ globals.css khi visible */}
      <div className={`
        p-4 rounded-2xl text-white z-10 shrink-0
        ${step.colorClass} 
        ${isVisible ? 'animate-breathe-slow' : ''}
      `}>
        {step.icon}
      </div>

      {/* Line & Content */}
      <div className="ml-8 border-l-2 border-border pl-10 pb-2 relative">
        {/* Dấu chấm trên đường kẻ sử dụng màu border của từng bước */}
        <div className={`
          absolute top-6 -left-[9px] w-4 h-4 bg-card border-2 rounded-full
          ${step.borderClass}
        `} />
        
        <h3 className="text-2xl font-bold tracking-tight text-foreground uppercase italic">
          {step.title}
        </h3>
        
        <div className="text-foreground/70 mt-3 max-w-lg text-lg leading-relaxed font-medium">
          {step.desc}
        </div>
      </div>
    </div>
  );
};

export default function RoadmapPage() {
  return (
    /* Sử dụng class 'custom-scrollbar' từ globals.css */
    <main className="min-h-screen bg-background py-24 px-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto">
        
        {/* Header - Sử dụng màu primary từ theme */}
        <header className="text-center mb-24 space-y-4">
          <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-sm animate-breathe-fast">
            Build Fast • Ship Faster
          </h2>
          <h1 className="text-6xl font-black tracking-tighter text-foreground italic uppercase">
            Project <span className="text-neon-cyan">Roadmap</span>
          </h1>
          <div className="h-1 w-20 bg-neon-purple mx-auto rounded-full" />
        </header>

        {/* Roadmap List */}
        <section className="relative">
          {steps.map((step, idx) => (
            <RoadmapStep key={idx} step={step} index={idx} />
          ))}
        </section>

        {/* Footer hoặc Call to action mang tính 'Shake' khi hover */}
        <footer className="mt-20 text-center">
          <button className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:animate-shake transition-all cursor-pointer">
            BẮT ĐẦU DỰ ÁN NGAY
          </button>
        </footer>
      </div>
    </main>
  );
}










