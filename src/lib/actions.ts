// lib/actions.ts
"use server";

import { z } from "zod";
import { DocumentSchema } from "./blocks";
import { sql } from "@/lib/neon/sql";

const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: DocumentSchema,
});

type CreatePostInput = z.infer<typeof CreatePostSchema>;

export async function createPost(data: unknown) {
  const parsed: CreatePostInput = CreatePostSchema.parse(data);

  await sql`
    INSERT INTO posts (title, content_json)
    VALUES (${parsed.title}, ${JSON.stringify(parsed.content)})
  `;
}