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

  return inlines
    .map((n) => {
      if (n.type === "text") return n.text;
      if (n.type === "link") return n.text;
      return "";
    })
    .join("");
}

function toInline(text: string) {
  return [
    {
      type: "text" as const,
      text,
    },
  ];
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
  const baseInputStyle =
    "w-full bg-transparent outline-none resize-none placeholder:text-slate-400 text-slate-800";

  /* =========================
     LINK STATE
  ========================= */
  const [linkMode, setLinkMode] = useState(false);
  const [url, setUrl] = useState("");

  const insertLink = (text: string) => {
    if (!url.trim()) return;

    return [
      {
        type: "link" as const,
        text,
        href: url,
      },
    ];
  };

  return (
    <div className="relative border border-slate-100 bg-white rounded-lg p-4 mb-2">

      {/* TOOLBAR */}
      <div className="absolute right-2 top-2 flex items-center gap-1 z-10">
        <button
          type="button"
          onClick={() => setLinkMode(!linkMode)}
          className="text-blue-500 p-1"
          title="Add link"
        >
          <Link size={16} />
        </button>

        <button
          type="button"
          className="cursor-grab text-slate-300 hover:text-slate-500 p-1"
        >
          <GripVertical size={16} />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="text-red-400 hover:text-red-600 p-1"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* LINK INPUT PANEL */}
      {linkMode && (
        <div className="flex gap-2 mb-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste URL..."
            className="border p-1 flex-1 rounded"
          />
        </div>
      )}

      <div className="space-y-3">

        {/* =========================
            HEADING
        ========================= */}
        {block.type === "heading" && (
          <TextareaAutosize
            value={block.text}
            onChange={(e) =>
              onChange({ ...block, text: e.target.value })
            }
            className={baseInputStyle}
          />
        )}

        {/* =========================
            PARAGRAPH (LINK FIXED)
        ========================= */}
        {block.type === "paragraph" && (
          <TextareaAutosize
            value={renderInlineText(block.content)}
            className={baseInputStyle}
            onChange={(e) => {
              const text = e.target.value;

              if (linkMode && url) {
                onChange({
                  ...block,
                  content: [
                    {
                      type: "link",
                      text,
                      href: url,
                    },
                  ],
                });
              } else {
                onChange({
                  ...block,
                  content: toInline(text),
                });
              }
            }}
          />
        )}

        {/* =========================
            LIST (LINK FIXED)
        ========================= */}
        {block.type === "list" && (
          <div className="space-y-2 ml-4">
            {block.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-slate-400">•</span>

                <input
                  value={renderInlineText(item)}
                  onChange={(e) => {
                    const text = e.target.value;

                    onChange({
                      ...block,
                      items: block.items.map((it, idx) =>
                        idx === i
                          ? linkMode && url
                            ? [
                                {
                                  type: "link",
                                  text,
                                  href: url,
                                },
                              ]
                            : toInline(text)
                          : it
                      ),
                    });
                  }}
                  className={baseInputStyle}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                onChange({
                  ...block,
                  items: [...block.items, toInline("")],
                })
              }
              className="flex items-center gap-1 text-blue-500 text-sm"
            >
              <Plus size={14} /> Thêm dòng mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
}