import { DocumentSchema } from "./blocks";

/*
export function parseContent(raw: any) {
  try {
    const data =
      typeof raw === "string" ? JSON.parse(raw) : raw;

    return DocumentSchema.parse(data);
  } catch (err) {
    console.error("Invalid document:", err);

    return {
      type: "doc",
      blocks: [],
    };
  }
}
*/


function parseContent(raw: any) {
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;

    // Logic Migration: Chuyển dữ liệu cũ sang mới trước khi parse
    if (data && Array.isArray(data.blocks)) {
      data.blocks = data.blocks.map((block: any) => {
        // Nếu là paragraph cũ (có .text nhưng thiếu .content)
        if (block.type === "paragraph" && block.text && !block.content) {
          return {
            ...block,
            content: [{ type: "text", text: block.text }],
          };
        }
        // Nếu là list cũ (items là mảng string chứ không phải mảng của mảng inline)
        if (block.type === "list" && Array.isArray(block.items)) {
          if (typeof block.items[0] === "string") {
            return {
              ...block,
              items: block.items.map((txt: string) => [{ type: "text", text: txt }]),
            };
          }
        }
        return block;
      });
    }

    return DocumentSchema.parse(data);
  } catch (err) {
    console.error("Invalid document structure:", err);
    return { type: "doc", blocks: [] };
  }
}


/*
export function groupByHeading(blocks: any[]) {
  const sections: any[] = [];
  let current: any = { heading: null, children: [] };

  for (const b of blocks) {
    if (b.type === "heading") {
      if (current.heading || current.children.length > 0) {
        sections.push(current);
      }
      current = { heading: b, children: [] };
      continue;
    }
    current.children.push(b);
  }

  if (current.heading || current.children.length > 0) {
    sections.push(current);
  }

  return sections;
}
*/


export function groupByHeading(blocks: any[]) {
  const sections: any[] = [];
  let current: any = null;

  for (const b of blocks) {
    if (b?.type === "heading") {
      if (current) sections.push(current);

      current = {
        heading: b,
        children: [],
      };
      continue;
    }

    if (!current) {
      current = { heading: null, children: [] };
    }

    current.children.push(b);
  }

  if (current) sections.push(current);

  return sections;
}






