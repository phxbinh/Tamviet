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

export async function createPost(formData: FormData): Promise<void> {
  try {
    /* =========================
       GET DATA
    ========================= */
    const rawTitle = formData.get("title");
    const rawContent = formData.get("content");

    if (!rawTitle || !rawContent) {
      throw new Error("Missing data");
    }

    /* =========================
       PARSE JSON
    ========================= */
    const parsedContent = JSON.parse(rawContent as string);

    /* =========================
       CLEAN BLOCKS (QUAN TRỌNG)
    ========================= */
    const cleanBlocks = parsedContent.blocks.filter((b: any) => {
      if (b.type === "heading" || b.type === "paragraph") {
        return b.text?.trim().length > 0;
      }
      if (b.type === "list") {
        return b.items?.some((i: string) => i.trim().length > 0);
      }
      if (b.type === "image") {
        return b.src?.trim().length > 0;
      }
      return true;
    });

    const cleanContent = {
      type: "doc",
      blocks: cleanBlocks,
    };

    /* =========================
       VALIDATE
    ========================= */
    const parsed = CreatePostSchema.parse({
      title: String(rawTitle).trim(),
      content: cleanContent,
    });

    /* =========================
       SLUG
    ========================= */
    const baseSlug = parsed.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await sql`
        SELECT 1 FROM posts WHERE slug = ${slug} LIMIT 1
      `;
      if (existing.length === 0) break;
      slug = `${baseSlug}-${counter++}`;
    }

    /* =========================
       INSERT
    ========================= */
    await sql`
      INSERT INTO posts (title, slug, content_json)
      VALUES (${parsed.title}, ${slug}, ${JSON.stringify(parsed.content)})
    `;

    /* =========================
       REVALIDATE
    ========================= */
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
  } catch (err) {
    console.error("CREATE POST ERROR:", err);

    // ❗ tránh crash 500 → trả lỗi nhẹ
    throw new Error("Create post failed");
  }
}