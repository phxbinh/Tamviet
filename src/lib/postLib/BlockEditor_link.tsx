"use client";

import { useState } from "react";
import { Block } from "./blocks";
import TextareaAutosize from "react-textarea-autosize";
import { Trash2, Link } from "lucide-react";

/* =========================
   HELPERS
========================= */
function renderInlineText(inlines: any[]) {
  if (!Array.isArray(inlines)) return "";

  return inlines
    .map((n) => (n.type === "text" || n.type === "link" ? n.text : ""))
    .join("");
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

  return (
    <div className="border p-3 rounded relative">

      {/* TOOLBAR */}
      <div className="absolute right-2 top-2 flex gap-2">
        <button
          type="button"
          onClick={() => setLinkMode((v) => !v)}
          className={linkMode ? "text-blue-600" : "text-gray-400"}
        >
          <Link size={16} />
        </button>

        <button type="button" onClick={onDelete}>
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

      {/* =========================
          PARAGRAPH (FIXED CORE)
      ========================= */}
      {block.type === "paragraph" && (
        <TextareaAutosize
          value={renderInlineText(block.content)}
          onChange={(e) => {
            const text = e.target.value;

            onChange({
              ...block,
              content: block.content.map((node, idx, arr) => {
                if (idx === arr.length - 1 && node.type === "text") {
                  return {
                    ...node,
                    text,
                  };
                }
                return node;
              }),
            });
          }}
        />
      )}

      {/* =========================
          LIST (FIXED CORE)
      ========================= */}
      {block.type === "list" && (
        <div>
          {block.items.map((item, i) => (
            <input
              key={i}
              value={renderInlineText(item)}
              onChange={(e) => {
                const text = e.target.value;

                onChange({
                  ...block,
                  items: block.items.map((it, idx) =>
                    idx === i
                      ? it.map((node, nIdx, arr) => {
                          if (nIdx === arr.length - 1 && node.type === "text") {
                            return { ...node, text };
                          }
                          return node;
                        })
                      : it
                  ),
                });
              }}
              className="border p-1 w-full mb-1"
            />
          ))}
        </div>
      )}
    </div>
  );
}