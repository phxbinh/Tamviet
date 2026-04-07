// components/editor/BlockEditor.tsx
// components/editor/BlockEditor.tsx
import { Block } from "@/lib/blocks";

// Định nghĩa kiểu cho Props
interface BlockEditorProps {
  block: any; // Hoặc dùng Block nếu interface Block của bạn đã bao quát hết
  onChange: (updatedData: any) => void;
  onDelete: () => void;
}

export default function BlockEditor({ block, onChange, onDelete }: BlockEditorProps) {
  return (
    <div className="border p-3 rounded space-y-2">
      <div className="flex justify-between">
        <span className="font-bold uppercase text-xs text-gray-500">{block.type}</span>
        <button onClick={onDelete} type="button">❌</button>
      </div>

      {/* Heading Block */}
      {block.type === "heading" && (
        <div className="flex gap-2">
          <input
            className="border rounded w-16 px-2"
            type="number"
            value={block.level || 1}
            min={1}
            max={6}
            onChange={(e) => onChange({ level: Number(e.target.value) })}
          />
          <input
            className="border rounded flex-1 px-2"
            value={block.text || ""}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Heading text"
          />
        </div>
      )}

      {/* Paragraph Block */}
      {block.type === "paragraph" && (
        <textarea
          className="border rounded w-full p-2"
          value={block.text || ""}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Viết nội dung..."
        />
      )}

      {/* Image Block */}
      {block.type === "image" && (
        <input
          className="border rounded w-full p-2"
          value={block.src || ""}
          onChange={(e) => onChange({ src: e.target.value })}
          placeholder="Image URL"
        />
      )}

      {/* Code Block */}
      {block.type === "code" && (
        <textarea
          className="border rounded w-full p-2 font-mono bg-gray-50"
          value={block.code || ""}
          onChange={(e) => onChange({ code: e.target.value })}
          placeholder="Paste code here..."
        />
      )}

      {/* List Block */}
      {block.type === "list" && (
        <div className="space-y-1">
          {(block.items || []).map((item: string, i: number) => (
            <input
              key={i}
              className="border rounded w-full p-1"
              value={item}
              onChange={(e) => {
                const newItems = [...block.items];
                newItems[i] = e.target.value;
                onChange({ items: newItems });
              }}
            />
          ))}
          <button
            className="text-sm text-blue-500"
            type="button"
            onClick={() => onChange({ items: [...(block.items || []), ""] })}
          >
            + Thêm dòng
          </button>
        </div>
      )}
    </div>
  );
}
