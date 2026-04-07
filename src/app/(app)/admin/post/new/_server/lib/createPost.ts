"use server";

import { z } from "zod";
import { DocumentSchema } from "./blocks";
import { sql } from "@/lib/neon/sql";
import { revalidatePath } from "next/cache";

/* =========================
   TYPES
========================= */

type PostRow = {
  id: string;
  title: string;
  slug: string;
  content_json: any;
  created_at: Date;
};

// Schema để validate dữ liệu đầu vào
const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: DocumentSchema,
});

/* =========================
   CREATE POST ACTION
========================= */

export async function createPost(data: unknown): Promise<PostRow> {
  // 1. Validate dữ liệu
  const parsed = CreatePostSchema.parse(data);

  // 2. Logic tạo slug
  const slug = parsed.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  // 3. Thực thi SQL với Type Casting giống style của bạn
  const newPost = (await sql`
    INSERT INTO posts (title, slug, content_json)
    VALUES (
      ${parsed.title}, 
      ${slug}, 
      ${JSON.stringify(parsed.content)}
    )
    RETURNING *
  `) as PostRow[];

  // 4. Làm mới cache nếu cần
  revalidatePath("/blog");

  return newPost[0];
}
