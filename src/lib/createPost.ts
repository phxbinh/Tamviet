"use server";

import { z } from "zod";
import { DocumentSchema, Document } from "./blocks";
import { sql } from "@/lib/neon/sql";
import { revalidatePath } from "next/cache";

type PostRow = {
  id: string;
  title: string;
  slug: string;
  content_json: Document;
  created_at: Date;
};

const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: DocumentSchema,
});

export async function createPost(formData: FormData): Promise<PostRow> {
  const title = formData.get("title");
  const content = formData.get("content");

  const parsed = CreatePostSchema.parse({
    title,
    content: JSON.parse(content as string),
  });

  // slug base
  const baseSlug = parsed.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  // unique slug
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await sql`
      SELECT 1 FROM posts WHERE slug = ${slug} LIMIT 1
    `;
    if (existing.length === 0) break;
    slug = `${baseSlug}-${counter++}`;
  }

  const newPost = (await sql`
    INSERT INTO posts (title, slug, content_json)
    VALUES (${parsed.title}, ${slug}, ${JSON.stringify(parsed.content)})
    RETURNING *
  `) as PostRow[];

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);

  return newPost[0];
}