"use client";

import { useState } from "react";

function createId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function SectionBlockEditor() {
  const [sections, setSections] = useState<any[]>([]);

  // ===== SECTION =====
  const addSection = () => {
    setSections([
      ...sections,
      { id: createId(), heading: "New Section", blocks: [] },
    ]);
  };

  const updateSection = (id: string, newData: any) => {
    setSections(sections.map(s => (s.id === id ? { ...s, ...newData } : s)));
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  // ===== BLOCK =====
  const addBlock = (sectionId: string, type: string) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;

      const newBlock =
        type === "paragraph"
          ? { type, text: "" }
          : type === "image"
          ? { type, url: "" }
          : { type, url: "" };

      return { ...s, blocks: [...s.blocks, newBlock] };
    }));
  };

  const updateBlock = (sectionId: string, index: number, newBlock: any) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;

      const updated = [...s.blocks];
      updated[index] = newBlock;

      return { ...s, blocks: updated };
    }));
  };

  const deleteBlock = (sectionId: string, index: number) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;

      return {
        ...s,
        blocks: s.blocks.filter((_: any, i: number) => i !== index),
      };
    }));
  };

  // ===== RENDER =====
  return (
    <div className="grid grid-cols-2 gap-6 p-4">
      {/* LEFT: EDITOR */}
      <div className="space-y-4">
        <button onClick={addSection} className="border px-3 py-1">
          + Add Section
        </button>

        {sections.map(section => (
          <div key={section.id} className="border p-3 space-y-2">
            <input
              value={section.heading}
              onChange={e =>
                updateSection(section.id, { heading: e.target.value })
              }
              className="w-full border p-1"
              placeholder="Section title"
            />

            {/* BLOCKS */}
            {section.blocks.map((block: any, i: number) => (
              <div key={i} className="border p-2 space-y-1">
                {block.type === "paragraph" && (
                  <textarea
                    value={block.text}
                    onChange={e =>
                      updateBlock(section.id, i, {
                        ...block,
                        text: e.target.value,
                      })
                    }
                    className="w-full border p-1"
                    placeholder="Text..."
                  />
                )}

                {block.type === "image" && (
                  <input
                    value={block.url}
                    onChange={e =>
                      updateBlock(section.id, i, {
                        ...block,
                        url: e.target.value,
                      })
                    }
                    className="w-full border p-1"
                    placeholder="Image URL"
                  />
                )}

                {block.type === "video" && (
                  <input
                    value={block.url}
                    onChange={e =>
                      updateBlock(section.id, i, {
                        ...block,
                        url: e.target.value,
                      })
                    }
                    className="w-full border p-1"
                    placeholder="YouTube embed URL"
                  />
                )}

                <button
                  onClick={() => deleteBlock(section.id, i)}
                  className="text-red-500 text-sm"
                >
                  Remove block
                </button>
              </div>
            ))}

            {/* ADD BLOCK */}
            <div className="flex gap-2">
              <button onClick={() => addBlock(section.id, "paragraph")}>
                + Text
              </button>
              <button onClick={() => addBlock(section.id, "image")}>
                + Image
              </button>
              <button onClick={() => addBlock(section.id, "video")}>
                + Video
              </button>
            </div>

            <button
              onClick={() => deleteSection(section.id)}
              className="text-red-500"
            >
              Delete Section
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT: PREVIEW */}
      <div className="border p-4 space-y-6">
        {sections.map(section => (
          <div key={section.id}>
            <h2 className="text-xl font-bold">{section.heading}</h2>

            {section.blocks.map((block: any, i: number) => {
              if (block.type === "paragraph")
                return <p key={i}>{block.text}</p>;

              if (block.type === "image")
                return <img key={i} src={block.url} className="rounded" />;

              if (block.type === "video")
                return (
                  <iframe
                    key={i}
                    src={block.url}
                    className="w-full aspect-video"
                    allowFullScreen
                  />
                );

              return null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}