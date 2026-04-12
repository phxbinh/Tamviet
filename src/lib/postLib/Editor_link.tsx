"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Block } from "./blocks";
import BlockEditor from "./BlockEditor_link";
import { createPost } from "./createPost";

type BlockWithId = Block & { id: string };

/* =========================
   SAVE BUTTON
========================= */
function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
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

  /* INIT INLINE */
  const initInline = [{ type: "text", text: "" }];

  /* INIT LIST */
  const initList = [[{ type: "text", text: "" }]];

  const addBlock = (type: Block["type"]) => {
    const id = crypto.randomUUID();

    let newBlock: BlockWithId;

    if (type === "heading") {
      newBlock = { id, type, text: "", level: 1 };
    } else if (type === "paragraph") {
      newBlock = {
        id,
        type,
        content: initInline,
      };
    } else if (type === "image") {
      newBlock = { id, type, src: "" };
    } else if (type === "code") {
      newBlock = { id, type, code: "" };
    } else {
      newBlock = {
        id,
        type: "list",
        items: initList,
      };
    }

    setBlocks((p) => [...p, newBlock]);
  };

  const updateBlock = (id: string, newBlock: Block) => {
    setBlocks((p) =>
      p.map((b) => (b.id === id ? { ...newBlock, id } : b))
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((p) => p.filter((b) => b.id !== id));
  };

  const cleanBlocks = blocks.map(({ id, ...rest }) => rest);

  return (
    <form action={createPost} className="space-y-4">

      <input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
        <button type="button" onClick={() => addBlock("heading")}>H</button>
        <button type="button" onClick={() => addBlock("paragraph")}>P</button>
        <button type="button" onClick={() => addBlock("list")}>L</button>
        <SaveButton />
      </div>

      {blocks.map((b) => (
        <BlockEditor
          key={b.id}
          block={b}
          onChange={(nb) => updateBlock(b.id, nb)}
          onDelete={() => removeBlock(b.id)}
        />
      ))}

      {/* DEBUG */}
      <pre>{JSON.stringify({ type: "doc", blocks }, null, 2)}</pre>
    </form>
  );
}