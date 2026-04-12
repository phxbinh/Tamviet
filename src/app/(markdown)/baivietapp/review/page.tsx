import { sql } from "@/lib/neon/sql";
import Link from "next/link";

type PostItem = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
};

export default async function Page() {
  const { rows } = await sql`
    SELECT id, title, slug, created_at
    FROM posts
    ORDER BY created_at DESC
  `;

  const posts = rows as PostItem[];

  return (
    <div>
      {posts.map((post) => (
        <Link key={post.id} href={`/baiviet/${post.slug}`}>
          {post.title}
        </Link>
      ))}
    </div>
  );
}