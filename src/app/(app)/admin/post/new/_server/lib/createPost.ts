"use server";

import { DocumentSchema } from "../../_server/lib/blocks";
import { sql } from "@/lib/neon/sql";

export async function createPost(data: any) {
  const parsed = DocumentSchema.parse(data.content);

  await sql`
    INSERT INTO posts (title, content_json)
    VALUES (${data.title}, ${JSON.stringify(parsed)})
  `;
}