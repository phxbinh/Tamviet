"use client";

import { Block } from "./blocks";
import TextareaAutosize from "react-textarea-autosize";
import { Trash2, GripVertical, Plus, Link as LinkIcon } from "lucide-react";

interface BlockEditorProps {
  block: Block;
  onChange: (block: Block) => void;
  onDelete: () => void;
}

/* =========================
   INLINE HELPERS
========================= */
// Lấy text chính để hiển thị trong textarea/input chính
function getInlineText(inlines: any[]) {
  const firstText = inlines.find(n => n.type === "text" || n.type === "link");
  return firstText ? firstText.text : "";
}

// Lấy href nếu có
function getInlineHref(inlines: any[]) {
  const linkNode = inlines.find(n => n.type === "link");
  return linkNode ? linkNode.href : "";
}

// Tạo mảng content theo schema
function toInlineArray(text: string, href?: string) {
  if (href && href.trim() !== "") {
    return [{ type: "link" as const, text, href }];
  }
  return [{ type: "text" as const, text }];
}

export default function BlockEditor({ block, onChange, onDelete }: BlockEditorProps) {
  const baseInputStyle = "w-full bg-transparent outline-none resize-none placeholder:text-slate-400 text-slate-800";

  return (
    <div className="relative border border-slate-100 bg-white transition-all rounded-lg p-4 mb-2">
      <div className="absolute right-2 top-2 flex items-center gap-1 z-10">
        <button type="button" className="cursor-grab text-slate-300 hover:text-slate-500 p-1"><GripVertical size={16} /></button>
        <button type="button" onClick={onDelete} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
      </div>

      <div className="space-y-3">
        {/* HEADING */}
        {block.type === "heading" && (
          <div className="flex items-start gap-4">
            <select value={block.level} onChange={(e) => onChange({ ...block, level: Number(e.target.value) })} className="bg-slate-100 text-[10px] font-bold uppercase px-2 py-1 rounded mt-1 border-none outline-none">
              {[1, 2, 3, 4, 5, 6].map((l) => <option key={l} value={l}>H{l}</option>)}
            </select>
            <TextareaAutosize value={block.text} placeholder="Tiêu đề..." className={`${baseInputStyle} font-bold ${block.level === 1 ? "text-3xl" : "text-xl"}`} onChange={(e) => onChange({ ...block, text: e.target.value })} />
          </div>
        )}

        {/* PARAGRAPH */}
        {block.type === "paragraph" && (
          <div className="space-y-2">
            <TextareaAutosize
              value={getInlineText(block.content)}
              placeholder="Nhập nội dung văn bản..."
              className={`${baseInputStyle} text-lg leading-relaxed`}
              onChange={(e) => onChange({ ...block, content: toInlineArray(e.target.value, getInlineHref(block.content)) })}
            />
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <LinkIcon size={12} />
              <input 
                placeholder="Dán link href vào đây (nếu có)..."
                className="bg-transparent border-b border-transparent focus:border-blue-300 outline-none w-full"
                value={getInlineHref(block.content)}
                onChange={(e) => onChange({ ...block, content: toInlineArray(getInlineText(block.content), e.target.value) })}
              />
            </div>
          </div>
        )}

        {/* LIST */}
        {block.type === "list" && (
          <div className="space-y-4 ml-4">
            {block.items.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <input
                    value={getInlineText(item)}
                    placeholder="Mục danh sách..."
                    className={`${baseInputStyle} py-1`}
                    onChange={(e) => onChange({
                      ...block,
                      items: block.items.map((it, idx) => idx === i ? toInlineArray(e.target.value, getInlineHref(it)) : it)
                    })}
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-blue-500 ml-5">
                  <LinkIcon size={10} />
                  <input 
                    placeholder="Link mục này..."
                    className="bg-transparent border-b border-transparent focus:border-blue-200 outline-none w-full"
                    value={getInlineHref(item)}
                    onChange={(e) => onChange({
                      ...block,
                      items: block.items.map((it, idx) => idx === i ? toInlineArray(getInlineText(it), e.target.value) : it)
                    })}
                  />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => onChange({ ...block, items: [...block.items, toInlineArray("")] })} className="flex items-center gap-1 text-blue-500 text-sm hover:underline ml-4">
              <Plus size={14} /> Thêm dòng mới
            </button>
          </div>
        )}

        {/* ... Các block IMAGE, CODE giữ nguyên như cũ ... */}
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
      </div>
    </div>
  );
}
