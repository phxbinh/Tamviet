// app/blog/[slug]/page.tsx
import { sql } from "@/lib/neon/sql";
import { Renderer } from "./Renderer";

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await sql`
    SELECT * FROM posts WHERE slug = ${params.slug}
  `;

  if (!post[0]) {
    return <div className="p-6">Not found</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {post[0].title}
      </h1>

      <Renderer content={post[0].content_json} />
    </div>
  );
}