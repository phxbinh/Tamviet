// lib/blocks.ts
import { z } from "zod";

/**
 * =========================
 * INLINE (rich text)
 * =========================
 */
export const InlineSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    text: z.string(),
    bold: z.boolean().optional(),
    italic: z.boolean().optional(),
    underline: z.boolean().optional(),
    code: z.boolean().optional(),
  }),

  z.object({
    type: z.literal("link"),
    href: z.string().url(),
    children: z.array(
      z.object({
        type: z.literal("text"),
        text: z.string(),
        bold: z.boolean().optional(),
        italic: z.boolean().optional(),
        underline: z.boolean().optional(),
        code: z.boolean().optional(),
      })
    ),
  }),
]);

export type InlineNode = z.infer<typeof InlineSchema>;

/**
 * =========================
 * BLOCKS
 * =========================
 */
export const BlockSchema = z.discriminatedUnion("type", [
  /**
   * Heading
   */
  z.object({
    type: z.literal("heading"),
    level: z.number().min(1).max(6),
    content: z.array(InlineSchema).min(1),
  }),

  /**
   * Paragraph
   */
  z.object({
    type: z.literal("paragraph"),
    content: z.array(InlineSchema).min(1),
  }),

  /**
   * Image
   */
  z.object({
    type: z.literal("image"),
    src: z.string().refine(
      (val) => val.startsWith("/") || val.startsWith("http"),
      "Invalid image src"
    ),

    alt: z.string().min(5), // bắt buộc (SEO)

    caption: z.array(InlineSchema).optional(),
    title: z.string().optional(),

    width: z.number().optional(),
    height: z.number().optional(),

    blurDataURL: z.string().optional(),
  }),

  /**
   * Code block
   */
  z.object({
    type: z.literal("code"),
    code: z.string(),
    language: z.string().optional(),
  }),

  /**
   * List (support rich text + link)
   */
  z.object({
    type: z.literal("list"),
    ordered: z.boolean().optional(), // ul / ol
    items: z.array(z.array(InlineSchema)).min(1),
  }),
]);

export type Block = z.infer<typeof BlockSchema>;

/**
 * =========================
 * DOCUMENT ROOT
 * =========================
 */
export const DocumentSchema = z.object({
  type: z.literal("doc"),
  blocks: z.array(BlockSchema),
});

export type Document = z.infer<typeof DocumentSchema>;



// CẤU TRÚC DATA
/*
{
  "type": "doc",
  "blocks": [
    {
      "type": "heading",
      "level": 2,
      "content": [
        { "type": "text", "text": "Giới thiệu sản phẩm" }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Xem chi tiết tại " },
        {
          "type": "link",
          "href": "https://example.com",
          "children": [
            { "type": "text", "text": "website chính thức" }
          ]
        }
      ]
    },
    {
      "type": "list",
      "ordered": true,
      "items": [
        [
          { "type": "text", "text": "Ưu điểm " },
          { "type": "text", "text": "nhanh", "bold": true }
        ],
        [
          { "type": "text", "text": "Có " },
          {
            "type": "link",
            "href": "https://google.com",
            "children": [{ "type": "text", "text": "tài liệu" }]
          }
        ]
      ]
    },
    {
      "type": "image",
      "src": "/img.png",
      "alt": "Laptop Dell XPS 13 màu bạc",
      "caption": [
        { "type": "text", "text": "Ảnh từ " },
        {
          "type": "link",
          "href": "https://dell.com",
          "children": [{ "type": "text", "text": "Dell" }]
        }
      ]
    }
  ]
}

*/




