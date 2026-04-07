// lib/blocks.ts
import { z } from "zod";

export const BlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("heading"),
    level: z.number().min(1).max(6),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal("paragraph"),
    text: z.string().min(1),
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
    items: z.array(z.string()),
  }),
]);

export const DocumentSchema = z.object({
  type: z.literal("doc"),
  blocks: z.array(BlockSchema),
});

export type Block = z.infer<typeof BlockSchema>;
export type Document = z.infer<typeof DocumentSchema>;