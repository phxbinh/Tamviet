"use server";

import { z } from "zod";
import { DocumentSchema } from "./blocks";
import { sql } from "@/lib/neon/sql";
import { revalidatePath } from "next/cache";

/**
 * =========================
 * STATE TYPE (cho UI)
 * =========================
 */
export type CreatePostState =
  | { success: true; id: string; slug: string }
  | { success: false; error: string };

/**
 * =========================
 * FORM VALIDATION
 * =========================
 */
const FormSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

/**
 * =========================
 * HELPERS
 * =========================
 */
function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

async function generateUniqueSlug(base: string) {
  let slug = base;
  let i = 1;

  while (true) {
    const exists = await sql`
      SELECT 1 FROM posts WHERE slug = ${slug} LIMIT 1
    `;

    if (exists.length === 0) return slug;

    slug = `${base}-${i++}`;
  }
}

/**
 * =========================
 * MAIN ACTION (CHUẨN)
 * =========================
 */
export async function createPostAction(
  prevState: CreatePostState | null,
  formData: FormData
): Promise<CreatePostState> {
  try {
    /**
     * 1. Validate form
     */
    const parsed = FormSchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
    });

    if (!parsed.success) {
      return {
        success: false,
        error: "INVALID_FORM",
      };
    }

    const { title, content } = parsed.data;

    /**
     * 2. Parse JSON
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
     * 3. Validate document schema
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
    revalidatePath("/baivietapp/review");
    revalidatePath("/baivietapp/review/[slug]");

    return {
      success: true,
      id: result[0].id,
      slug,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: "SERVER_ERROR",
    };
  }
}