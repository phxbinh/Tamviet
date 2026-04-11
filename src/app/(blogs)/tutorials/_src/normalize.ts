// lib/normalize.ts
import { randomUUID } from "crypto";
import type { Block, InlineNode } from "./blocks";

/* =========================
   INLINE
========================= */

export function hasInlineContent(nodes: InlineNode[]): boolean {
  return nodes.some((n) => {
    if (n.type === "text") {
      return n.text.trim().length > 0;
    }

    if (n.type === "link") {
      return hasInlineContent(n.children);
    }

    return false;
  });
}

export function cleanInline(nodes: InlineNode[]): InlineNode[] {
  return nodes
    .map((n): InlineNode | null => {
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
    .filter(Boolean) as InlineNode[];
}

/* =========================
   LIST ITEMS (recursive)
========================= */

function normalizeListItems(items: any[]): any[] {
  return items
    .map((item) => {
      const id = item.id || randomUUID();

      const content = cleanInline(item.content || []);
      if (!content.length) return null;

      return {
        ...item,
        id,
        content,
        children: item.children
          ? normalizeListItems(item.children)
          : undefined,
      };
    })
    .filter(Boolean);
}

/* =========================
   SLUG
========================= */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

function inlineToPlainText(nodes: InlineNode[]): string {
  return nodes
    .map((n) => {
      if (n.type === "text") return n.text;
      if (n.type === "link") return inlineToPlainText(n.children);
      return "";
    })
    .join(" ");
}

/* =========================
   BLOCKS
========================= */

export function normalizeBlocks(rawBlocks: any[]): Block[] {
  return rawBlocks
    .map((b): Block | null => {
      const id = b.id || randomUUID();

      switch (b.type) {
        case "heading": {
          const content = cleanInline(b.content || []);
          if (!content.length) return null;

          const plain = inlineToPlainText(content);

          return {
            ...b,
            id,
            content,
            slug: b.slug || slugify(plain),
          };
        }

        case "paragraph": {
          const content = cleanInline(b.content || []);
          if (!content.length) return null;

          return {
            ...b,
            id,
            content,
          };
        }

        case "list": {
          const items = normalizeListItems(b.items || []);
          if (!items.length) return null;

          return {
            ...b,
            id,
            items,
          };
        }

        case "image": {
          if (!b.src || !String(b.src).trim()) return null;

          return {
            ...b,
            id,
          };
        }

        case "code": {
          if (!b.code || !String(b.code).trim()) return null;

          return {
            ...b,
            id,
          };
        }

        default:
          return null;
      }
    })
    .filter(Boolean) as Block[];
}