"use client";

import { Block } from "./blocks";

/* =========================
   TYPES
========================= */

type Props = {
  block: Block;
  onChange: (data: Partial<Block>) => void;
  onDelete: () => void;
};

/* =========================
   COMPONENT
========================= */

export default function BlockEditor({
  block,
  onChange,
  onDelete,
}: Props) {
  return (
    <div className="border p-3 rounded space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium capitalize">
          {block.type}
        </span>
        <button
          onClick={onDelete}
          className="text-red-500"
        >
          ❌
        </button>
      </div>

      {/* CONTENT */}
      {renderBlock(block, onChange)}
    </div>
  );
}

/* =========================
   RENDER LOGIC
========================= */

function renderBlock(
  block: Block,
  onChange: (data: Partial<Block>) => void
) {
  switch (block.type) {
    case "heading":
      return (
        <>
          <input
            type="number"
            value={block.level}
            min={1}
            max={6}
            onChange={(e) =>
              onChange({ level: Number(e.target.value) })
            }
            className="border px-2 py-1 w-20"
          />

          <input
            value={block.text}
            onChange={(e) =>
              onChange({ text: e.target.value })
            }
            placeholder="Heading text"
            className="border px-2 py-1 w-full"
          />
        </>
      );

    case "paragraph":
      return (
        <textarea
          value={block.text}
          onChange={(e) =>
            onChange({ text: e.target.value })
          }
          className="border px-2 py-1 w-full"
        />
      );

    case "image":
      return (
        <>
          <input
            value={block.src}
            onChange={(e) =>
              onChange({ src: e.target.value })
            }
            placeholder="Image URL"
            className="border px-2 py-1 w-full"
          />
          <input
            value={block.alt ?? ""}
            onChange={(e) =>
              onChange({ alt: e.target.value })
            }
            placeholder="Alt text"
            className="border px-2 py-1 w-full"
          />
        </>
      );

    case "code":
      return (
        <>
          <input
            value={block.language ?? ""}
            onChange={(e) =>
              onChange({ language: e.target.value })
            }
            placeholder="Language (js, ts...)"
            className="border px-2 py-1 w-full"
          />

          <textarea
            value={block.code}
            onChange={(e) =>
              onChange({ code: e.target.value })
            }
            className="border px-2 py-1 w-full font-mono"
          />
        </>
      );

    case "list":
      return (
        <>
          {block.items.map((item, i) => (
            <input
              key={i}
              value={item}
              onChange={(e) => {
                const newItems = [...block.items];
                newItems[i] = e.target.value;
                onChange({ items: newItems });
              }}
              className="border px-2 py-1 w-full"
            />
          ))}

          <button
            onClick={() =>
              onChange({ items: [...block.items, ""] })
            }
            className="text-blue-500"
          >
            + Add item
          </button>
        </>
      );

    default:
      return null;
  }
}