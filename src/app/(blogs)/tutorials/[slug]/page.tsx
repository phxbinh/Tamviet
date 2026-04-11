import { sql } from "@/lib/neon/sql";
import RendererTOC from "@/components/editor/RendererTOC";

export default async function BlogPost({ params }) {
  const post = await sql`
    SELECT * FROM posts WHERE slug = ${params.slug}
  `;

  const data = post[0];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>

      <RendererTOC content={data.content_json} />
    </div>
  );
}