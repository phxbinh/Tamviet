// baivietapp/_src/blocks.ts
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
    src: z.string().refine(
      (val) => val.startsWith("/") || val.startsWith("http"),
      "Invalid image src"
    ),
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