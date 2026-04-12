'use client';

import type { Document, Block } from "./blocks";

// --- HELPERS ---

export function normalizeTextNode(node: any) {
  return {
    type: "text",
    text: typeof node.text === "string" ? node.text : "",
    href: node.href || undefined,
    bold: !!node.bold,
    italic: !!node.italic,
  };
}

// Hàm này dùng để làm sạch dữ liệu TRƯỚC khi gửi lên Server
export function cleanDocumentForSubmit(doc: Document): Document {
  return {
    ...doc,
    blocks: doc.blocks.map((block: any) => {
      if (block.type === "paragraph") {
        return {
          ...block,
          content: (block.content || [])
            .map(normalizeTextNode)
            .filter((n: any) => n.text.trim().length > 0), // Chỉ lọc khi submit
        };
      }
      return block;
    }),
  };
}

// Hàm normalize nhẹ nhàng để đảm bảo cấu trúc không bị crash khi render
export function normalizeDocument(doc: Document): Document {
  return {
    ...doc,
    blocks: doc.blocks.map((block: any) => {
      switch (block.type) {
        case "paragraph":
          return {
            ...block,
            content: (block.content || []).map(normalizeTextNode),
          };
        case "heading":
          return { ...block, text: block.text ?? "" };
        case "list":
          return {
            ...block,
            items: (block.items || []).map((item: any) =>
              (Array.isArray(item) ? item : [item]).map(normalizeTextNode)
            ),
          };
        default:
          return block;
      }
    }),
  };
}

/* =========================
   MAIN COMPONENT
========================= */

export default function PostEditor({
  value,
  onChange,
}: {
  value: Document;
  onChange: (doc: Document) => void;
}) {
  
  // Cập nhật state mà không lọc bỏ node rỗng để người dùng có thể gõ
  function update(blocks: Block[]) {
    onChange({ ...value, blocks });
  }

  function updateBlock(index: number, block: Block) {
    const blocks = [...value.blocks];
    blocks[index] = block;
    update(blocks);
  }

  function addBlock(type: Block["type"]) {
    let newBlock: any;
    switch (type) {
      case "paragraph":
        newBlock = { type: "paragraph", content: [{ type: "text", text: "" }] };
        break;
      case "heading":
        newBlock = { type: "heading", level: 2, text: "" };
        break;
      case "list":
        newBlock = { type: "list", items: [[{ type: "text", text: "" }]] };
        break;
      case "image":
        newBlock = { type: "image", src: "", alt: "" };
        break;
      case "code":
        newBlock = { type: "code", code: "", language: "ts" };
        break;
      default: return;
    }
    update([...value.blocks, newBlock]);
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex gap-2 mb-4 border-b pb-2">
        <button className="px-2 py-1 bg-gray-100" onClick={() => addBlock("paragraph")}>+ Para</button>
        <button className="px-2 py-1 bg-gray-100" onClick={() => addBlock("heading")}>+ Head</button>
        <button className="px-2 py-1 bg-gray-100" onClick={() => addBlock("list")}>+ List</button>
      </div>

      <div className="space-y-4">
        {value.blocks.map((block, i) => {
          switch (block.type) {
            case "paragraph":
              return <ParagraphEditor key={i} block={block} onChange={(b: any) => updateBlock(i, b)} />;
            case "heading":
              return (
                <input
                  key={i}
                  className="w-full text-2xl font-bold border-b focus:outline-none"
                  value={block.text || ""}
                  onChange={(e) => updateBlock(i, { ...block, text: e.target.value })}
                />
              );
            case "list":
              return <ListEditor key={i} block={block} onChange={(b: any) => updateBlock(i, b)} />;
            case "image":
              return (
                <div key={i} className="flex gap-2 border p-2">
                  <input className="flex-1" placeholder="URL" value={block.src || ""} onChange={(e) => updateBlock(i, { ...block, src: e.target.value })} />
                  <input className="flex-1" placeholder="Alt" value={block.alt || ""} onChange={(e) => updateBlock(i, { ...block, alt: e.target.value })} />
                </div>
              );
            case "code":
              return (
                <textarea
                  key={i}
                  className="w-full p-2 bg-gray-800 text-white font-mono"
                  value={block.code || ""}
                  onChange={(e) => updateBlock(i, { ...block, code: e.target.value })}
                />
              );
            default: return null;
          }
        })}
      </div>
    </div>
  );
}

/* =========================
   SUB-EDITORS (Giữ nguyên logic của bạn nhưng bỏ filter rỗng)
========================= */

function ParagraphEditor({ block, onChange }: any) {
  function updateNode(i: number, field: string, val: any) {
    const content = [...block.content];
    content[i] = { ...content[i], [field]: val };
    onChange({ ...block, content });
  }

  return (
    <div className="border-l-2 border-blue-200 pl-2">
      {block.content.map((node: any, i: number) => (
        <div key={i} className="flex gap-2 mb-1">
          <input 
            className="border-b" 
            value={node.text || ""} 
            onChange={(e) => updateNode(i, "text", e.target.value)} 
          />
          <button 
            className={`px-1 ${node.bold ? 'font-bold text-blue-600' : ''}`}
            onClick={() => updateNode(i, "bold", !node.bold)}
          >B</button>
        </div>
      ))}
      <button className="text-xs text-gray-400" onClick={() => onChange({...block, content: [...block.content, {type: 'text', text: ''}]})}>
        + text node
      </button>
    </div>
  );
}

function ListEditor({ block, onChange }: any) {
  function updateItem(i: number, val: string) {
    const items = [...block.items];
    items[i] = [{ ...items[i][0], text: val }];
    onChange({ ...block, items });
  }

  return (
    <ul className="list-disc ml-5">
      {block.items.map((item: any, i: number) => (
        <li key={i} className="mb-1">
          <input 
            className="border-b" 
            value={item[0]?.text || ""} 
            onChange={(e) => updateItem(i, e.target.value)} 
          />
        </li>
      ))}
      <button className="text-xs text-gray-400" onClick={() => onChange({...block, items: [...block.items, [{type: 'text', text: ''}]]})}>
        + add item
      </button>
    </ul>
  );
}
