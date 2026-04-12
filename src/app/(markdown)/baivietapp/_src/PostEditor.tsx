'use client';

import type { Document, Block } from "./blocks";

export default function PostEditor({
  value,
  onChange,
}: {
  value: Document;
  onChange: (doc: Document) => void;
}) {
  function updateBlock(index: number, newBlock: Block) {
    const blocks = [...value.blocks];
    blocks[index] = newBlock;
    onChange({ ...value, blocks });
  }

  function addBlock(type: Block["type"]) {
    let newBlock: Block;

    if (type === "paragraph") {
      newBlock = {
        type: "paragraph",
        content: [{ type: "text", text: "" }],
      };
    }

    if (type === "heading") {
      newBlock = {
        type: "heading",
        level: 2,
        text: "",
      };
    }

    if (type === "list") {
      newBlock = {
        type: "list",
        items: [[{ type: "text", text: "" }]],
      };
    }

    if (type === "image") {
      newBlock = {
        type: "image",
        src: "",
        alt: "",
      };
    }

    if (type === "code") {
      newBlock = {
        type: "code",
        code: "",
        language: "ts",
      };
    }

    onChange({
      ...value,
      blocks: [...value.blocks, newBlock!],
    });
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => addBlock("paragraph")}>+ P</button>
        <button type="button" onClick={() => addBlock("heading")}>+ H</button>
        <button type="button" onClick={() => addBlock("list")}>+ List</button>
        <button type="button" onClick={() => addBlock("image")}>+ Img</button>
        <button type="button" onClick={() => addBlock("code")}>+ Code</button>
      </div>

      {value.blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <textarea
                key={i}
                className="w-full border p-2 mb-2"
                value={block.content[0]?.text || ""}
                onChange={(e) =>
                  updateBlock(i, {
                    ...block,
                    content: [{ type: "text", text: e.target.value }],
                  })
                }
              />
            );

          case "heading":
            return (
              <input
                key={i}
                className="w-full text-xl font-bold mb-2"
                value={block.text}
                onChange={(e) =>
                  updateBlock(i, { ...block, text: e.target.value })
                }
              />
            );

          case "list":
            return (
              <div key={i} className="mb-2">
                {block.items.map((item, idx) => (
                  <input
                    key={idx}
                    className="block w-full border p-2 mb-1"
                    value={item[0]?.text || ""}
                    onChange={(e) => {
                      const items = [...block.items];
                      items[idx] = [{ type: "text", text: e.target.value }];
                      updateBlock(i, { ...block, items });
                    }}
                  />
                ))}

                <button
                  type="button"
                  onClick={() =>
                    updateBlock(i, {
                      ...block,
                      items: [...block.items, [{ type: "text", text: "" }]],
                    })
                  }
                >
                  + item
                </button>
              </div>
            );

          case "image":
            return (
              <div key={i} className="mb-2">
                <input
                  className="w-full border p-2 mb-1"
                  placeholder="Image URL"
                  value={block.src}
                  onChange={(e) =>
                    updateBlock(i, { ...block, src: e.target.value })
                  }
                />
                <input
                  className="w-full border p-2"
                  placeholder="Alt"
                  value={block.alt || ""}
                  onChange={(e) =>
                    updateBlock(i, { ...block, alt: e.target.value })
                  }
                />
              </div>
            );

          case "code":
            return (
              <textarea
                key={i}
                className="w-full border p-2 mb-2 font-mono"
                placeholder="Code..."
                value={block.code}
                onChange={(e) =>
                  updateBlock(i, { ...block, code: e.target.value })
                }
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}