'use client';

import type { Document, Block } from "./blocks";

/**
 * Render TextSchema
 */
function renderText(
  node: {
    type: "text";
    text: string;
    bold?: boolean;
    italic?: boolean;
    href?: string;
  },
  i: number
) {
  let el: React.ReactNode = node.text;

  if (node.bold) el = <strong>{el}</strong>;
  if (node.italic) el = <em>{el}</em>;

  if (node.href) {
    el = (
      <a href={node.href} target="_blank" rel="noopener noreferrer">
        {el}
      </a>
    );
  }

  return <span key={i}>{el}</span>;
}

/**
 * MAIN Renderer
 */
export default function Renderer({ content }: { content: Document }) {
  if (!content || content.type !== "doc") return null;

  return (
    <div>
      {content.blocks.map((block: Block, i: number) => {
        switch (block.type) {
          case "heading": {
            const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
            return <Tag key={i}>{block.text}</Tag>;
          }

          case "paragraph":
            return (
              <p key={i}>
                {block.content.map(renderText)}
              </p>
            );

          case "list":
            return (
              <ul key={i}>
                {block.items.map((item, idx) => (
                  <li key={idx}>
                    {item.map(renderText)}
                  </li>
                ))}
              </ul>
            );

          case "image":
            return (
              <img
                key={i}
                src={block.src}
                alt={block.alt || ""}
              />
            );

          case "code":
            return (
              <pre key={i}>
                <code>{block.code}</code>
              </pre>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}