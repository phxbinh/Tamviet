'use client';

import type { Document, Block } from "./blocks";

export default function PostEditor({
  value,
  onChange,
}: {
  value: Document;
  onChange: (doc: Document) => void;
}) {
  function updateBlock(index: number, block: Block) {
    const blocks = [...value.blocks];
    blocks[index] = block;
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
              <ParagraphEditor
                key={i}
                block={block}
                onChange={(b: Block) => updateBlock(i, b)}
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
              <ListEditor
                key={i}
                block={block}
                onChange={(b: Block) => updateBlock(i, b)}
              />
            );

          case "image":
            return (
              <div key={i}>
                <input
                  placeholder="Image URL"
                  value={block.src}
                  onChange={(e) =>
                    updateBlock(i, { ...block, src: e.target.value })
                  }
                />
                <input
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


function ParagraphEditor({ block, onChange }: any) {
  function updateNode(i: number, field: string, value: any) {
    const content = block.content.map((node: any, idx: number) =>
      idx === i ? { ...node, [field]: value } : node
    );

    onChange({ ...block, content });
  }

  function addNode() {
    onChange({
      ...block,
      content: [...block.content, { type: "text", text: "" }],
    });
  }

  return (
    <div className="mb-3">
      {block.content.map((node: any, i: number) => (
        <div key={i} className="flex gap-2 mb-1">
          <input
            value={node.text}
            onChange={(e) => updateNode(i, "text", e.target.value)}
          />

          <input
            placeholder="https://..."
            value={node.href || ""}
            onChange={(e) =>
              updateNode(i, "href", e.target.value || undefined)
            }
          />

          <button type="button" onClick={() => updateNode(i, "bold", !node.bold)}>
            B
          </button>

          <button type="button" onClick={() => updateNode(i, "italic", !node.italic)}>
            I
          </button>
        </div>
      ))}

      <button type="button" onClick={addNode}>+ text</button>
    </div>
  );
}


function ListEditor({ block, onChange }: any) {
  function updateItem(i: number, field: string, value: any) {
    const items = [...block.items];

    items[i] = [
      {
        ...items[i][0],
        [field]: value,
      },
    ];

    onChange({ ...block, items });
  }

  function addItem() {
    onChange({
      ...block,
      items: [...block.items, [{ type: "text", text: "" }]],
    });
  }

  return (
    <div>
      {block.items.map((item: any, i: number) => (
        <div key={i} className="flex gap-2 mb-1">
          <input
            value={item[0]?.text || ""}
            onChange={(e) => updateItem(i, "text", e.target.value)}
          />

          <input
            placeholder="https://..."
            value={item[0]?.href || ""}
            onChange={(e) =>
              updateItem(i, "href", e.target.value || undefined)
            }
          />
        </div>
      ))}

      <button type="button" onClick={addItem}>+ item</button>
    </div>
  );
}





