// src/lib/parseContent.ts
import { DocumentSchema } from "./blocks";

export function parseContent(raw: any) {
  const data =
    typeof raw === "string" ? JSON.parse(raw) : raw;

  return DocumentSchema.parse(data);
}

export function groupByHeading(blocks: any[]) {
  const sections: any[] = [];
  let current: any = null;

  for (const b of blocks) {
    if (b.type === "heading") {
      current = {
        heading: b,
        children: [],
      };
      sections.push(current);
    } else {
      if (!current) {
        current = { heading: null, children: [] };
        sections.push(current);
      }
      current.children.push(b);
    }
  }

  return sections;
}