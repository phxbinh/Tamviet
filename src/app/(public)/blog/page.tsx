import { getPostBySlugAction } from "./actions";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const result = await getPostBySlugAction(slug);

  if (!result.success || !result.data) {
    notFound(); // Trả về trang 404 nếu không thấy bài
  }

  const post = result.data;

  return (
    <article className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header bài viết */}
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-5xl font-serif italic mb-4">{post.title}</h1>
          <div className="flex gap-4 text-sm text-gray-500 font-mono uppercase tracking-widest">
            <span>{post.postType}</span>
            <span>•</span>
            <span>{new Date(post.publishedAt!).toLocaleDateString('vi-VN')}</span>
          </div>
        </header>

        {/* Nội dung Markdown chuyên nghiệp */}
        <div className="prose prose-invert prose-technical max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
