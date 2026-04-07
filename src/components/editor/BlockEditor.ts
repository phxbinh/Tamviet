// components/editor/BlockEditor.tsx
"use client";

import { Block } from "@/lib/blocks";

interface BlockEditorProps {
  block: Block;
  onChange: (block: Block) => void;
  onDelete: () => void;
}

export default function BlockEditor({
  block,
  onChange,
  onDelete,
}: BlockEditorProps) {
  return (
    <div className="border p-3 rounded space-y-2">
      <div className="flex justify-between">
        <span className="font-bold text-xs">{block.type}</span>
        <button onClick={onDelete}>❌</button>
      </div>

      {block.type === "heading" && (
        <div className="flex gap-2">
          <input
            type="number"
            value={block.level}
            onChange={(e) =>
              onChange({
                ...block,
                level: Number(e.target.value),
              })
            }
          />
          <input
            value={block.text}
            onChange={(e) =>
              onChange({
                ...block,
                text: e.target.value,
              })
            }
          />
        </div>
      )}

      {block.type === "paragraph" && (
        <textarea
          value={block.text}
          onChange={(e) =>
            onChange({
              ...block,
              text: e.target.value,
            })
          }
        />
      )}

      {block.type === "image" && (
        <input
          value={block.src}
          onChange={(e) =>
            onChange({
              ...block,
              src: e.target.value,
            })
          }
        />
      )}

      {block.type === "code" && (
        <textarea
          value={block.code}
          onChange={(e) =>
            onChange({
              ...block,
              code: e.target.value,
            })
          }
        />
      )}

      {block.type === "list" && (
        <>
          {block.items.map((item, i) => (
            <input
              key={i}
              value={item}
              onChange={(e) => {
                const newItems = [...block.items];
                newItems[i] = e.target.value;

                onChange({
                  ...block,
                  items: newItems,
                });
              }}
            />
          ))}

          <button
            onClick={() =>
              onChange({
                ...block,
                items: [...block.items, ""],
              })
            }
          >
            + Thêm
          </button>
        </>
      )}
    </div>
  );
}