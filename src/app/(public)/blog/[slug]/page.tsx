
// src/app/blog/[slug]/page.tsx
import { sql } from "@/lib/neon/sql";
import { Renderer } from "./Renderer";
import { parseContent } from "./parseContent";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await sql`
    SELECT * FROM posts WHERE slug = ${slug}
  `;

  if (!post[0]) {
    return <div className="p-6">Not found</div>;
  }

  const content = parseContent(post[0].content_json);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {post[0].title}
      </h1>

      <Renderer content={content} />
    </div>
  );
}