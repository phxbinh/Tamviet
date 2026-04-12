import { DocumentSchema } from "./blocks";

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

export function groupByHeading(blocks: any[]) {
  const sections: any[] = [];
  let current: any = {
    heading: null,
    children: [],
  };

  for (const b of blocks) {
    if (b.type === "heading") {
      // push section cũ nếu có content
      if (current.heading || current.children.length > 0) {
        sections.push(current);
      }

      current = {
        heading: b,
        children: [],
      };
      continue;
    }

    // luôn push block bất kỳ
    current.children.push(b);
  }

  // push section cuối
  if (current.heading || current.children.length > 0) {
    sections.push(current);
  }

  return sections;
}