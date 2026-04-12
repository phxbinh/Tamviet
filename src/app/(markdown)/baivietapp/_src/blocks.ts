// baivietapp/_src/blocks.ts
// lib/blocks.ts
import { z } from "zod";

export const TextSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  href: z.string().url().optional(),
});

export const BlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("heading"),
    level: z.number().min(1).max(6),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal("paragraph"),
    content: z.array(TextSchema),
  }),
  z.object({
    type: z.literal("image"),
    src: z.string(),
    alt: z.string().optional(),
  }),
  z.object({
    type: z.literal("code"),
    code: z.string(),
    language: z.string().optional(),
  }),
  z.object({
    type: z.literal("list"),
    items: z.array(z.array(TextSchema)),
  }),
]);

export const DocumentSchema = z.object({
  type: z.literal("doc"),
  blocks: z.array(BlockSchema),
});

/**
 * 🔥 QUAN TRỌNG: export type
 */
export type Block = z.infer<typeof BlockSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type TextNode = z.infer<typeof TextSchema> // 👉 TYPE (compile-time)




