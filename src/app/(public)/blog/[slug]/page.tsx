// src/app/(public)/blog/[slug]/page.tsx

import { getPostBySlugAction } from "../actions";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";

// 1. Định nghĩa Type chuẩn cho Next.js 15
interface PageProps {
  params: Promise<{ slug: string }>;
}

// 2. Sử dụng async function cho Server Component
export default async function BlogPostPage({ params }: PageProps) {
  
  // 3. BẮT BUỘC: await params trước khi sử dụng
  const { slug } = await params;

  const result = await getPostBySlugAction(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;

  return (
    <article className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-5xl font-serif italic mb-4">{post.title}</h1>
          <div className="flex gap-4 text-sm text-gray-500 font-mono uppercase tracking-widest">
            <span>{post.postType}</span>
            <span>•</span>
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
          </div>
        </header>

        <div className="prose prose-invert prose-technical max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
