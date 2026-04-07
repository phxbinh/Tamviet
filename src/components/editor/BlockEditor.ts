// components/editor/BlockEditor.tsx
import { Block } from "@/lib/blocks";

export default function BlockEditor({ block, onChange, onDelete }) {
  return (
    <div className="border p-3 rounded space-y-2">
      <div className="flex justify-between">
        <span>{block.type}</span>
        <button onClick={onDelete}>❌</button>
      </div>

      {block.type === "heading" && (
        <>
          <input
            type="number"
            value={block.level}
            min={1}
            max={6}
            onChange={(e) =>
              onChange({ level: Number(e.target.value) })
            }
          />
          <input
            value={block.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Heading text"
          />
        </>
      )}

      {block.type === "paragraph" && (
        <textarea
          value={block.text}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      )}

      {block.type === "image" && (
        <input
          value={block.src}
          onChange={(e) => onChange({ src: e.target.value })}
          placeholder="Image URL"
        />
      )}

      {block.type === "code" && (
        <textarea
          value={block.code}
          onChange={(e) => onChange({ code: e.target.value })}
        />
      )}

      {block.type === "list" && (
        <>
          {block.items.map((item, i) => (
            <input
              key={i}
              value={item}
              onChange={(e) => {
                const newItems = [...block.items];
                newItems[i] = e.target.value;
                onChange({ items: newItems });
              }}
            />
          ))}
          <button
            onClick={() =>
              onChange({ items: [...block.items, ""] })
            }
          >
            + item
          </button>
        </>
      )}
    </div>
  );
}