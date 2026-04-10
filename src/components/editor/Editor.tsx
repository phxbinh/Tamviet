// components/editor/Editor.tsx
/*
"use client";

import { useState } from "react";
import { Block } from "@/lib/blocks";
import BlockEditor from "./BlockEditor";
import { createPost } from "@/lib/createPost";

type BlockWithId = Block & { id: string };
*/
"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom"; // Dùng để check trạng thái submit
import { Block } from "@/lib/blocks";
import BlockEditor from "./BlockEditor";
import { createPost } from "@/lib/createPost";

type BlockWithId = Block & { id: string };

/* NÚT SAVE RIÊNG BIỆT ĐỂ DÙNG PENDING STATE */
function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${
        pending ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
      } text-white px-4 py-1.5 rounded-md transition-colors flex items-center gap-2`}
    >
      {pending ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Saving...
        </>
      ) : (
        "Save Post"
      )}
    </button>
  );
}

export default function Editor() {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<BlockWithId[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const addBlock = (type: Block["type"]) => {
    const id = crypto.randomUUID();
    let newBlock: BlockWithId;

    if (type === "heading") newBlock = { id, type, level: 1, text: "" };
    else if (type === "paragraph") newBlock = { id, type, text: "" };
    else if (type === "image") newBlock = { id, type, src: "" };
    else if (type === "code") newBlock = { id, type, code: "" };
    else newBlock = { id, type: "list", items: [""] };

    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (id: string, newBlock: Block) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...newBlock, id } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // Hàm wrapper để xử lý thông báo sau khi Server Action chạy xong
  async function clientAction(formData: FormData) {
    setMessage(null); // Reset thông báo cũ
    
    try {
      const result = await createPost(formData);
      // Giả sử createPost trả về { success: true } hoặc ném lỗi
      setMessage({ type: "success", text: "Bài viết đã được lưu thành công!" });
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi xảy ra khi lưu bài viết." });
    }
  }

  const cleanBlocks = blocks.map(({ id, ...rest }) => rest);

  return (
    <form action={clientAction} className="max-w-4xl mx-auto space-y-6 p-8">
      {/* THÔNG BÁO TRẠNG THÁI */}
      {message && (
        <div className={`p-4 rounded-md border ${
          message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* TITLE */}
      <input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tiêu đề bài viết..."
        className="text-4xl font-bold w-full outline-none placeholder:text-gray-300"
      />

      <input
        type="hidden"
        name="content"
        value={JSON.stringify({ type: "doc", blocks: cleanBlocks })}
      />

      {/* TOOLBAR */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md py-4 border-b flex justify-between items-center">
        <div className="flex gap-2">
          {["heading", "paragraph", "image", "code", "list"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addBlock(type as any)}
              className="text-sm border px-3 py-1 rounded hover:bg-gray-50 capitalize"
            >
              + {type}
            </button>
          ))}
        </div>
        
        <SaveButton />
      </div>

      {/* CONTENT BLOCKS */}
      <div className="space-y-2">
        {blocks.map((block) => (
          <BlockEditor
            key={block.id}
            block={block}
            onChange={(newBlock) => updateBlock(block.id, newBlock)}
            onDelete={() => removeBlock(block.id)}
          />
        ))}
      </div>
    </form>
  );
}




//export default 
function Editor_() {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<BlockWithId[]>([]);

  /* =========================
     ADD BLOCK
  ========================= */
  const addBlock = (type: Block["type"]) => {
    const id = crypto.randomUUID();

    let newBlock: BlockWithId;

    if (type === "heading") {
      newBlock = { id, type, level: 1, text: "" };
    } else if (type === "paragraph") {
      newBlock = { id, type, text: "" };
    } else if (type === "image") {
      newBlock = { id, type, src: "" };
    } else if (type === "code") {
      newBlock = { id, type, code: "" };
    } else {
      newBlock = { id, type: "list", items: [""] };
    }

    setBlocks((prev) => [...prev, newBlock]);
  };

  /* =========================
     UPDATE BLOCK
  ========================= */
  const updateBlock = (id: string, newBlock: Block) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...newBlock, id } : b))
    );
  };

  /* =========================
     REMOVE
  ========================= */
  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  /* =========================
     PREPARE DATA (REMOVE ID)
  ========================= */
  const cleanBlocks = blocks.map(({ id, ...rest }) => rest);

  /* =========================
     UI
  ========================= */
  return (
    <form action={createPost} className="space-y-4">
      {/* TITLE */}
      <input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tiêu đề..."
        className="border p-2 w-full"
      />

      {/* CONTENT JSON */}
      <input
        type="hidden"
        name="content"
        value={JSON.stringify({
          type: "doc",
          blocks: cleanBlocks,
        })}
      />

      {/* TOOLBAR */}
      <div className="flex gap-2">
        <button type="button" onClick={() => addBlock("heading")}>
          + Heading
        </button>

        <button type="button" onClick={() => addBlock("paragraph")}>
          + Text
        </button>

        <button type="button" onClick={() => addBlock("image")}>
          + Image
        </button>

        <button type="button" onClick={() => addBlock("code")}>
          + Code
        </button>

        <button type="button" onClick={() => addBlock("list")}>
          + List
        </button>

        <button
          type="submit"
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Save
        </button>
      </div>

      {/* BLOCKS */}
      {blocks.map((block) => (
        <BlockEditor
          key={block.id}
          block={block}
          onChange={(newBlock) => updateBlock(block.id, newBlock)}
          onDelete={() => removeBlock(block.id)}
        />
      ))}

      {/* DEBUG */}
      <pre className="bg-black text-green-400 p-4 rounded">
        {JSON.stringify({ type: "doc", blocks }, null, 2)}
      </pre>
    </form>
  );
}