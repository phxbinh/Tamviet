// lib/blocks.ts
import { z } from "zod";

/* TEXT */
export const TextSchema = z.object({
  type: z.literal("text"),
  id: z.string(),

  text: z.string(),

  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  code: z.boolean().optional(),
});

/* LINK */
const LinkSchema = z.object({
  type: z.literal("link"),
  href: z.string().refine(
    (val) => val.startsWith("/") || /^https?:\/\//.test(val),
    "Invalid URL"
  ),

  children: z.array(TextSchema).min(1),
});

/* INLINE */
export const InlineSchema = z.discriminatedUnion("type", [
  TextSchema,
  LinkSchema,
]);

/* BASE */
const BaseBlock = z.object({
  id: z.string(),
});

/* BLOCKS */
const HeadingBlock = BaseBlock.extend({
  type: z.literal("heading"),
  level: z.number().min(1).max(6),
  content: z.array(InlineSchema).min(1),
  slug: z.string().optional(),
});

const ParagraphBlock = BaseBlock.extend({
  type: z.literal("paragraph"),
  content: z.array(InlineSchema).min(1),
});

const ImageBlock = BaseBlock.extend({
  type: z.literal("image"),
  src: z.union([z.string().url(), z.string().startsWith("/")]),
  alt: z.string().min(5),
  caption: z.array(InlineSchema).optional(),
  title: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  blurDataURL: z.string().optional(),
});

const CodeBlock = BaseBlock.extend({
  type: z.literal("code"),
  code: z.string(),
  language: z.string().optional(),
  meta: z
    .object({
      filename: z.string().optional(),
      highlight: z.array(z.number()).optional(),
    })
    .optional(),
});

const ListItemSchema = z.object({
  id: z.string(),
  content: z.array(InlineSchema).min(1),
  checked: z.boolean().optional(),
  children: z.lazy(() => z.array(ListItemSchema)).default([]),
});

const ListBlock = BaseBlock.extend({
  type: z.literal("list"),
  ordered: z.boolean().optional(),
  items: z.array(ListItemSchema).min(1),
});

export const BlockSchema = z.discriminatedUnion("type", [
  HeadingBlock,
  ParagraphBlock,
  ImageBlock,
  CodeBlock,
  ListBlock,
]);

export const DocumentSchema = z.object({
  type: z.literal("doc"),
  blocks: z.array(BlockSchema).min(1),
});

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




