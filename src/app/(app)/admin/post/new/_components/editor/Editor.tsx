// components/editor/Editor.tsx
"use client";

import { useState } from "react";
import { Block } from "../../_server/lib/blocks";
import { v4 as uuid } from "uuid";

export default function Editor() {
  const [blocks, setBlocks] = useState<(Block & { id: string })[]>([]);

  const addBlock = (type: Block["type"]) => {
    const newBlock: any = { id: uuid(), type };

    if (type === "heading") newBlock.level = 1;
    if (type === "paragraph") newBlock.text = "";
    if (type === "image") newBlock.src = "";
    if (type === "code") newBlock.code = "";
    if (type === "list") newBlock.items = [""];

    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, data: Partial<Block>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...data } : b))
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex gap-2">
        <button onClick={() => addBlock("heading")}>+ Heading</button>
        <button onClick={() => addBlock("paragraph")}>+ Text</button>
        <button onClick={() => addBlock("image")}>+ Image</button>
        <button onClick={() => addBlock("code")}>+ Code</button>
        <button onClick={() => addBlock("list")}>+ List</button>
      </div>

      {/* Blocks */}
      {blocks.map((block) => (
        <BlockEditor
          key={block.id}
          block={block}
          onChange={(data) => updateBlock(block.id, data)}
          onDelete={() => removeBlock(block.id)}
        />
      ))}

      {/* Output JSON */}
      <pre className="bg-black text-green-400 p-4 rounded">
        {JSON.stringify({ type: "doc", blocks }, null, 2)}
      </pre>
    </div>
  );
}