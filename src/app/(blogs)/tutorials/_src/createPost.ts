"use server";

import { sql } from "@/lib/neon/sql";
import { revalidatePath } from "next/cache";
import { DocumentSchema } from "./blocks";

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function createPost(data: {
  title: string;
  content: unknown;
}) {
  const parsed = DocumentSchema.parse(data.content);

  let slug = slugify(data.title);
  let i = 1;

  while (true) {
    const exists = await sql`
      SELECT 1 FROM posts WHERE slug = ${slug} LIMIT 1
    `;
    if (!exists.length) break;
    slug = `${slugify(data.title)}-${i++}`;
  }

  await sql`
    INSERT INTO posts (title, slug, content_json)
    VALUES (
      ${data.title},
      ${slug},
      ${JSON.stringify(parsed)}
    )
  `;

  revalidatePath("/tutorials");
  revalidatePath(`/tutorials/${slug}`);
}