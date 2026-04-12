"use client";

import { Block } from "./blocks";
import TextareaAutosize from "react-textarea-autosize";
import { Trash2, GripVertical, Plus } from "lucide-react";

interface BlockEditorProps {
  block: Block;
  onChange: (block: Block) => void;
  onDelete: () => void;
}

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
}: BlockEditorProps) {
  const baseInputStyle =
    "w-full bg-transparent outline-none resize-none placeholder:text-slate-400 text-slate-800";

  return (
    <div className="relative border border-slate-100 bg-white transition-all rounded-lg p-4 mb-2">
      
      {/* TOOLBAR */}
      <div className="absolute right-2 top-2 flex items-center gap-1 z-10">
        <button
          type="button"
          title="Nắm để kéo"
          className="cursor-grab text-slate-300 hover:text-slate-500 p-1"
        >
          <GripVertical size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          title="Xóa block"
          className="text-red-400 hover:text-red-600 p-1 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">

        {/* =========================
            HEADING
        ========================= */}
        {block.type === "heading" && (
          <div className="flex items-start gap-4">
            <select
              value={block.level}
              onChange={(e) =>
                onChange({ ...block, level: Number(e.target.value) })
              }
              className="bg-slate-100 text-[10px] font-bold uppercase px-2 py-1 rounded mt-1 border-none outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((l) => (
                <option key={l} value={l}>
                  H{l}
                </option>
              ))}
            </select>

            <TextareaAutosize
              value={block.text}
              placeholder="Tiêu đề bài viết..."
              className={`${baseInputStyle} font-bold ${
                block.level === 1
                  ? "text-3xl"
                  : block.level === 2
                  ? "text-2xl"
                  : "text-xl"
              }`}
              onChange={(e) =>
                onChange({ ...block, text: e.target.value })
              }
            />
          </div>
        )}

        {/* =========================
            PARAGRAPH (INLINE FIXED)
        ========================= */}
        {block.type === "paragraph" && (
          <TextareaAutosize
            value={renderInlineText(block.content)}
            placeholder="Nhập nội dung văn bản..."
            className={`${baseInputStyle} text-lg leading-relaxed`}
            onChange={(e) =>
              onChange({
                ...block,
                content: toInline(e.target.value),
              })
            }
          />
        )}

        {/* =========================
            IMAGE
        ========================= */}
        {block.type === "image" && (
          <div className="bg-slate-100 rounded-lg p-6 border-2 border-dashed border-slate-200">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Image URL
              </label>

              <input
                value={block.src}
                placeholder="https://example.com/image.jpg"
                className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) =>
                  onChange({ ...block, src: e.target.value })
                }
              />

              {block.src && (
                <img
                  src={block.src}
                  alt="Preview"
                  className="mt-4 rounded-md max-h-60 object-cover w-full"
                />
              )}
            </div>
          </div>
        )}

        {/* =========================
            CODE
        ========================= */}
        {block.type === "code" && (
          <div className="bg-slate-900 rounded-lg p-4 overflow-hidden">
            <span className="text-slate-500 text-xs font-mono">
              Code Editor
            </span>

            <TextareaAutosize
              value={block.code}
              placeholder="// Viết code tại đây..."
              className="w-full bg-transparent text-blue-300 font-mono text-sm outline-none resize-none mt-2"
              onChange={(e) =>
                onChange({ ...block, code: e.target.value })
              }
            />
          </div>
        )}

        {/* =========================
            LIST (INLINE FIXED)
        ========================= */}
        {block.type === "list" && (
          <div className="space-y-2 ml-4">
            {block.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-slate-400">•</span>

                <input
                  value={renderInlineText(item)}
                  placeholder="Mục danh sách..."
                  className={`${baseInputStyle} py-1`}
                  onChange={(e) =>
                    onChange({
                      ...block,
                      items: block.items.map((it, idx) =>
                        idx === i ? toInline(e.target.value) : it
                      ),
                    })
                  }
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
              className="flex items-center gap-1 text-blue-500 text-sm hover:underline mt-2 ml-4"
            >
              <Plus size={14} /> Thêm dòng mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
}