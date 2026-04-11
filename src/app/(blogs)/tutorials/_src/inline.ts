"use client";

import { useEffect, useRef } from "react";

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
      const len = n.text.length;

      map.push({
        node: n,
        start: offset,
        end: offset + len,
      });

      offset += len;
    }

    if (n.type === "link") {
      for (const c of n.children) {
        const len = c.text.length;

        map.push({
          node: c,
          start: offset,
          end: offset + len,
        });

        offset += len;
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
   NORMALIZE
========================= */
function normalize(nodes: InlineNode[]): InlineNode[] {
  const result: InlineNode[] = [];

  for (const n of nodes) {
    if (n.type === "text") {
      if (!n.text) continue;

      const prev = result[result.length - 1];

      if (prev && prev.type === "text") {
        prev.text += n.text;
      } else {
        result.push(n);
      }
    }

    if (n.type === "link") {
      const children = n.children.filter((c) => c.text);

      if (!children.length) continue;

      result.push({
        ...n,
        children,
      });
    }
  }

  return result;
}

/* =========================
   APPLY LINK
========================= */
function applyLink(
  nodes: InlineNode[],
  start: number,
  end: number,
  href: string
): InlineNode[] {
  let offset = 0;
  const result: InlineNode[] = [];

  for (const n of nodes) {
    if (n.type === "text") {
      const len = n.text.length;
      const nodeStart = offset;
      const nodeEnd = offset + len;

      if (end <= nodeStart || start >= nodeEnd) {
        result.push(n);
      } else {
        const before = n.text.slice(0, start - nodeStart);
        const selected = n.text.slice(
          Math.max(0, start - nodeStart),
          Math.min(len, end - nodeStart)
        );
        const after = n.text.slice(end - nodeStart);

        if (before) {
          result.push({
            ...n,
            id: crypto.randomUUID(),
            text: before,
          });
        }

        if (selected) {
          result.push({
            type: "link",
            href,
            children: [
              {
                type: "text",
                id: crypto.randomUUID(),
                text: selected,
              },
            ],
          });
        }

        if (after) {
          result.push({
            ...n,
            id: crypto.randomUUID(),
            text: after,
          });
        }
      }

      offset += len;
    }

    if (n.type === "link") {
      result.push(n);

      const len = n.children.reduce((s, c) => s + c.text.length, 0);
      offset += len;
    }
  }

  return normalize(result);
}

/* =========================
   REMOVE LINK
========================= */
function removeLink(nodes: InlineNode[]): InlineNode[] {
  const result: InlineNode[] = [];

  for (const n of nodes) {
    if (n.type === "link") {
      result.push(...n.children);
    } else {
      result.push(n);
    }
  }

  return normalize(result);
}

/* =========================
   FIND LINK
========================= */
function findLinkAtOffset(nodes: InlineNode[], pos: number) {
  let offset = 0;

  for (const n of nodes) {
    if (n.type === "text") {
      offset += n.text.length;
    }

    if (n.type === "link") {
      const len = n.children.reduce((s, c) => s + c.text.length, 0);

      if (pos >= offset && pos <= offset + len) {
        return n;
      }

      offset += len;
    }
  }

  return null;
}

/* =========================
   UPDATE LINK
========================= */
function updateLink(
  nodes: InlineNode[],
  target: LinkNode,
  href: string
): InlineNode[] {
  return nodes.map((n) => {
    if (n === target) {
      return { ...n, href };
    }
    return n;
  });
}

/* =========================
   FIND NODE BY OFFSET
========================= */
function findNodeByOffset(map: MapItem[], pos: number) {
  for (const item of map) {
    if (pos >= item.start && pos < item.end) {
      return {
        node: item.node._dom,
        offset: pos - item.start,
      };
    }
  }
  return null;
}

/* =========================
   RESTORE SELECTION
========================= */
function restoreSelection(
  container: HTMLElement,
  map: MapItem[],
  start: number,
  end: number
) {
  const sel = window.getSelection();
  if (!sel) return;

  const startPos = findNodeByOffset(map, start);
  const endPos = findNodeByOffset(map, end);

  if (!startPos || !endPos) return;

  const range = document.createRange();

  range.setStart(startPos.node!, startPos.offset);
  range.setEnd(endPos.node!, endPos.offset);

  sel.removeAllRanges();
  sel.addRange(range);
}

/* =========================
   RENDER
========================= */
function renderInline(nodes: InlineNode[]) {
  return nodes.map((n) => {
    if (n.type === "text") {
      return (
        <span
          key={n.id}
          ref={(el) => {
            if (el) n._dom = el.firstChild;
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
                if (el) c._dom = el.firstChild;
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
   EDITOR
========================= */
export default function InlineEditor({
  value,
  onChange,
}: {
  value: InlineNode[];
  onChange: (v: InlineNode[]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);
  const restoreRef = useRef<{ start: number; end: number } | null>(null);

  const map = buildOffsetMap(value);

  function handleInsertLink() {
    if (!selectionRef.current) return;

    const url = prompt("Nhập link");
    if (!url) return;

    const { start, end } = selectionRef.current;

    const newValue = applyLink(value, start, end, url);

    onChange(newValue);
    restoreRef.current = { start, end };
  }

  function handleUnlink() {
    const newValue = removeLink(value);
    onChange(newValue);
  }

  function handleEditLink() {
    if (!selectionRef.current) return;

    const link = findLinkAtOffset(value, selectionRef.current.start);
    if (!link) return;

    const url = prompt("Edit link", link.href);
    if (!url) return;

    onChange(updateLink(value, link, url));
  }

  useEffect(() => {
    if (!ref.current || !restoreRef.current) return;

    const newMap = buildOffsetMap(value);

    restoreSelection(
      ref.current,
      newMap,
      restoreRef.current.start,
      restoreRef.current.end
    );

    restoreRef.current = null;
  }, [value]);

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button onClick={handleInsertLink}>🔗 Link</button>
        <button onClick={handleUnlink}>❌ Unlink</button>
        <button onClick={handleEditLink}>✏️ Edit</button>
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="outline-none border p-2 rounded"
        onMouseUp={() => {
          if (!ref.current) return;

          const sel = getSelectionOffsets(ref.current, map);
          selectionRef.current = sel;
        }}
      >
        {renderInline(value)}
      </div>
    </div>
  );
}