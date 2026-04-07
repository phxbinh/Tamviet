"use server";

import { z } from "zod";
import { DocumentSchema } from "./blocks";
import { sql } from "@/lib/neon/sql";

const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: DocumentSchema,
});

export async function createPost(data: unknown) {
  const parsed = CreatePostSchema.parse(data);

  const slug = parsed.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  await sql`
    INSERT INTO posts (title, slug, content_json)
    VALUES (${parsed.title}, ${slug}, ${JSON.stringify(parsed.content)})
  `;
}