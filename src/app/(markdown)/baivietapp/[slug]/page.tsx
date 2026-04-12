// src/app/(markdown)/baiviet/[slug]/page.tsx
/*
import { sql } from "@/lib/neon/sql";
import { Renderer } from "@/lib/postLib/Renderer";
import { parseContent } from "@/lib/postLib/parseContent";
import { CalendarDays } from "lucide-react";
*/
// src/app/(markdown)/baiviet/[slug]/page.tsx
import { sql } from "@/lib/neon/sql";
import { Renderer } from "@/lib/postLib/Renderer";
import { parseContent } from "@/lib/postLib/parseContent";
import { CalendarDays } from "lucide-react";
import { notFound } from "next/navigation"; // Dùng hàm chuẩn của Next.js

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Lấy data từ DB
  const posts = await sql`
    SELECT title, content_json, created_at FROM posts WHERE slug = ${slug} LIMIT 1
  `;

  const post = posts[0];
  if (!post) return notFound(); // Trả về trang 404 chuẩn của Next.js

  // 2. Parse và chuẩn hóa dữ liệu (Migration nằm trong hàm này)
  const content = parseContent(post.content_json);

  const formattedDate = new Date(post.created_at).toLocaleDateString(
    "vi-VN",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold leading-tight text-slate-900">
          {post.title}
        </h1>

        <div className="flex items-center gap-2 text-slate-500 mt-4 text-sm font-medium">
          <CalendarDays className="w-4 h-4" />
          <time dateTime={post.created_at.toISOString()}>{formattedDate}</time>
        </div>
      </header>

      {/* RENDERER */}
      <Renderer content={content} />
      
      {/* Chỉ hiện debug trong môi trường dev nếu cần */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-20 opacity-30">
          <summary className="cursor-pointer text-xs">Debug Content JSON</summary>
          <pre className="text-[10px] bg-slate-100 p-4 rounded overflow-auto mt-2">
            {JSON.stringify(content, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
