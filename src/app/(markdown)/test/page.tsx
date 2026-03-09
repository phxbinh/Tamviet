"use client";

import React, { useState, useEffect, useRef } from 'react';
import { parseMarkdown } from '@/lib/md/markdown';
import TableOfContents from '@/components/md/TableOfContentsFix';

// Giả định MOCK_MARKDOWN đã được import hoặc định nghĩa bên trên
const MOCK_MARKDOWN = `
# Hướng dẫn Next.js 15 & Tailwind 4

Chào mừng bạn đến với bài viết kỹ thuật. Đây là nội dung test cho trình render Markdown.

## 1. Khởi tạo dự án
Đầu tiên, bạn cần chạy lệnh sau để khởi tạo:
\`\`\`bash
npx create-next-app@latest --ts
\`\`\`

## 2. Cấu hình Supabase Auth
Hệ thống xác thực giúp bảo vệ ứng dụng của bạn.

### 2.1 Cài đặt SDK
Sử dụng npm để cài đặt thư viện chính thức.

### 2.2 Middleware Setup
Bảo vệ các route nhạy cảm phía Server.

## 3. Database với Neon
Kết nối PostgreSQL Serverless cực nhanh.

### 3.1 Tạo bảng
Sử dụng SQL Editor trên Dashboard của Neon.

---

## 4. Kiểm tra bảo mật (XSS Test)
Dưới đây là một đoạn mã độc hại giả lập:
<img src=x onerror=alert('XSS_ATTACKED') />
<script>console.log('Virus đang chạy...')</script>
*Nếu bạn không thấy thông báo alert, nghĩa là DOMPurify đang làm việc tốt!*

---

## 5. Kết luận
Chúc mừng bạn đã hoàn thành lộ trình!
`;


export default function MarkdownTest() {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const sanitized = await parseMarkdown(MOCK_MARKDOWN);
        setHtmlContent(sanitized);
      } catch (error) {
        console.error("Markdown parsing failed:", error);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  // Màn hình Loading đồng bộ với brand colors của bạn
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
          <p className="animate-breathe-slow text-primary font-bold tracking-widest uppercase text-xs">
            Đang tải tài liệu...
          </p>
        </div>
      </div>
    );
  }
return (
  /* Container chính: Thêm padding-top nếu cần để không dính sát header */
  <div className="max-w-6xl mx-auto pb-8 px-4">

    {/* Layout chính: Sử dụng Items-start để sticky hoạt động đúng */}
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-12 items-start relative">
      
      {/* 1. TOC CHO MOBILE
          - top-[72px]: Để nó nằm ngay dưới Header của Shell (64px + 8px gap)
          - z-30: Đảm bảo nằm trên content nhưng dưới Sidebar mobile của Shell
      */} {/*
      <div className="lg:hidden w-full sticky top-0 z-30 mb-8 transition-all duration-300"> 
        <TableOfContents htmlContent={htmlContent} contentRef={contentRef} />
      </div> */}

        <TableOfContents htmlContent={htmlContent} contentRef={contentRef} />

      {/* 2. NỘI DUNG CHÍNH 
          - min-w-0: Cực kỳ quan trọng để code blocks không làm vỡ grid
      */}
      <article className="min-w-0 w-full">
        <header className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl lg:text-5xl font-black italic text-foreground uppercase tracking-tighter mb-4">
            Tài liệu kỹ thuật <span className="text-neon-cyan">2026</span>
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-neon-purple/10 text-neon-purple text-[10px] font-bold rounded-md border border-neon-purple/20 tracking-widest">NEXT.JS 15</span>
            <span className="px-3 py-1 bg-neon-cyan/10 text-neon-cyan text-[10px] font-bold rounded-md border border-neon-cyan/20 tracking-widest">TAILWIND 4</span>
          </div>
        </header>

        {/* Nội dung Markdown */}
        <div ref={contentRef} className="prose lg:prose-xl max-w-none">
          <div 
            className="markdown-body text-foreground/80 leading-relaxed
              [&_h1]:hidden 
              [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-6 [&_h2]:text-primary [&_h2]:text-primary [&_h2]:text-lg [&_h2]:italic [&_h2]:scroll-mt-28
              [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-4 [&_h3]:text-neon-purple [&_h3]:text-base [&_h3]:scroll-mt-28
              [&_p]:mb-6 [&_p]:text-lg [&_p]:leading-7
              [&_code]:bg-card [&_code]:text-neon-cyan [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-[0.9em]
              [&_pre]:bg-slate-950 [&_pre]:p-6 [&_pre]:rounded-2xl [&_pre]:mb-8 [&_pre]:border [&_pre]:border-border/50 [&_pre]:shadow-2xl
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ul]:space-y-3
              [&_blockquote]:border-l-4 [&_blockquote]:border-neon-purple [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:my-8 [&_blockquote]:bg-neon-purple/5 [&_blockquote]:py-4 [&_blockquote]:rounded-r-xl
              [&_hr]:border-border [&_hr]:my-12 [&_hr]:opacity-30"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </div>
      </article>

      {/* 3. TOC CHO DESKTOP
          - top-24: Khoảng cách đẹp mắt khi cuộn trên màn hình lớn
      */}
      <aside className="hidden lg:block sticky top-24 self-start w-full">
        <div className="border-l border-border/10 pl-6">
          <TableOfContents htmlContent={htmlContent} contentRef={contentRef} />
        </div>
      </aside>

    </div>
  </div>
);
}


function wnTest() {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const sanitized = await parseMarkdown(MOCK_MARKDOWN);
        setHtmlContent(sanitized);
      } catch (error) {
        console.error("Markdown parsing failed:", error);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  // Màn hình Loading đồng bộ với brand colors của bạn
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
          <p className="animate-breathe-slow text-primary font-bold tracking-widest uppercase text-xs">
            Đang tải tài liệu...
          </p>
        </div>
      </div>
    );
  }
return (
  <div className="max-w-6xl mx-auto py-2 px-4">

    {/* GRID: Trên mobile là 1 cột, trên desktop (lg) là 2 cột */}
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_280px] gap-8 items-start relative">
      {/* 1. TOC CHO MOBILE (Hiện đầu trang bài viết) */}
      <div className="lg:hidden w-full sticky top-2 z-20 mb-4"> 
        <TableOfContents htmlContent={htmlContent} contentRef={contentRef} />
      </div>

      {/* 2. NỘI DUNG CHÍNH */}
          <article className="min-w-0 w-full">
            
            <header className="mb-12 border-b border-border pb-8">
              <h1 className="text-4xl lg:text-5xl font-black italic text-foreground uppercase tracking-tighter mb-4">
                Tài liệu kỹ thuật <span className="text-neon-cyan">2026</span>
              </h1>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-neon-purple/10 text-neon-purple text-xs font-bold rounded-full border border-neon-purple/20">NEXT.JS 15</span>
                <span className="px-3 py-1 bg-neon-cyan/10 text-neon-cyan text-xs font-bold rounded-full border border-neon-cyan/20">TAILWIND 4</span>
              </div>
            </header>

            <div ref={contentRef} className="prose lg:prose-xl">
            <div 
              className="markdown-body text-foreground/80 leading-relaxed font-medium
                [&_h1]:hidden 
                [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:text-primary [&_h2]:italic [&_h2]:scroll-mt-32
                [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-4 [&_h3]:text-neon-purple [&_h3]:scroll-mt-32
                [&_p]:mb-6 [&_p]:text-lg
                [&_code]:bg-card [&_code]:text-neon-cyan [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm
                [&_pre]:bg-slate-950 [&_pre]:p-6 [&_pre]:rounded-2xl [&_pre]:text-slate-100 [&_pre]:mb-8 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-border
                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ul]:space-y-2
                [&_blockquote]:border-l-4 [&_blockquote]:border-neon-purple [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:my-8 [&_blockquote]:text-foreground/60
                [&_hr]:border-border [&_hr]:my-12 [&_hr]:opacity-50"
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
            </div>
          </article>

      {/* 3. TOC CHO DESKTOP (Vẫn giữ sticky) */}
      <aside className="hidden lg:block sticky top-24 self-start">
        <TableOfContents htmlContent={htmlContent} contentRef={contentRef} />
      </aside>

    </div>
  </div>
);
}

