// lib/inline.ts

import { InlineNode } from "./blocks";

export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [full, label, href] = match;
    const start = match.index;

    if (start > lastIndex) {
      nodes.push({
        type: "text",
        text: text.slice(lastIndex, start),
      });
    }

    nodes.push({
      type: "link",
      href,
      children: [
        {
          type: "text",
          text: label,
        },
      ],
    });

    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push({
      type: "text",
      text: text.slice(lastIndex),
    });
  }

  return nodes.length ? nodes : [{ type: "text", text: "" }];
}

export function inlineToText(nodes: InlineNode[]): string {
  return nodes
    .map((n) => {
      if (n.type === "text") return n.text;
      if (n.type === "link") {
        const label = n.children?.[0]?.text || "";
        return `[${label}](${n.href})`;
      }
      return "";
    })
    .join("");
}