'use client';

import React from "react";
import type { Document, Block } from "./blocks";

/**
 * =========================
 * Text Renderer
 * =========================
 */
function renderTextNode(node: any, index: number) {
  let el = <>{node.text}</>;

  if (node.bold) {
    el = <strong>{el}</strong>;
  }

  if (node.italic) {
    el = <em>{el}</em>;
  }

  if (node.href) {
    el = (
      <a
        href={node.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {el}
      </a>
    );
  }

  return <React.Fragment key={index}>{el}</React.Fragment>;
}

/**
 * =========================
 * Block Renderer
 * =========================
 */
function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "heading": {
      const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
      return (
        <Tag key={index} className="font-bold mt-6 mb-2">
          {block.text}
        </Tag>
      );
    }

    case "paragraph":
      return (
        <p key={index} className="mb-4 leading-relaxed">
          {block.content.map(renderTextNode)}
        </p>
      );

    case "list":
      return (
        <ul key={index} className="list-disc pl-6 mb-4">
          {block.items.map((item, i) => (
            <li key={i}>
              {item.map(renderTextNode)}
            </li>
          ))}
        </ul>
      );

    case "image":
      return (
        <img
          key={index}
          src={block.src}
          alt={block.alt || ""}
          className="my-4 rounded-lg"
        />
      );

    case "code":
      return (
        <pre
          key={index}
          className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto my-4"
        >
          <code>{block.code}</code>
        </pre>
      );

    default:
      return null;
  }
}

/**
 * =========================
 * Main Renderer
 * =========================
 */
export function Renderer({ content }: { content: Document }) {
  return (
    <div className="prose max-w-none">
      {content.blocks.map(renderBlock)}
    </div>
  );
}