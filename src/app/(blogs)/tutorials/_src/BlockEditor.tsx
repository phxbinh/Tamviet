'use client';

import { Document, Block } from "@/lib/blocks";
import BlockItem from "./BlockItem";

export default function BlockEditor({
  content,
  onChange,
}: {
  content: Document;
  onChange: (doc: Document) => void;
}) {
  const updateBlock = (i: number, b: Block) => {
    const newBlocks = [...content.blocks];
    newBlocks[i] = b;

    onChange({ ...content, blocks: newBlocks });
  };

  const addBlock = () => {
    onChange({
      ...content,
      blocks: [
        ...content.blocks,
        {
          type: "paragraph",
          content: [{ type: "text", text: "" }],
        },
      ],
    });
  };

  const deleteBlock = (i: number) => {
    const newBlocks = content.blocks.filter((_, idx) => idx !== i);
    onChange({ ...content, blocks: newBlocks });
  };

  return (
    <div className="space-y-4">
      {content.blocks.map((b, i) => (
        <BlockItem
          key={i}
          block={b}
          onChange={(newBlock) => updateBlock(i, newBlock)}
          onDelete={() => deleteBlock(i)}
        />
      ))}

      <button onClick={addBlock}>+ Add block</button>
    </div>
  );
}