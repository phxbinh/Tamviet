"use client";

import { useRef } from "react";

/* =========================
   TYPES
========================= */
type TextNode = {
  type: "text";
  id: string;
  text: string;
  _dom?: Node | null;
};

type LinkNode = {
  type: "link";
  href: string;
  children: TextNode[];
};

type InlineNode = TextNode | LinkNode;

type MapItem = {
  node: TextNode;
  start: number;
  end: number;
};

/* =========================
   BUILD OFFSET MAP
========================= */
function buildOffsetMap(nodes: InlineNode[]): MapItem[] {
  const map: MapItem[] = [];
  let offset = 0;

  for (const n of nodes) {
    if (n.type === "text") {
      const length = n.text.length;

      map.push({
        node: n,
        start: offset,
        end: offset + length,
      });

      offset += length;
    }

    if (n.type === "link") {
      for (const child of n.children) {
        const length = child.text.length;

        map.push({
          node: child,
          start: offset,
          end: offset + length,
        });

        offset += length;
      }
    }
  }

  return map;
}

/* =========================
   DOM → OFFSET
========================= */
function getOffsetFromNode(
  node: Node,
  offset: number,
  map: MapItem[]
): number | null {
  for (const item of map) {
    if (item.node._dom === node) {
      return item.start + offset;
    }
  }

  return null;
}

/* =========================
   GET SELECTION
========================= */
function getSelectionOffsets(
  container: HTMLElement,
  map: MapItem[]
) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);

  const start = getOffsetFromNode(
    range.startContainer,
    range.startOffset,
    map
  );

  const end = getOffsetFromNode(
    range.endContainer,
    range.endOffset,
    map
  );

  if (start == null || end == null) return null;

  return {
    start: Math.min(start, end),
    end: Math.max(start, end),
  };
}

/* =========================
   RENDER INLINE
========================= */
function renderInline(nodes: InlineNode[]) {
  return nodes.map((n) => {
    if (n.type === "text") {
      return (
        <span
          key={n.id}
          ref={(el) => {
            if (el) {
              n._dom = el.firstChild; // 🔥 attach text node
            }
          }}
        >
          {n.text}
        </span>
      );
    }

    if (n.type === "link") {
      return (
        <a key={n.href} href={n.href} className="text-blue-600 underline">
          {n.children.map((c) => (
            <span
              key={c.id}
              ref={(el) => {
                if (el) {
                  c._dom = el.firstChild;
                }
              }}
            >
              {c.text}
            </span>
          ))}
        </a>
      );
    }

    return null;
  });
}

/* =========================
   INLINE EDITOR
========================= */
export default function InlineEditor({
  value,
  onChange,
}: {
  value: InlineNode[];
  onChange: (val: InlineNode[]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const map = buildOffsetMap(value);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className="outline-none"
      onMouseUp={() => {
        if (!ref.current) return;

        const sel = getSelectionOffsets(ref.current, map);

        console.log("SELECTION:", sel);
        // 👉 { start: number, end: number }
      }}
    >
      {renderInline(value)}
    </div>
  );
}