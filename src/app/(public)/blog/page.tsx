// src/app/blog/page.tsx
// app/blog/page.tsx
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