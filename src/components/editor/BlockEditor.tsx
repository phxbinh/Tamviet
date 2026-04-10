// components/editor/BlockEditor.tsx
// components/editor/BlockEditor.tsx
/*
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
*/



"use client";

import { Block } from "@/lib/blocks";
import TextareaAutosize from "react-textarea-autosize";
import { Trash2, GripVertical, Plus } from "lucide-react"; // Dùng icon cho chuyên nghiệp

interface BlockEditorProps {
  block: Block;
  onChange: (block: Block) => void;
  onDelete: () => void;
}

export default function BlockEditor({ block, onChange, onDelete }: BlockEditorProps) {
  // Styles chung cho các loại input để giữ sự đồng nhất
  const baseInputStyle = "w-full bg-transparent outline-none resize-none placeholder:text-slate-400 text-slate-800";

  return (
    <div className="group relative border border-transparent hover:border-slate-200 hover:bg-slate-50/50 transition-all rounded-lg p-4 mb-2">
      {/* TOOLBAR MINI - Chỉ hiện khi hover */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button type="button" className="cursor-grab text-slate-300 hover:text-slate-500">
          <GripVertical size={18} />
        </button>
        <button 
          type="button" 
          onClick={onDelete}
          className="text-slate-300 text-red-200 hover:text-red-500 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* RENDER NỘI DUNG THEO LOẠI BLOCK */}
      <div className="space-y-3">
        {/* HEADING BLOCK */}
        {block.type === "heading" && (
          <div className="flex items-start gap-4">
            <select
              value={block.level}
              onChange={(e) => onChange({ ...block, level: Number(e.target.value) })}
              className="bg-slate-100 text-[10px] font-bold uppercase px-2 py-1 rounded mt-1 border-none outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((l) => (
                <option key={l} value={l}>H{l}</option>
              ))}
            </select>
            <TextareaAutosize
              value={block.text}
              placeholder="Tiêu đề bài viết..."
              className={`${baseInputStyle} font-bold ${
                block.level === 1 ? "text-3xl" : block.level === 2 ? "text-2xl" : "text-xl"
              }`}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
            />
          </div>
        )}

        {/* PARAGRAPH BLOCK */}
        {block.type === "paragraph" && (
          <TextareaAutosize
            value={block.text}
            placeholder="Nhập nội dung văn bản..."
            className={`${baseInputStyle} text-lg leading-relaxed`}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
          />
        )}

        {/* IMAGE BLOCK */}
        {block.type === "image" && (
          <div className="bg-slate-100 rounded-lg p-6 border-2 border-dashed border-slate-200">
            <div className="flex flex-col gap-2">
               <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Image URL</label>
               <input
                value={block.src}
                placeholder="https://example.com/image.jpg"
                className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => onChange({ ...block, src: e.target.value })}
              />
              {block.src && (
                <img src={block.src} alt="Preview" className="mt-4 rounded-md max-h-60 object-cover w-full" />
              )}
            </div>
          </div>
        )}

        {/* CODE BLOCK */}
        {block.type === "code" && (
          <div className="bg-slate-900 rounded-lg p-4 overflow-hidden">
            <div className="flex justify-between mb-2">
                <span className="text-slate-500 text-xs font-mono">Code Editor</span>
            </div>
            <TextareaAutosize
              value={block.code}
              placeholder="// Viết code tại đây..."
              className="w-full bg-transparent text-blue-300 font-mono text-sm outline-none resize-none"
              onChange={(e) => onChange({ ...block, code: e.target.value })}
            />
          </div>
        )}

        {/* LIST BLOCK */}
        {block.type === "list" && (
          <div className="space-y-2 ml-4">
            {block.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 group/item">
                <span className="text-slate-400">•</span>
                <input
                  value={item}
                  placeholder="Mục danh sách..."
                  className={`${baseInputStyle} py-1`}
                  onChange={(e) => {
                    const newItems = [...block.items];
                    newItems[i] = e.target.value;
                    onChange({ ...block, items: newItems });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange({ ...block, items: [...block.items, ""] })}
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





















