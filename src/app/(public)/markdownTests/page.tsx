"use client";

import React, { useState, useEffect } from 'react';
import { parseMarkdown } from '@/lib/md/markdown'; // File utility mình đã viết ở trên
import TableOfContents from '@/components/md/TableOfContents';

// MOCK DATA: Giả lập nội dung từ API hoặc CMS
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

  useEffect(() => {
    async function loadContent() {
      // Giả lập delay mạng
      const sanitized = await parseMarkdown(MOCK_MARKDOWN);
      setHtmlContent(sanitized);
      setLoading(false);
    }
    loadContent();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="animate-breathe-slow text-primary font-bold">Đang tải nội dung...</div>
    </div>
  );

  return (

      <div className="max-w-6xl mx-auto py-16 px-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
        
        {/* VÙNG HIỂN THỊ NỘI DUNG */}
        <article className="min-w-0">
          <div 
            className="markdown-body text-foreground/80 leading-relaxed
              [&_h1]:text-4xl [&_h1]:font-black [&_h1]:mb-8 [&_h1]:text-foreground
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-primary [&_h2]:italic
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:text-neon-purple
              [&_p]:mb-4 [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded
              [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:text-slate-100 [&_pre]:mb-6
              [&_hr]:border-border [&_hr]:my-8"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </article>

        {/* MỤC LỤC (STIKY) */}
        <aside className="hidden lg:block">
          <div className="sticky top-10">
            <TableOfContents htmlContent={htmlContent} />
          </div>
        </aside>

      </div>

  );
}
