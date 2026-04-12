'use client';

import { useState } from "react";
//import type { Document, Paragraph, Text } from "./types";
export type Text = {
  type: "text";
  text: string;
  href?: string;
  bold?: boolean;
  italic?: boolean;
};

export type Paragraph = {
  type: "paragraph";
  content: Text[];
};

export type Document = {
  type: "doc";
  blocks: Paragraph[];
};
/* =========================
   TEXT RENDER
========================= */
function renderText(nodes: Text[]) {
  return nodes.map((n, i) => {
    let el = <span key={i}>{n.text}</span>;

    if (n.bold) el = <strong>{el}</strong>;
    if (n.italic) el = <em>{el}</em>;

    if (n.href) {
      el = (
        <a key={i} href={n.href} target="_blank">
          {el}
        </a>
      );
    }

    return el;
  });
}

/* =========================
   PARAGRAPH EDITOR
========================= */
function ParagraphEditor({
  block,
  onChange,
}: {
  block: Paragraph;
  onChange: (b: Paragraph) => void;
}) {
  function update(i: number, patch: Partial<Text>) {
    const content = block.content.map((n, idx) =>
      idx === i ? { ...n, ...patch } : n
    );

    onChange({ ...block, content });
  }

  function add() {
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
    <div style={{ marginBottom: 20 }}>
      {block.content.map((n, i) => (
        <div key={i} style={{ display: "flex", gap: 8 }}>
          <input
            value={n.text}
            onChange={(e) => update(i, { text: e.target.value })}
          />

          <input
            placeholder="href"
            value={n.href || ""}
            onChange={(e) =>
              update(i, {
                href: e.target.value || undefined,
              })
            }
          />

          <button onClick={() => update(i, { bold: !n.bold })}>B</button>
          <button onClick={() => update(i, { italic: !n.italic })}>I</button>
        </div>
      ))}

      <button onClick={add}>+ text</button>
    </div>
  );
}

/* =========================
   PAGE
========================= */
export default function Page() {
  const [doc, setDoc] = useState<Document>({
    type: "doc",
    blocks: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Hello",
            bold: false,
            italic: false,
          },
        ],
      },
    ],
  });

  const paragraph = doc.blocks[0];

  /* =========================
     SAVE (ZOD PLACEHOLDER)
  ========================= */
  function save() {
    console.log("SAVE:", doc);
    alert("Saved (mock)");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Editor</h2>

      <ParagraphEditor
        block={paragraph}
        onChange={(b) =>
          setDoc({
            ...doc,
            blocks: [b],
          })
        }
      />

      <button onClick={save}>Save</button>

      <hr />

      <h3>Preview</h3>
      <p>{renderText(paragraph.content)}</p>

      <hr />

      <pre>{JSON.stringify(doc, null, 2)}</pre>
    </div>
  );
}