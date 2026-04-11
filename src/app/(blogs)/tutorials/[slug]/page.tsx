import { sql } from "@/lib/neon/sql";
import { Renderer } from "@/components/editor/RendererTOC";

/*
export default async function BlogPost({ params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await sql`
    SELECT * FROM posts WHERE slug = ${slug}
  `;

  const data = post[0];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>

      <Renderer content={data.content_json} />
    </div>
  );
}
*/

export default async function BlogPost() {

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Test tutorials </h1>
    </div>
  );
}




