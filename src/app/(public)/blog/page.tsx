// src/app/blog/page.tsx
import { sql } from "@/lib/neon/sql";
import Link from "next/link";

export default async function BlogListPage() {
  const posts = await sql`
    SELECT id, title, slug, created_at
    FROM posts
    ORDER BY created_at DESC
  `;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Blog</h1>

      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          className="block border p-4 rounded hover:bg-gray-100"
        >
          <h2 className="text-lg font-semibold">{post.title}</h2>
        </Link>
      ))}
    </div>
  );
}