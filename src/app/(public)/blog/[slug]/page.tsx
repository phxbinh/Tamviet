// src/app/blog/[slug]/page.tsx
// app/blog/[slug]/page.tsx
/*
import { sql } from "@/lib/neon/sql";
import { Renderer } from "@/components/editor/Renderer";
import { parseContent } from "@/lib/parseContent";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await sql`
    SELECT * FROM posts WHERE slug = ${slug}
  `;

  if (!post[0]) return <div>Not found</div>;

  const content = parseContent(post[0].content_json);

  return <Renderer content={content} />;
}
*/


/*
import { sql } from "@/lib/neon/sql";
import { Renderer } from "@/components/editor/Renderer";
import { parseContent } from "@/lib/parseContent";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await sql`
    SELECT * FROM posts WHERE slug = ${slug}
  `;

  if (!post[0]) return <div className="p-6">Not found</div>;

  const content = parseContent(post[0].content_json);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-8 leading-tight">
        {post[0].title}
      </h1>

      <Renderer content={content} />
    </div>
  );
}
*/

import { sql } from "@/lib/neon/sql";
import { Renderer } from "@/components/editor/Renderer";
import { parseContent } from "@/lib/parseContent";
import { CalendarDays } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await sql`
    SELECT * FROM posts WHERE slug = ${slug}
  `;

  if (!post[0]) return <div className="p-6">Not found</div>;

  const content = parseContent(post[0].content_json);

  const formattedDate = new Date(post[0].created_at).toLocaleDateString(
    "vi-VN",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* TITLE */}
      <h1 className="text-4xl font-bold leading-tight">
        {post[0].title}
      </h1>

      {/* META */}
      <div className="flex items-center gap-2 text-gray-500 mt-3 mb-8 text-sm">
        <CalendarDays className="w-4 h-4" />
        <span>{formattedDate}</span>
      </div>

      {/* CONTENT */}
      <Renderer content={content} />
    </div>
  );
}



