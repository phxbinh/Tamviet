'use client';

import { Document, Block } from './blocks';
import { TextSchema } from "@/lib/blocks";

export function Renderer({ content }: { content: Document }) {
  return (
    <div className="prose max-w-none">
      {content.blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
            return <Tag key={i}>{block.text}</Tag>;

          case 'paragraph':
            return (
              <p key={i}>
                {renderTextNodes(block.content)}
              </p>
            );

          case 'image':
            return (
              <img
                key={i}
                src={block.src}
                alt={block.alt || ''}
              />
            );

          case 'code':
            return (
              <pre key={i}>
                <code>{block.code}</code>
              </pre>
            );

          case 'list':
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>
                    {renderTextNodes(item)}
                  </li>
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


function renderTextNodes(content: TextSchema[]) {
  return content.map((node, i) => {
    let el = <>{node.text}</>;

    if (node.bold) {
      el = <strong>{el}</strong>;
    }

    if (node.italic) {
      el = <em>{el}</em>;
    }

    if (node.href) {
      el = (
        <a href={node.href} target="_blank" rel="noopener noreferrer">
          {el}
        </a>
      );
    }

    return <span key={i}>{el}</span>;
  });
}
