// src/lib/toc.ts
import { Block } from "./blocks";

export function generateTOC(blocks: Block[]) {
  const slugMap = new Map<string, number>();

  return blocks
    .filter((b) => b.type === "heading")
    .map((b) => {
      const text = b.text;

      let slug = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      // tránh trùng id
      if (slugMap.has(slug)) {
        const count = slugMap.get(slug)! + 1;
        slugMap.set(slug, count);
        slug = `${slug}-${count}`;
      } else {
        slugMap.set(slug, 0);
      }

      return {
        id: slug,
        text,
        level: b.level,
      };
    });
}