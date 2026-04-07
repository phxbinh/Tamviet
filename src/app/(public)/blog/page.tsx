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
            
            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900">
              {p.title}
            </h2>

            {/* Meta */}
            <p className="text-sm text-gray-500 mt-1">
              {new Date(p.created_at).toLocaleDateString()}
            </p>

            {/* Preview (optional) */}
            <p className="text-gray-600 mt-2 line-clamp-2">
              Click để đọc bài viết →
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}