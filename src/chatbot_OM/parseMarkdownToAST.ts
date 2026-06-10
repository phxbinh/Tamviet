import { unified } from "unified";
import remarkParse from "remark-parse";
import { Root, Content } from "mdast";

export interface ParsedSection {
  level: number;
  title: string;
  content: string;
  children: ParsedSection[];
}

export interface ParsedDocument {
  title: string;
  sections: ParsedSection[];
}

export function parseMarkdownToAST(
  markdown: string
): ParsedDocument {
  const tree = unified()
    .use(remarkParse)
    .parse(markdown) as Root;

  let documentTitle = "Untitled";

  const rootSections: ParsedSection[] = [];
  const stack: ParsedSection[] = [];

  let currentSection: ParsedSection | null = null;

  const flushContent = (
    node: Content
  ): string => {
    return markdown.slice(
      node.position?.start.offset ?? 0,
      node.position?.end.offset ?? 0
    );
  };

  for (const node of tree.children) {
    if (node.type === "heading") {
      const title = flushContent(node)
        .replace(/^#+\s*/, "")
        .trim();

      if (node.depth === 1) {
        documentTitle = title;
        continue;
      }

      const section: ParsedSection = {
        level: node.depth,
        title,
        content: "",
        children: [],
      };

      while (
        stack.length > 0 &&
        stack[stack.length - 1].level >= node.depth
      ) {
        stack.pop();
      }

      if (stack.length === 0) {
        rootSections.push(section);
      } else {
        stack[
          stack.length - 1
        ].children.push(section);
      }

      stack.push(section);
      currentSection = section;
      continue;
    }

    if (currentSection) {
      currentSection.content +=
        flushContent(node) + "\n\n";
    }
  }

  return {
    title: documentTitle,
    sections: rootSections,
  };
}