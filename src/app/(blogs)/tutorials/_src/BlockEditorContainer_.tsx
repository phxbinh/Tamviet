"use client";

import { useState } from "react";
import InlineEditor from "./InlineEditor_";
import type { Block, Document } from "./blocks";

export default function BlockEditorContainer({
  initial,
  onChange,
}: {
  initial: Document;
  onChange: (doc: Document) => void;
}) {
  const [doc, setDoc] = useState<Document>(initial);

  function updateBlock(index: number, block: Block) {
    const newBlocks = [...doc.blocks];
    newBlocks[index] = block;

    const newDoc = {
      ...doc,
      blocks: newBlocks,
    };

    setDoc(newDoc);
    onChange(newDoc);
  }

  function addBlock(type: Block["type"]) {
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type,
      content: [
        {
          type: "text",
          id: crypto.randomUUID(),
          text: "",
        },
      ],
    } as any;

    const newDoc = {
      ...doc,
      blocks: [...doc.blocks, newBlock],
    };

    setDoc(newDoc);
    onChange(newDoc);
  }

  return (
    <div className="space-y-4">
      {doc.blocks.map((block, i) => (
        <div key={block.id} className="border p-2 rounded">
          {/* =========================
              PARAGRAPH / HEADING
          ========================= */}
          {(block.type === "paragraph" || block.type === "heading") && (
            <InlineEditor
              value={block.content}
              onChange={(content) =>
                updateBlock(i, { ...block, content })
              }
              onEnter={() => {
                addBlock("paragraph");
              }}
            />
          )}

          {/* =========================
              CODE
          ========================= */}
          {block.type === "code" && (
            <textarea
              className="w-full bg-black text-green-300 p-2"
              value={block.code}
              onChange={(e) =>
                updateBlock(i, { ...block, code: e.target.value })
              }
            />
          )}

          {/* =========================
              IMAGE
          ========================= */}
          {block.type === "image" && (
            <input
              className="w-full border p-2"
              value={block.src}
              onChange={(e) =>
                updateBlock(i, { ...block, src: e.target.value })
              }
            />
          )}
        </div>
      ))}

      {/* ADD BLOCK */}
      <button
        onClick={() => addBlock("paragraph")}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        + Add block
      </button>
    </div>
  );
}