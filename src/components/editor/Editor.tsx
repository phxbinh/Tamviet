// components/editor/Editor.tsx
"use client";

import { useState } from "react";
import { Block } from "@/lib/blocks";
import BlockEditor from "./BlockEditor";
import { createPost } from "@/lib/createPost";

type BlockWithId = Block & { id: string };

export default function Editor() {
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
     UPDATE BLOCK (FIX CHÍNH)
  ========================= */

  const updateBlock = (id: string, newBlock: Block) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...newBlock, id } : b
      )
    );
  };

  /* =========================
     REMOVE
  ========================= */

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  /* =========================
     SAVE
  ========================= */

  async function handleSave() {
    try {
      await createPost({
        title: "test-post",
        content: {
          type: "doc",
          blocks,
        },
      });

      alert("Saved!");
    } catch (err) {
      console.error(err);
      alert("Save failed!");
    }
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex gap-2">
        <button onClick={() => addBlock("heading")}>+ Heading</button>
        <button onClick={() => addBlock("paragraph")}>+ Text</button>
        <button onClick={() => addBlock("image")}>+ Image</button>
        <button onClick={() => addBlock("code")}>+ Code</button>
        <button onClick={() => addBlock("list")}>+ List</button>

        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Save
        </button>
      </div>

      {/* Blocks */}
      {blocks.map((block) => (
        <BlockEditor
          key={block.id}
          block={block}
          onChange={(newBlock) =>
            updateBlock(block.id, newBlock)
          }
          onDelete={() => removeBlock(block.id)}
        />
      ))}

      {/* Debug */}
      <pre className="bg-black text-green-400 p-4 rounded">
        {JSON.stringify({ type: "doc", blocks }, null, 2)}
      </pre>
    </div>
  );
}