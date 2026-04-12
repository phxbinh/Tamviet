"use client";

import { Block } from "./blocks";
import TextareaAutosize from "react-textarea-autosize";
import { Trash2, GripVertical, Plus, Link2, Type, Code, Image as ImageIcon } from "lucide-react";

interface BlockEditorProps {
  block: Block;
  onChange: (block: Block) => void;
  onDelete: () => void;
}

/* =========================
   INLINE HELPERS
========================= */
const getInlineData = (inlines: any[]) => {
  const node = inlines[0] || { type: "text", text: "" };
  return {
    text: node.text || "",
    href: node.href || "",
    isLink: node.type === "link"
  };
};

const toInlineArray = (text: string, href: string) => {
  if (href.trim() !== "") {
    return [{ type: "link" as const, text, href: href.trim() }];
  }
  return [{ type: "text" as const, text }];
};

/* =========================
   COMPONENT
========================= */
export default function BlockEditor({ block, onChange, onDelete }: BlockEditorProps) {
  const baseInputStyle = "w-full bg-transparent outline-none resize-none placeholder:text-slate-400 text-slate-800";

  return (
    <div className="relative border border-slate-200 bg-white hover:border-blue-300 transition-all rounded-xl p-5 mb-4 shadow-sm group">
      
      {/* TOOLBAR */}
      <div className="absolute right-3 top-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button type="button" className="cursor-grab text-slate-300 hover:text-slate-500">
          <GripVertical size={18} />
        </button>
        <button type="button" onClick={onDelete} className="text-slate-300 hover:text-red-500 transition-colors">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {/* =========================
            HEADING
        ========================= */}
        {block.type === "heading" && (
          <div className="flex items-center gap-3">
            <select 
              value={block.level} 
              onChange={(e) => onChange({ ...block, level: Number(e.target.value) })}
              className="bg-slate-100 text-[10px] font-bold uppercase px-2 py-1 rounded border-none outline-none appearance-none cursor-pointer hover:bg-slate-200"
            >
              {[1, 2, 3, 4, 5, 6].map((l) => <option key={l} value={l}>H{l}</option>)}
            </select>
            <TextareaAutosize
              value={block.text}
              placeholder="Nhập tiêu đề..."
              className={`${baseInputStyle} font-bold ${block.level === 1 ? "text-3xl" : "text-xl"}`}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
            />
          </div>
        )}

        {/* =========================
            PARAGRAPH + LINK
        ========================= */}
        {block.type === "paragraph" && (
          <div className="space-y-3">
            <TextareaAutosize
              value={getInlineData(block.content).text}
              placeholder="Nhập nội dung văn bản..."
              className={`${baseInputStyle} text-lg leading-relaxed`}
              onChange={(e) => {
                const { href } = getInlineData(block.content);
                onChange({ ...block, content: toInlineArray(e.target.value, href) });
              }}
            />
            <div className="flex items-center gap-2 p-2 bg-blue-50/50 rounded-lg border border-blue-100 w-fit min-w-[300px]">
              <Link2 size={14} className="text-blue-500" />
              <input
                placeholder="Dán URL nếu muốn tạo link cho đoạn này..."
                className="bg-transparent text-xs w-full outline-none text-blue-700 placeholder:text-blue-300"
                value={getInlineData(block.content).href}
                onChange={(e) => {
                  const { text } = getInlineData(block.content);
                  onChange({ ...block, content: toInlineArray(text, e.target.value) });
                }}
              />
            </div>
          </div>
        )}

        {/* =========================
            LIST + LINK
        ========================= */}
        {block.type === "list" && (
          <div className="space-y-4 ml-2">
            {block.items.map((item, i) => {
              const { text, href } = getInlineData(item);
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    <input
                      value={text}
                      placeholder="Mục danh sách..."
                      className={`${baseInputStyle} border-b border-transparent focus:border-slate-200 py-0.5`}
                      onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[i] = toInlineArray(e.target.value, href);
                        onChange({ ...block, items: newItems });
                      }}
                    />
                  </div>
                  <div className="ml-6 flex items-center gap-2 opacity-40 focus-within:opacity-100 transition-opacity">
                    <Link2 size={12} className="text-blue-600" />
                    <input
                      placeholder="Link mục này..."
                      className="text-[10px] bg-transparent border-b border-slate-100 w-full outline-none focus:border-blue-300"
                      value={href}
                      onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[i] = toInlineArray(text, e.target.value);
                        onChange({ ...block, items: newItems });
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => onChange({ ...block, items: [...block.items, toInlineArray("", "")] })}
              className="flex items-center gap-1 text-blue-500 text-xs font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all ml-6"
            >
              <Plus size={14} /> Thêm dòng mới
            </button>
          </div>
        )}

        {/* =========================
            IMAGE
        ========================= */}
        {block.type === "image" && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3 text-slate-500">
              <ImageIcon size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Image Block</span>
            </div>
            <input
              value={block.src}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              onChange={(e) => onChange({ ...block, src: e.target.value })}
            />
            {block.src && (
              <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 shadow-inner">
                <img src={block.src} alt="Preview" className="max-h-80 object-cover w-full" />
              </div>
            )}
          </div>
        )}

        {/* =========================
            CODE
        ========================= */}
        {block.type === "code" && (
          <div className="bg-slate-900 rounded-xl p-4 shadow-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Code size={14} />
                <span className="text-[10px] font-mono">CODE_EDITOR</span>
              </div>
              <input 
                value={block.language || "javascript"}
                onChange={(e) => onChange({...block, language: e.target.value})}
                className="bg-slate-800 text-[10px] text-slate-300 px-2 py-0.5 rounded border-none outline-none font-mono"
                placeholder="language"
              />
            </div>
            <TextareaAutosize
              value={block.code}
              placeholder="// Paste your code here..."
              className="w-full bg-transparent text-emerald-400 font-mono text-sm outline-none resize-none mt-2 leading-relaxed"
              onChange={(e) => onChange({ ...block, code: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
