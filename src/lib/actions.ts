"use server";

import { z } from "zod";
import { DocumentSchema } from "./blocks";
import { sql } from "@/lib/neon/sql";
import { revalidatePath } from "next/cache";

const Schema = z.object({
  title: z.string(),
  content: DocumentSchema,
});

export async function createPost(data: unknown) {
  const parsed = Schema.parse(data);

  const slug = parsed.title
    .toLowerCase()
    .replace(/\s+/g, "-");

  await sql`
    INSERT INTO posts (title, slug, content_json)
    VALUES (${parsed.title}, ${slug}, ${JSON.stringify(parsed.content)})
  `;

  revalidatePath("/blog");
}