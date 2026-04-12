'use client';

import React from "react";
import type { Block, Document } from "@/lib/blocks";

/**
 * Text node
 */
function renderTextNode(node: any, index: number) {
  let el = <>{node.text}</>;

  if (node.bold) el = <strong>{el}</strong>;
  if (node.italic) el = <em>{el}</em>;

  if (node.href) {
    el = (
      <a href={node.href} target="_blank" rel="noopener noreferrer">
        {el}
      </a>
    );
  }

  return <React.Fragment key={index}>{el}</React.Fragment>;
}

/**
 * Block
 */
function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "heading": {
      const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
      return <Tag key={index}>{block.text}</Tag>;
    }

    case "paragraph":
      return (
        <p key={index}>
          {block.content.map(renderTextNode)}
        </p>
      );

    case "list":
      return (
        <ul key={index}>
          {block.items.map((item, i) => (
            <li key={i}>
              {item.map(renderTextNode)}
            </li>
          ))}
        </ul>
      );

    case "image":
      return (
        <img key={index} src={block.src} alt={block.alt || ""} />
      );

    case "code":
      return (
        <pre key={index}>
          <code>{block.code}</code>
        </pre>
      );

    default:
      return null;
  }
}

/**
 * Main
 */
export function Renderer({ content }: { content: Document }) {
  return (
    <div>
      {content.blocks.map(renderBlock)}
    </div>
  );
}