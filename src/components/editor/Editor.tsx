"use client";

import { useState } from "react";
import { Block } from "@/lib/blocks";
import BlockEditor from "./BlockEditor";
import { createPost } from "@/lib/actions";

export default function Editor() {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<(Block & { id: string })[]>([]);

  const addBlock = (type: Block["type"]) => {
    const id = crypto.randomUUID();

    let block: any = { id, type };

    if (type === "heading") block = { ...block, level: 1, text: "" };
    if (type === "paragraph") block = { ...block, text: "" };
    if (type === "image") block = { ...block, src: "" };
    if (type === "code") block = { ...block, code: "" };
    if (type === "list") block = { ...block, items: [""] };

    setBlocks((prev) => [...prev, block]);
  };

  const updateBlock = (id: string, newBlock: Block) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...newBlock, id } : b))
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSave = async () => {
    await createPost({
      title,
      content: {
        type: "doc",
        blocks,
      },
    });
  };

  return (
    <div className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <div className="flex gap-2">
        <button onClick={() => addBlock("heading")}>+ H</button>
        <button onClick={() => addBlock("paragraph")}>+ P</button>
        <button onClick={() => addBlock("image")}>+ Img</button>
      </div>

      {blocks.map((block) => (
        <BlockEditor
          key={block.id}
          block={block}
          onChange={(b) => updateBlock(block.id, b)}
          onDelete={() => removeBlock(block.id)}
        />
      ))}

      <button onClick={handleSave}>Save</button>
    </div>
  );
}