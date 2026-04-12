import { sql } from "@/lib/neon/sql";
import Link from "next/link";

type PostItem = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
};

export default async function Page() {
  const posts = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
  
  return (
    <div>
      {posts.map((post) => (
        <Link key={post.id} href={`/baivietapp/review/${post.slug}`}>
          {post.title}
        </Link>
      ))}
    </div>
  );
}