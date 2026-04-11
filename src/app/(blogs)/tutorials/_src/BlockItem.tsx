'use client';

import { Block } from "@/lib/blocks";
import { parseInline, inlineToText } from "@/lib/inline";
import TextareaAutosize from "react-textarea-autosize";

export default function BlockItem({
  block,
  onChange,
  onDelete,
}: {
  block: Block;
  onChange: (b: Block) => void;
  onDelete: () => void;
}) {
  return (
    <div className="border p-4 rounded space-y-3">

      {/* HEADING */}
      {block.type === "heading" && (
        <>
          <select
            value={block.level}
            onChange={(e) =>
              onChange({ ...block, level: Number(e.target.value) })
            }
          >
            {[1,2,3,4,5,6].map((l)=>(
              <option key={l} value={l}>H{l}</option>
            ))}
          </select>

          <TextareaAutosize
            value={inlineToText(block.content)}
            onChange={(e) =>
              onChange({
                ...block,
                content: parseInline(e.target.value),
              })
            }
          />
        </>
      )}

      {/* PARAGRAPH */}
      {block.type === "paragraph" && (
        <TextareaAutosize
          value={inlineToText(block.content)}
          onChange={(e) =>
            onChange({
              ...block,
              content: parseInline(e.target.value),
            })
          }
        />
      )}

      {/* IMAGE */}
      {block.type === "image" && (
        <>
          <input
            value={block.src}
            placeholder="Image URL"
            onChange={(e) =>
              onChange({ ...block, src: e.target.value })
            }
          />

          <input
            value={block.alt}
            placeholder="Alt text"
            onChange={(e) =>
              onChange({ ...block, alt: e.target.value })
            }
          />

          <TextareaAutosize
            value={inlineToText(block.caption || [])}
            placeholder="Caption"
            onChange={(e) =>
              onChange({
                ...block,
                caption: parseInline(e.target.value),
              })
            }
          />
        </>
      )}

      {/* CODE */}
      {block.type === "code" && (
        <TextareaAutosize
          value={block.code}
          onChange={(e) =>
            onChange({ ...block, code: e.target.value })
          }
        />
      )}

      {/* LIST */}
      {block.type === "list" && (
        <div className="space-y-2">
          {block.items.map((item, i) => (
            <input
              key={i}
              value={inlineToText(item)}
              onChange={(e) => {
                const newItems = [...block.items];
                newItems[i] = parseInline(e.target.value);

                onChange({
                  ...block,
                  items: newItems,
                });
              }}
            />
          ))}

          <button
            type="button"
            onClick={() =>
              onChange({
                ...block,
                items: [...block.items, [{ type: "text", text: "" }]],
              })
            }
          >
            + item
          </button>
        </div>
      )}

      <button onClick={onDelete} className="text-red-500">
        Delete
      </button>
    </div>
  );
}