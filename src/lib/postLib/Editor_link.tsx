"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Block } from "./blocks";
import BlockEditor from "./BlockEditor_link";
import { createPost } from "./createPost";

type BlockWithId = Block & { id: string };

/* =========================
   INLINE
========================= */
type Inline =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

function toText(text: string): Inline[] {
  return [{ type: "text", text }];
}

/* =========================
   SAVE
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
   EDITOR
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
        content: toText(""),
      };
    } else if (type === "image") {
      newBlock = { id, type, src: "" };
    } else if (type === "code") {
      newBlock = { id, type, code: "" };
    } else {
      newBlock = {
        id,
        type: "list",
        items: [toText("")],
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
        placeholder="Title"
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