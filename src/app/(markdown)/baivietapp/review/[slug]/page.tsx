import { sql } from "@/lib/neon/sql";
import { Renderer } from "../../_src/Renderer";
import { Document } from "../../_src/blocks";
import { notFound } from "next/navigation";

type PostRow = {
  id: string;
  title: string;
  content_json: Document;
};


export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await sql`
    SELECT * FROM posts WHERE slug = ${slug}
  `;

  if (!post) return notFound();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

      <Renderer content={post.content_json} />
    </div>
  );
}