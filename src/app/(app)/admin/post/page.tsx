// app/admin/posts/page.tsx
import { sql } from "@/lib/db";
import Link from "next/link";

export default async function AdminPostsPage() {
  const posts = await sql`
    SELECT id, title, slug
    FROM posts
    ORDER BY created_at DESC
  `;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Quản lý bài viết</h1>

      <Link
        href="/admin/posts/new"
        className="inline-block bg-green-500 text-white px-4 py-2 rounded"
      >
        + Tạo bài
      </Link>

      {posts.map((post) => (
        <div
          key={post.id}
          className="border p-3 rounded flex justify-between"
        >
          <span>{post.title}</span>

          <Link
            href={`/blog/${post.slug}`}
            className="text-blue-500"
          >
            Xem
          </Link>
        </div>
      ))}
    </div>
  );
}