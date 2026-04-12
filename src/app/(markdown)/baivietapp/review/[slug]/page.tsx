import { sql } from "@/lib/neon/sql";
import { Renderer } from "@/components/editor/Renderer";
import { Document } from "@/lib/blocks";
import { notFound } from "next/navigation";

type PostRow = {
  id: string;
  title: string;
  content_json: Document;
};

export default async function Page({ params }: { params: { slug: string } }) {
  const rows = await sql<PostRow[]>`
    SELECT id, title, content_json
    FROM posts
    WHERE slug = ${params.slug}
    LIMIT 1
  `;

  const post = rows[0];

  if (!post) return notFound();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

      <Renderer content={post.content_json} />
    </div>
  );
}