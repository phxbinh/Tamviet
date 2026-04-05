import Link from "next/link";
import { getPostsAction } from "./actions"; // Hàm lấy danh sách bài viết

export const metadata = {
  title: "Blog | Tâm Việt Platform",
  description: "Chia sẻ kiến thức về Kỹ thuật môi trường, Trading và Triết học Stoic.",
};

export default async function BlogListingPage() {
  const result = await getPostsAction(20); // Lấy 20 bài mới nhất

  if (!result.success) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang cập nhật nội dung...
      </div>
    );
  }

  const posts = result.data || [];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header trang Blog */}
        <header className="mb-20">
          <h1 className="text-6xl font-serif italic mb-6">Tâm Việt Insights</h1>
          <p className="text-gray-400 max-w-lg leading-relaxed">
            Nơi lưu trữ những nghiên cứu kỹ thuật, nhật ký giao dịch và tư duy kỷ luật.
          </p>
        </header>

        {/* Danh sách bài viết */}
        <div className="space-y-16">
          {posts.map((post) => (
            <article key={post.id} className="group relative">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                  <div className="space-y-3">
                    {/* Danh mục & Ngày tháng */}
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gray-500">
                      <span className="text-white/80">{post.categoryName || "Chưa phân loại"}</span>
                      <span>•</span>
                      <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                    </div>

                    {/* Tiêu đề bài viết */}
                    <h2 className="text-3xl font-medium group-hover:text-gray-400 transition-colors duration-500">
                      {post.title}
                    </h2>
                  </div>

                  {/* Nút xem thêm tinh tế */}
                  <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
                    <span className="text-sm font-serif italic text-gray-400">Read post →</span>
                  </div>
                </div>
              </Link>
              
              {/* Đường kẻ ngăn cách mờ ảo style Glassmorphism */}
              <div className="mt-12 h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent" />
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-gray-600 py-20 font-serif italic">
            Chưa có bài viết nào được xuất bản.
          </p>
        )}
      </div>
    </main>
  );
}
