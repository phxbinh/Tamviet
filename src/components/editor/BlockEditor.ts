"use client";

import { Block } from "@/lib/blocks";

export default function BlockEditor({
  block,
  onChange,
  onDelete,
}: {
  block: Block;
  onChange: (b: Block) => void;
  onDelete: () => void;
}) {
  if (block.type === "heading") {
    return (
      <div>
        <input
          value={block.text}
          onChange={(e) =>
            onChange({ ...block, text: e.target.value })
          }
        />
      </div>
    );
  }

  if (block.type === "paragraph") {
    return (
      <textarea
        value={block.text}
        onChange={(e) =>
          onChange({ ...block, text: e.target.value })
        }
      />
    );
  }

  if (block.type === "image") {
    return (
      <input
        value={block.src}
        onChange={(e) =>
          onChange({ ...block, src: e.target.value })
        }
      />
    );
  }

  return null;
}