'use client';

import type { Document, Block } from "./blocks";

export function normalizeTextNode(node: any) {
  return {
    type: "text",
    text: typeof node.text === "string" ? node.text : "",
    href: typeof node.href === "string" ? node.href : undefined,
    bold: !!node.bold,
    italic: !!node.italic,
  };
}
export function normalizeParagraph(block: any) {
  return {
    ...block,
    content: (block.content || [])
      .map(normalizeTextNode)
      .filter((n: any) => n.text.trim().length > 0), // 🔥 chặn rỗng
  };
}


export function normalizeDocument(doc: Document): Document {
  return {
    ...doc,
    blocks: doc.blocks.map((block: any) => {
      switch (block.type) {
        case "paragraph":
          return normalizeParagraph(block);

        case "heading":
          return {
            ...block,
            text: block.text ?? "",
          };

        case "list":
          return {
            ...block,
            items: (block.items || []).map((item: any) =>
              item.map(normalizeTextNode)
            ),
          };

        default:
          return block;
      }
    }),
  };
}
export default function PostEditor({
  value,
  onChange,
}: {
  value: Document;
  onChange: (doc: Document) => void;
}) {
  function update(blocks: Block[]) {
    onChange(normalizeDocument({ ...value, blocks }));
  }

  function updateBlock(index: number, block: Block) {
    const blocks = [...value.blocks];
    blocks[index] = block;
    update(blocks);
  }

  function addBlock(type: Block["type"]) {
    let newBlock: Block;

    switch (type) {
      case "paragraph":
        newBlock = {
          type: "paragraph",
          content: [{ type: "text", text: "" }],
        };
        break;

      case "heading":
        newBlock = {
          type: "heading",
          level: 2,
          text: "",
        };
        break;

      case "list":
        newBlock = {
          type: "list",
          items: [[{ type: "text", text: "" }]],
        };
        break;

      case "image":
        newBlock = {
          type: "image",
          src: "",
          alt: "",
        };
        break;

      case "code":
        newBlock = {
          type: "code",
          code: "",
          language: "ts",
        };
        break;

      default:
        return;
    }

    update([...value.blocks, newBlock]);
  }

  return (
    <div>
      {/* toolbar */}
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => addBlock("paragraph")}>+ P</button>
        <button type="button" onClick={() => addBlock("heading")}>+ H</button>
        <button type="button" onClick={() => addBlock("list")}>+ List</button>
        <button type="button" onClick={() => addBlock("image")}>+ Img</button>
        <button type="button" onClick={() => addBlock("code")}>+ Code</button>
      </div>

      {/* blocks */}
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
                value={block.text ?? ""}
                onChange={(e) =>
                  updateBlock(i, {
                    ...block,
                    text: e.target.value ?? "",
                  })
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
              <div key={i} className="mb-2">
                <input
                  placeholder="Image URL"
                  value={block.src ?? ""}
                  onChange={(e) =>
                    updateBlock(i, {
                      ...block,
                      src: e.target.value ?? "",
                    })
                  }
                />

                <input
                  placeholder="Alt"
                  value={block.alt ?? ""}
                  onChange={(e) =>
                    updateBlock(i, {
                      ...block,
                      alt: e.target.value ?? "",
                    })
                  }
                />
              </div>
            );

          case "code":
            return (
              <textarea
                key={i}
                value={block.code ?? ""}
                onChange={(e) =>
                  updateBlock(i, {
                    ...block,
                    code: e.target.value ?? "",
                  })
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

/* =========================
   PARAGRAPH EDITOR
========================= */

function ParagraphEditor({
  block,
  onChange,
}: any) {
  function updateNode(i: number, field: string, value: any) {
    const content = block.content.map((node: any, idx: number) =>
      idx === i
        ? {
            ...node,
            [field]: value ?? "", // 🔥 CHẶN undefined
          }
        : node
    );

    onChange({
      ...block,
      content,
    });
  }

  function addNode() {
    onChange({
      ...block,
      content: [
        ...block.content,
        {
          type: "text",
          text: "",
        },
      ],
    });
  }

  return (
    <div className="mb-3">
      {block.content.map((node: any, i: number) => (
        <div key={i} className="flex gap-2 mb-1">
          <input
            value={node.text ?? ""}   // 🔥 FIX
            onChange={(e) =>
              updateNode(i, "text", e.target.value ?? "")
            }
          />

          <input
            placeholder="https://..."
            value={node.href ?? ""}
            onChange={(e) =>
              updateNode(i, "href", e.target.value || undefined)
            }
          />

          <button
            type="button"
            onClick={() =>
              updateNode(i, "bold", !node.bold)
            }
          >
            B
          </button>

          <button
            type="button"
            onClick={() =>
              updateNode(i, "italic", !node.italic)
            }
          >
            I
          </button>
        </div>
      ))}

      <button type="button" onClick={addNode}>
        + text
      </button>
    </div>
  );
}

/* =========================
   LIST EDITOR
========================= */

function ListEditor({ block, onChange }: any) {
  function updateItem(i: number, field: string, value: any) {
    const items = [...block.items];

    items[i] = [
      {
        ...items[i][0],
        [field]: value ?? "", // 🔥 FIX
      },
    ];

    onChange({
      ...block,
      items,
    });
  }

  function addItem() {
    onChange({
      ...block,
      items: [
        ...block.items,
        [{ type: "text", text: "" }],
      ],
    });
  }

  return (
    <div className="mb-3">
      {block.items.map((item: any, i: number) => (
        <div key={i} className="flex gap-2 mb-1">
          <input
            value={item[0]?.text ?? ""}
            onChange={(e) =>
              updateItem(i, "text", e.target.value ?? "")
            }
          />

          <input
            placeholder="https://..."
            value={item[0]?.href ?? ""}
            onChange={(e) =>
              updateItem(i, "href", e.target.value || undefined)
            }
          />
        </div>
      ))}

      <button type="button" onClick={addItem}>
        + item
      </button>
    </div>
  );
}