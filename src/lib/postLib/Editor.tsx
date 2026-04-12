"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Block } from "./blocks";
//import BlockEditor from "./BlockEditor";
import BlockEditor from "./BlockEditor_link";
import { createPost } from "./createPost";

type BlockWithId = Block & { id: string };

/* =========================
   INLINE HELPERS
========================= */
type Inline = Extract<
  Block,
  { type: "paragraph" }
>["content"][number];

function toInline(text: string): Inline[] {
  return [
    {
      type: "text",
      text,
    } as const,
  ];
}


/* =========================
   SAVE BUTTON
========================= */
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

/* =========================
   MAIN EDITOR
========================= */
export default function Editor() {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<BlockWithId[]>([]);

  /* =========================
     ADD BLOCK (FIXED)
  ========================= */
  const addBlock = (type: Block["type"]) => {
    const id = crypto.randomUUID();

    let newBlock: BlockWithId;

    if (type === "heading") {
      newBlock = { id, type, level: 1, text: "" };
    } 
    
    else if (type === "paragraph") {
      newBlock = {
        id,
        type,
        content: toInline(""), // ✅ FIX
      };
    } 
    
    else if (type === "image") {
      newBlock = { id, type, src: "" };
    } 
    
    else if (type === "code") {
      newBlock = { id, type, code: "" };
    } 
    
    else {
      newBlock = {
        id,
        type: "list",
        items: [toInline("")], // ✅ FIX
      };
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
     REMOVE BLOCK
  ========================= */
  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  /* =========================
     CLEAN DATA (KEEP LOGIC)
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

        <SaveButton />
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