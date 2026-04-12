import { z } from "zod";

/* =========================
   INLINE NODES
========================= */
const InlineSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("link"),
    text: z.string(),
    href: z.string().url(),
  }),
]);

/* =========================
   BLOCKS
========================= */
export const BlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("heading"),
    level: z.number().min(1).max(6),
    text: z.string().min(1),
  }),

  z.object({
    type: z.literal("paragraph"),
    // FIX: Phải là array của InlineSchema
    content: z.array(InlineSchema).min(1), 
  }),

  z.object({
    type: z.literal("image"),
    src: z.string().url(),
    alt: z.string().optional(),
  }),

  z.object({
    type: z.literal("code"),
    code: z.string(),
    language: z.string().optional(),
  }),

  z.object({
    type: z.literal("list"),
    // FIX: Items phải là mảng của mảng InlineSchema
    items: z.array(z.array(InlineSchema)).min(1),
  }),
]);

export const DocumentSchema = z.object({
  type: z.literal("doc"),
  blocks: z.array(BlockSchema),
});

export type Block = z.infer<typeof BlockSchema>;
export type Document = z.infer<typeof DocumentSchema>;
