// src/app/blog/page.tsx
// app/blog/page.tsx
/*
import { sql } from "@/lib/neon/sql";
import Link from "next/link";

export default async function Page() {
  const posts = await sql`SELECT * FROM posts`;

  return (
    <div>
      {posts.map((p) => (
        <Link key={p.id} href={`/blog/${p.slug}`}>
          {p.title}
        </Link>
      ))}
    </div>
  );
}
*/


// app/blog/page.tsx
/*
import { sql } from "@/lib/neon/sql";
import Link from "next/link";

export default async function Page() {
  const posts = await sql`SELECT * FROM posts ORDER BY created_at DESC`;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>

      {posts.map((p) => (
        <Link key={p.id} prefetch={true} href={`/blog/${p.slug}`}>
          <div className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer bg-white">
            
            <h2 className="text-xl font-semibold text-gray-900">
              {p.title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {new Date(p.created_at).toLocaleDateString()}
            </p>

            <p className="text-gray-600 mt-2 line-clamp-2">
              Click để đọc bài viết →
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
*/


import { sql } from "@/lib/neon/sql";
import Link from "next/link";

export default async function Page() {
  const posts = await sql`SELECT * FROM posts ORDER BY created_at DESC`;

  if (!posts || posts.length === 0) {
    return <div className="text-center p-20 text-gray-500">Chưa có bài viết nào.</div>;
  }

  const [featuredPost, ...otherPosts] = posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background text-foreground transition-colors duration-300">
      {/* Header trang báo */}
      <header className="border-b-2 border-foreground mb-10 pb-4 text-center">
        <h1 className="text-5xl md:text-7xl font-serif font-black uppercase tracking-tighter italic">
          The Stoic News
        </h1>
        <div className="flex justify-between items-center mt-4 border-t border-gray-200 py-2 text-xs uppercase tracking-widest font-medium">
          <span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="hidden md:block text-primary">Tâm Việt • Kỹ Thuật • Stoicism</span>
          <span>Hồ Chí Minh, VN</span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* CỘT CHÍNH: BÀI VIẾT TIÊU ĐIỂM (Chiếm 3/4 cột trên Desktop) */}
        <section className="lg:col-span-3 space-y-12">
          {/* Featured Post */}
          <article className="group cursor-pointer">
            <Link href={`/blog/${featuredPost.slug}`} prefetch={true} className="space-y-4">
              <div className="overflow-hidden bg-card border border-border rounded-sm aspect-video mb-4 group-hover:shadow-xl transition-all duration-500">
                {/* Thay bằng thẻ <img> nếu bạn có p.image_url */}
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 font-serif text-4xl animate-breathe-slow">
                  Featured Article
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-zinc-400 line-clamp-3 leading-relaxed font-serif">
                  {/* Nếu bạn có trường summary trong DB, hãy dùng nó ở đây */}
                  Khám phá những góc nhìn sâu sắc về kỹ thuật hệ thống và triết lý Stoic trong phát triển phần mềm hiện đại...
                </p>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                  <span>Bởi Lê Nguyễn</span>
                  <span>•</span>
                  <span>{new Date(featuredPost.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          </article>

          <hr className="border-border" />

          {/* Grid bài viết phụ bên dưới */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherPosts.map((p) => (
              <article key={p.id} className="group border-b border-border pb-8 md:border-b-0 md:pb-0">
                <Link href={`/blog/${p.slug}`} prefetch={true} className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold font-serif group-hover:text-primary transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-2">
                    Click để đọc chi tiết bài viết và khám phá các phân tích chuyên sâu.
                  </p>
                  <span className="text-[10px] uppercase font-bold tracking-tighter text-zinc-500">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* SIDEBAR: DANH SÁCH TIN NHANH (Chiếm 1/4 cột) */}
        <aside className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-border lg:pl-8 pt-10 lg:pt-0">
          <h4 className="text-sm font-black uppercase tracking-widest border-b border-foreground mb-6 pb-2">
            Đáng chú ý
          </h4>
          <div className="divide-y divide-border">
            {posts.slice(0, 5).map((p, idx) => (
              <div key={idx} className="py-4 first:pt-0 group cursor-pointer">
                <Link prefetch={true} href={`/blog/${p.slug}`}>
                  <span className="text-primary font-bold text-xs uppercase tracking-widest">#{idx + 1}</span>
                  <h5 className="font-serif font-bold text-base mt-1 group-hover:underline decoration-primary underline-offset-4">
                    {p.title}
                  </h5>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Box trang trí đậm chất báo chí */}
          <div className="mt-10 p-4 bg-zinc-100 dark:bg-zinc-900 border-l-4 border-primary">
            <p className="text-sm italic font-serif text-zinc-600 dark:text-zinc-400">
              "Trở ngại chính là con đường - Hãy vận dụng Stoicism vào từng dòng code của bạn."
            </p>
          </div>
        </aside>

      </main>
    </div>
  );
}








