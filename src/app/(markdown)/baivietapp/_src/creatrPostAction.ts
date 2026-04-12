"use server";

import { z } from "zod";
import { DocumentSchema } from "./blocks";
import { sql } from "@/lib/neon/sql";
import { revalidatePath } from "next/cache";

/**
 * =========================
 * Input schema (form)
 * =========================
 */
const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

/**
 * =========================
 * Helper: slugify
 * =========================
 */
function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

/**
 * =========================
 * Ensure unique slug
 * =========================
 */
async function generateUniqueSlug(base: string) {
  let slug = base;
  let i = 1;

  while (true) {
    const existing = await sql`
      SELECT 1 FROM posts WHERE slug = ${slug} LIMIT 1
    `;

    if (existing.length === 0) return slug;

    slug = `${base}-${i++}`;
  }
}

/**
 * =========================
 * MAIN ACTION
 * =========================
 */
export async function createPostAction(formData: FormData) {
  try {
    /**
     * 1. Parse raw form
     */
    const raw = {
      title: formData.get("title"),
      content: formData.get("content"),
    };

    const parsed = FormSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.flatten(),
      };
    }

    const { title, content } = parsed.data;

    /**
     * 2. Parse JSON content
     */
    let json: unknown;

    try {
      json = JSON.parse(content);
    } catch {
      return {
        success: false,
        error: "INVALID_JSON",
      };
    }

    /**
     * 3. Validate Document schema
     */
    const doc = DocumentSchema.safeParse(json);

    if (!doc.success) {
      return {
        success: false,
        error: "INVALID_DOCUMENT",
      };
    }

    /**
     * 4. Slug
     */
    const baseSlug = slugify(title);
    const slug = await generateUniqueSlug(baseSlug);

    /**
     * 5. Insert DB
     */
    const result = await sql`
      INSERT INTO posts (title, slug, content_json)
      VALUES (${title}, ${slug}, ${JSON.stringify(doc.data)})
      RETURNING id
    `;

    /**
     * 6. Revalidate
     */
    revalidatePath("/blogs");

    return {
      success: true,
      id: result[0].id,
      slug,
    };
  } catch (err) {
    console.error("createPostAction error:", err);

    return {
      success: false,
      error: "SERVER_ERROR",
    };
  }
}