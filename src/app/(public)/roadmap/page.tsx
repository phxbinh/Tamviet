
// src/app/(public)/roadmap/page.tsx
"use client";

import React from 'react';
import { Database, Lock, Map, Rocket, Search } from 'lucide-react';
import { useElementOnScreen } from '@/hooks/useElementOnScreen';

const steps = [
  {
    title: "Khởi tạo Next.js 15",
    desc: "Sử dụng cấu trúc App Router, tối ưu hóa Hydration và React 19 Actions.",
    icon: <Rocket className="w-6 h-6" />,
    // Primary: Dùng màu xanh thương hiệu của bạn, ép text-white để không mất màu icon
    color: "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    accent: "border-primary"
  },
  {
    title: "Auth với Supabase",
    desc: "Triển khai Middleware để bảo vệ Route và quản lý Session người dùng.",
    icon: <Lock className="w-6 h-6" />,
    // Purple: Màu đặc trưng của Supabase/Auth
    color: "bg-neon-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    accent: "border-neon-purple"
  },
  {
    title: "Database tại Neon",
    desc: "Kết nối PostgreSQL serverless, tận dụng tính năng Auto-scaling và Branching.",
    icon: <Database className="w-6 h-6" />,
    // Cyan: Màu xanh Neon cực rực rỡ
    color: "bg-neon-cyan text-[#020617] shadow-[0_0_15px_rgba(34,211,238,0.6)]",
    accent: "border-neon-cyan"
  },
  {
    title: "Sitemap & SEO",
    desc: "Tự động tạo sitemap.xml và robots.txt để Google Index nhanh hơn.",
    icon: <Search className="w-6 h-6" />,
    // Orange: Màu Google/SEO truyền thống
    color: "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]",
    accent: "border-orange-500"
  },
  {
    title: "Vercel Deployment",
    desc: "CI/CD tự động, tối ưu hóa Edge Runtime và phân phối qua Global CDN.",
    icon: <Map className="w-6 h-6" />,
    // Fix: Dùng màu đen/trắng tĩnh (static) để không bị đảo ngược khi đổi theme
    color: "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-lg",
    accent: "border-slate-950 dark:border-white"
  }
];

const RoadmapStep = ({ step, index }: { step: any, index: number }) => {
  const [containerRef, isVisible] = useElementOnScreen({ 
    threshold: 0.3, 
    freezeOnceVisible: true 
  });

  return (
    <div 
      ref={containerRef as any}
      className={`flex items-start mb-16 transition-all duration-1000 
        ${isVisible ? 'opacity-100 translate-y-0 animate-reveal' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Icon sử dụng hiệu ứng breathe từ CSS của bạn */}
      <div className={`p-4 rounded-2xl shadow-lg z-10 shrink-0 text-white ${step.color} ${isVisible ? 'animate-breathe-slow' : ''}`}>
        {step.icon}
      </div>

      <div className="ml-8 border-l-2 border-border pl-10 pb-2 relative">
        {/* Dấu chấm trên đường kẻ */}
{/*
        <div className={`absolute top-6 -left-[9px] w-4 h-4 bg-card border-2 rounded-full ${step.accent}`} />
        */}
<div className={`absolute top-6 -left-[9px] w-4 h-4 bg-card border-2 rounded-full shadow-[0_0_8px_currentColor] ${step.accent}`} />

        <h3 className="text-2xl font-bold tracking-tight text-foreground uppercase italic">
          {step.title}
        </h3>
        <p className="text-foreground/60 mt-3 max-w-lg text-lg leading-relaxed font-medium">
          {step.desc}
        </p>
      </div>
    </div>
  );
};

export default function Roadmap() {
  return (
    /* Vì html/body bị overflow: hidden, ta cần thẻ main này chiếm trọn màn hình 
      và tự quản lý việc cuộn (custom-scrollbar)
    */

      <div className="max-w-3xl mx-auto py-24 px-6">
        
        <header className="text-center mb-24 space-y-4">
          <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-sm animate-breathe-fast">
            Development Flow
          </h2>
          <h1 className="text-6xl font-black tracking-tighter text-foreground italic uppercase">
            Fullstack <span className="text-neon-cyan">2026</span>
          </h1>
          <div className="h-1.5 w-24 bg-neon-purple mx-auto rounded-full shadow-[0_0_10px_#a855f7]" />
        </header>

        <section className="relative px-2">
          {steps.map((step, idx) => (
            <RoadmapStep key={idx} step={step} index={idx} />
          ))}
        </section>

        <footer className="mt-32 pb-20 text-center">
          <button className="px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-xl hover:animate-shake transition-all active:scale-95">
            TRIỂN KHAI DỰ ÁN
          </button>
        </footer>
      </div>

  );
}












