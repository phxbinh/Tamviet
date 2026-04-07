
// src/lib/actions.ts
"use server";

import { z } from "zod";
import { DocumentSchema, Document } from "./blocks";
import { sql } from "@/lib/neon/sql";
import { revalidatePath } from "next/cache";

const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: DocumentSchema,
});

export async function createPost(data: unknown) {
  const parsed = CreatePostSchema.parse(data);

  // slug
  const baseSlug = parsed.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const exist = await sql`
      SELECT 1 FROM posts WHERE slug = ${slug} LIMIT 1
    `;
    if (exist.length === 0) break;
    slug = `${baseSlug}-${counter++}`;
  }

  const result = await sql`
    INSERT INTO posts (title, slug, content_json)
    VALUES (${parsed.title}, ${slug}, ${JSON.stringify(parsed.content)})
    RETURNING *
  `;

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);

  return result[0];
}