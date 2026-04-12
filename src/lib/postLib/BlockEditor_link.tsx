"use client";

import { useState } from "react";
import { Block } from "./blocks";
import TextareaAutosize from "react-textarea-autosize";
import { Trash2, GripVertical, Plus, Link } from "lucide-react";

/* =========================
   INLINE HELPERS
========================= */
function renderInlineText(inlines: any[]) {
  if (!Array.isArray(inlines)) return "";

  return inlines.map((n) => n.text).join("");
}

function toText(text: string) {
  return [{ type: "text" as const, text }];
}

/* =========================
   COMPONENT
========================= */
export default function BlockEditor({
  block,
  onChange,
  onDelete,
}: {
  block: Block;
  onChange: (block: Block) => void;
  onDelete: () => void;
}) {
  const [linkMode, setLinkMode] = useState(false);
  const [url, setUrl] = useState("");

  const insertInline = (text: string) => {
    if (linkMode && url.trim()) {
      return [
        {
          type: "link" as const,
          text,
          href: url,
        },
      ];
    }
    return toText(text);
  };

  return (
    <div className="border p-3 rounded-lg relative">

      {/* TOOLBAR */}
      <div className="absolute right-2 top-2 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setLinkMode((v) => !v);
            setUrl(""); // 🔥 reset cực quan trọng
          }}
          className={linkMode ? "text-blue-600" : "text-gray-400"}
        >
          <Link size={16} />
        </button>

        <button onClick={onDelete}>
          <Trash2 size={16} />
        </button>
      </div>

      {/* LINK INPUT */}
      {linkMode && (
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="border p-1 w-full mb-2"
        />
      )}

      {/* HEADING */}
      {block.type === "heading" && (
        <TextareaAutosize
          value={block.text}
          onChange={(e) =>
            onChange({ ...block, text: e.target.value })
          }
        />
      )}

      {/* PARAGRAPH */}
      {block.type === "paragraph" && (
        <TextareaAutosize
          value={renderInlineText(block.content)}
          onChange={(e) =>
            onChange({
              ...block,
              content: insertInline(e.target.value),
            })
          }
        />
      )}

      {/* LIST */}
      {block.type === "list" && (
        <div>
          {block.items.map((item, i) => (
            <input
              key={i}
              value={renderInlineText(item)}
              onChange={(e) => {
                const newItems = [...block.items];
                newItems[i] = insertInline(e.target.value);

                onChange({
                  ...block,
                  items: newItems,
                });
              }}
            />
          ))}

          <button
            type="button"
            onClick={() =>
              onChange({
                ...block,
                items: [...block.items, toText("")],
              })
            }
          >
            <Plus size={14} /> Add
          </button>
        </div>
      )}
    </div>
  );
}