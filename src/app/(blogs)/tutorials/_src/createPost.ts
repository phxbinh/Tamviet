"use server";

import { z } from "zod";
import { DocumentSchema, Document } from "./blocks";
import { sql } from "@/lib/neon/sql";
import { revalidatePath } from "next/cache";

/* =========================
   TYPES
========================= */
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

/* =========================
   INLINE HELPERS
========================= */

/**
 * Check inline có text thực sự không
 */
function hasInlineContent(nodes: any[]): boolean {
  return nodes?.some((n) => {
    if (n.type === "text") {
      return n.text?.trim().length > 0;
    }

    if (n.type === "link") {
      return hasInlineContent(n.children);
    }

    return false;
  });
}

/**
 * Clean inline (xoá node rỗng)
 */
function cleanInline(nodes: any[]): any[] {
  return nodes
    .map((n) => {
      if (n.type === "text") {
        if (!n.text || !n.text.trim()) return null;
        return n;
      }

      if (n.type === "link") {
        const children = cleanInline(n.children);
        if (!children.length) return null;

        return {
          ...n,
          children,
        };
      }

      return null;
    })
    .filter(Boolean);
}

/* =========================
   BLOCK CLEANING
========================= */
function normalizeBlocks(blocks: any[]): any[] {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading":
        case "paragraph": {
          const content = cleanInline(b.content || []);
          if (!content.length) return null;

          return {
            ...b,
            content,
          };
        }

        case "list": {
          const items = (b.items || [])
            .map((item: any[]) => cleanInline(item))
            .filter((item: any[]) => item.length > 0);

          if (!items.length) return null;

          return {
            ...b,
            items,
          };
        }

        case "image": {
          if (!b.src || !b.src.trim()) return null;

          return b;
        }

        case "code": {
          if (!b.code || !b.code.trim()) return null;

          return b;
        }

        default:
          return null;
      }
    })
    .filter(Boolean);
}

/* =========================
   SLUG GENERATOR
========================= */
async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = title
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

  return slug;
}

/* =========================
   MAIN ACTION
========================= */
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
       PARSE JSON SAFE
    ========================= */
    let parsedContent: any;

    try {
      parsedContent = JSON.parse(rawContent as string);
    } catch {
      throw new Error("Invalid content JSON");
    }

    if (!parsedContent?.blocks || !Array.isArray(parsedContent.blocks)) {
      throw new Error("Invalid content structure");
    }

    /* =========================
       CLEAN BLOCKS
    ========================= */
    const normalizedBlocks = normalizeBlocks(parsedContent.blocks);

    const cleanContent = {
      type: "doc",
      blocks: normalizedBlocks,
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
    const slug = await generateUniqueSlug(parsed.title);

    /* =========================
       INSERT
    ========================= */
    await sql`
      INSERT INTO posts (title, slug, content_json)
      VALUES (
        ${parsed.title},
        ${slug},
        ${JSON.stringify(parsed.content)}
      )
    `;

    /* =========================
       REVALIDATE
    ========================= */
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    throw new Error("Create post failed");
  }
}