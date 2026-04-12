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

/* =========================
   CLEAN INLINE CONTENT
========================= */
function cleanInline(inlines: any[]) {
  if (!Array.isArray(inlines)) return [];

  return inlines
    .map((node) => {
      if (!node || typeof node !== "object") return null;

      if (node.type === "text") {
        if (!node.text || !node.text.trim()) return null;
        return { type: "text", text: node.text };
      }

      if (node.type === "link") {
        if (!node.href || !node.text) return null;
        return {
          type: "link",
          text: node.text,
          href: node.href,
        };
      }

      return null;
    })
    .filter(Boolean);
}

/* =========================
   CLEAN BLOCKS
========================= */
function cleanBlocks(blocks: any[]) {
  if (!Array.isArray(blocks)) return [];

  return blocks
    .map((b) => {
      if (!b || typeof b !== "object") return null;

      /* ---------- HEADING ---------- */
      if (b.type === "heading") {
        if (!b.text?.trim()) return null;

        return {
          type: "heading",
          level: b.level ?? 1,
          text: b.text,
        };
      }

      /* ---------- PARAGRAPH ---------- */
      if (b.type === "paragraph") {
        const content = cleanInline(b.content);

        if (content.length === 0) return null;

        return {
          type: "paragraph",
          content,
        };
      }

      /* ---------- LIST ---------- */
      if (b.type === "list") {
        if (!Array.isArray(b.items)) return null;

        const items = b.items
          .map((item: any) => cleanInline(item))
          .filter((i: any) => i.length > 0);

        if (items.length === 0) return null;

        return {
          type: "list",
          items,
        };
      }

      /* ---------- IMAGE ---------- */
      if (b.type === "image") {
        if (!b.src?.trim()) return null;

        return {
          type: "image",
          src: b.src,
          alt: b.alt ?? "",
        };
      }

      /* ---------- IMAGE GROUP ---------- */
      if (b.type === "imageGroup") {
        if (!Array.isArray(b.images) || b.images.length === 0) return null;

        const images = b.images
          .filter((img: any) => img?.src?.trim())
          .map((img: any) => ({
            src: img.src,
            alt: img.alt ?? "",
          }));

        if (images.length === 0) return null;

        return {
          type: "imageGroup",
          images,
        };
      }

      /* ---------- CODE ---------- */
      if (b.type === "code") {
        if (!b.code?.trim()) return null;

        return {
          type: "code",
          code: b.code,
          language: b.language ?? "plaintext",
        };
      }

      return null;
    })
    .filter(Boolean);
}

/* =========================
   CREATE POST
========================= */
export async function createPost(formData: FormData): Promise<void> {
  try {
    const rawTitle = formData.get("title");
    const rawContent = formData.get("content");

    if (!rawTitle || !rawContent) {
      throw new Error("Missing data");
    }

    const parsedJson = JSON.parse(rawContent as string);

    const cleanContent = {
      type: "doc",
      blocks: cleanBlocks(parsedJson.blocks),
    };

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
       REVALIDATE - Xoá cache -> update
    ========================= */
    revalidatePath("/baivietapp");
    revalidatePath(`/baivietapp/${slug}`);
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    throw new Error("Create post failed");
  }
}