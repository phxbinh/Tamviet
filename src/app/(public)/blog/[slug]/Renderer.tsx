// src/components/editor/Renderer.tsx
import { Document } from "./blocks";

export function Renderer({ content }: { content: Document }) {
  return (
    <div className="prose">
      {content.blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            const Tag = `h${block.level}` as any;
            return <Tag key={i}>{block.text}</Tag>;

          case "paragraph":
            return <p key={i}>{block.text}</p>;

          case "image":
            return <img key={i} src={block.src} alt={block.alt} />;

          case "code":
            return (
              <pre key={i}>
                <code>{block.code}</code>
              </pre>
            );

          case "list":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}