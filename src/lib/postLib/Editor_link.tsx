"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Block } from "./blocks";
import BlockEditor from "./BlockEditor_link";
import { createPost } from "./createPost";

type BlockWithId = Block & { id: string };

/* =========================
   INLINE TYPE (FIXED)
========================= */
type Inline =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

function toInline(text: string): Inline[] {
  return [
    {
      type: "text" as const,
      text,
    },
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
      {pending ? "Saving..." : "Save Post"}
    </button>
  );
}

/* =========================
   MAIN EDITOR
========================= */
export default function Editor() {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<BlockWithId[]>([]);

  const addBlock = (type: Block["type"]) => {
    const id = crypto.randomUUID();

    let newBlock: BlockWithId;

    if (type === "heading") {
      newBlock = { id, type, level: 1, text: "" };
    } else if (type === "paragraph") {
      newBlock = {
        id,
        type,
        content: toInline(""),
      };
    } else if (type === "image") {
      newBlock = { id, type, src: "" };
    } else if (type === "code") {
      newBlock = { id, type, code: "" };
    } else {
      newBlock = {
        id,
        type: "list",
        items: [toInline("")],
      };
    }

    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (id: string, newBlock: Block) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...newBlock, id } : b))
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const cleanBlocks = blocks.map(({ id, ...rest }) => rest);

  return (
    <form action={createPost} className="space-y-4">

      <input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tiêu đề..."
        className="border p-2 w-full"
      />

      <input
        type="hidden"
        name="content"
        value={JSON.stringify({
          type: "doc",
          blocks: cleanBlocks,
        })}
      />

      <div className="flex gap-2">
        <button type="button" onClick={() => addBlock("heading")}>+ Heading</button>
        <button type="button" onClick={() => addBlock("paragraph")}>+ Text</button>
        <button type="button" onClick={() => addBlock("image")}>+ Image</button>
        <button type="button" onClick={() => addBlock("code")}>+ Code</button>
        <button type="button" onClick={() => addBlock("list")}>+ List</button>
        <SaveButton />
      </div>

      {blocks.map((block) => (
        <BlockEditor
          key={block.id}
          block={block}
          onChange={(newBlock) => updateBlock(block.id, newBlock)}
          onDelete={() => removeBlock(block.id)}
        />
      ))}

      <pre className="bg-black text-green-400 p-4 rounded">
        {JSON.stringify({ type: "doc", blocks }, null, 2)}
      </pre>
    </form>
  );
}