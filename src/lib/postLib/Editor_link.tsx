"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Block } from "./blocks";
import BlockEditor from "./BlockEditor_link";
import { createPost } from "./createPost";
import { Heading1, Type, Plus, Image as ImageIcon, Code, List as ListIcon, Save } from "lucide-react";

type BlockWithId = Block & { id: string };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${
        pending ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 shadow-lg"
      } text-white px-6 py-2 rounded-xl transition-all flex items-center gap-2 font-bold text-sm`}
    >
      {pending ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <Save size={18} />
      )}
      {pending ? "Saving..." : "Publish Post"}
    </button>
  );
}

export default function Editor() {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<BlockWithId[]>([]);

  const addBlock = (type: Block["type"]) => {
    const id = crypto.randomUUID();
    let newBlock: any;

    switch (type) {
      case "heading":
        newBlock = { id, type, level: 2, text: "" };
        break;
      case "paragraph":
        newBlock = { id, type, content: [{ type: "text", text: "" }] };
        break;
      case "image":
        newBlock = { id, type, src: "", alt: "" };
        break;
      case "code":
        newBlock = { id, type, code: "", language: "javascript" };
        break;
      case "list":
        newBlock = { id, type, items: [[{ type: "text", text: "" }]] };
        break;
    }
    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (id: string, newBlock: Block) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...newBlock, id } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <form action={createPost} className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      {/* HEADER SECTION */}
      <div className="space-y-4">
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề bài viết hấp dẫn..."
          className="text-4xl font-black w-full outline-none placeholder:text-slate-200 text-slate-900 bg-transparent border-b-2 border-slate-50 focus:border-blue-500 transition-colors pb-4"
        />
        
        <input
          type="hidden"
          name="content"
          value={JSON.stringify({ type: "doc", blocks: blocks.map(({ id, ...rest }) => rest) })}
        />

        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 sticky top-4 z-50">
          <ToolbarButton icon={<Heading1 size={18}/>} label="Heading" onClick={() => addBlock("heading")} />
          <ToolbarButton icon={<Type size={18}/>} label="Paragraph" onClick={() => addBlock("paragraph")} />
          <ToolbarButton icon={<ListIcon size={18}/>} label="List" onClick={() => addBlock("list")} />
          <ToolbarButton icon={<ImageIcon size={18}/>} label="Image" onClick={() => addBlock("image")} />
          <ToolbarButton icon={<Code size={18}/>} label="Code" onClick={() => addBlock("code")} />
          <div className="ml-auto">
            <SaveButton />
          </div>
        </div>
      </div>

      {/* BLOCKS LIST */}
      <div className="min-h-[400px]">
        {blocks.length === 0 ? (
          <div className="h-64 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-300 gap-2">
            <Plus size={40} strokeWidth={1} />
            <p className="font-medium text-sm">Chọn một kiểu block ở trên để bắt đầu viết...</p>
          </div>
        ) : (
          blocks.map((block) => (
            <BlockEditor
              key={block.id}
              block={block}
              onChange={(newBlock) => updateBlock(block.id, newBlock)}
              onDelete={() => removeBlock(block.id)}
            />
          ))
        )}
      </div>

      {/* DEBUG PREVIEW */}
      <div className="pt-20">
        <div className="flex items-center gap-2 mb-4 text-slate-400">
          <Code size={16} />
          <span className="text-xs font-bold">JSON OUTPUT PREVIEW</span>
        </div>
        <pre className="bg-slate-900 text-emerald-400 p-6 rounded-2xl text-[11px] overflow-auto max-h-96 shadow-2xl">
          {JSON.stringify({ type: "doc", blocks }, null, 2)}
        </pre>
      </div>
    </form>
  );
}

function ToolbarButton({ icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600 font-semibold text-sm"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
