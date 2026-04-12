import { z } from "zod";

/* =========================
   INLINE NODES
========================= */
const InlineSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    text: z.string().default(""), // Cho phép string rỗng
  }),
  z.object({
    type: z.literal("link"),
    text: z.string().default(""),
    // Dùng .catch() hoặc .optional() để tránh chết app nếu URL cũ bị sai định dạng
    href: z.string().default("#"), 
  }),
]);

/* =========================
   BLOCKS
========================= */
export const BlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("heading"),
    level: z.number().min(1).max(6).default(2),
    text: z.string().default(""),
  }),

  z.object({
    type: z.literal("paragraph"),
    // Bỏ .min(1) đi, để mặc định là mảng rỗng nếu không có gì
    content: z.array(InlineSchema).default([]), 
  }),

  z.object({
    type: z.literal("image"),
    // Sử dụng .catch để nếu URL ảnh lỗi nó vẫn không làm sập trang
    src: z.string().default(""),
    alt: z.string().optional().default(""),
  }),

  z.object({
    type: z.literal("code"),
    code: z.string().default(""),
    language: z.string().optional().default("javascript"),
  }),

  z.object({
    type: z.literal("list"),
    // Bỏ .min(1) để an toàn cho dữ liệu cũ
    items: z.array(z.array(InlineSchema)).default([]),
  }),
]);

export const DocumentSchema = z.object({
  type: z.literal("doc"),
  blocks: z.array(BlockSchema).default([]),
});

export type Block = z.infer<typeof BlockSchema>;
export type Document = z.infer<typeof DocumentSchema>;
