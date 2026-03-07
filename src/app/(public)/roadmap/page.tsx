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
