"use client";

import { useEffect, useRef, useState } from "react";

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

type FlatChar = {
  char: string;
  link?: string;
};

/* =========================
   FLATTEN
========================= */
function flatten(nodes: InlineNode[]): FlatChar[] {
  const result: FlatChar[] = [];

  for (const n of nodes) {
    if (n.type === "text") {
      for (const c of n.text) {
        result.push({ char: c });
      }
    }

    if (n.type === "link") {
      for (const child of n.children) {
        for (const c of child.text) {
          result.push({ char: c, link: n.href });
        }
      }
    }
  }

  return result;
}

/* =========================
   REBUILD
========================= */
function rebuild(flat: FlatChar[]): InlineNode[] {
  const result: InlineNode[] = [];

  let buffer = "";
  let currentLink: string | null = null;

  function flush() {
    if (!buffer) return;

    if (currentLink) {
      result.push({
        type: "link",
        href: currentLink,
        children: [
          {
            type: "text",
            id: crypto.randomUUID(),
            text: buffer,
          },
        ],
      });
    } else {
      result.push({
        type: "text",
        id: crypto.randomUUID(),
        text: buffer,
      });
    }

    buffer = "";
  }

  for (const c of flat) {
    if (c.link !== currentLink) {
      flush();
      currentLink = c.link || null;
    }
    buffer += c.char;
  }

  flush();

  return result;
}

/* =========================
   APPLY LINK (NEW CORE)
========================= */
function applyLink(
  nodes: InlineNode[],
  start: number,
  end: number,
  href: string
): InlineNode[] {
  const flat = flatten(nodes);

  for (let i = start; i < end; i++) {
    flat[i].link = href;
  }

  return rebuild(flat);
}

/* =========================
   REMOVE LINK
========================= */
function removeLink(
  nodes: InlineNode[],
  start: number,
  end: number
): InlineNode[] {
  const flat = flatten(nodes);

  for (let i = start; i < end; i++) {
    delete flat[i].link;
  }

  return rebuild(flat);
}

/* =========================
   SELECTION OFFSET
========================= */
function getSelectionOffsets(container: HTMLElement): {
  start: number;
  end: number;
} | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;

  const range = sel.getRangeAt(0);

  let start = 0;
  let end = 0;

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT
  );

  let currentOffset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (node === range.startContainer) {
      start = currentOffset + range.startOffset;
    }

    if (node === range.endContainer) {
      end = currentOffset + range.endOffset;
    }

    currentOffset += node.textContent?.length || 0;
  }

  return {
    start: Math.min(start, end),
    end: Math.max(start, end),
  };
}

/* =========================
   RESTORE SELECTION
========================= */
function restoreSelection(
  container: HTMLElement,
  start: number,
  end: number
) {
  const sel = window.getSelection();
  if (!sel) return;

  const range = document.createRange();

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT
  );

  let currentOffset = 0;

  let startNode: Node | null = null;
  let endNode: Node | null = null;
  let startOffset = 0;
  let endOffset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const len = node.textContent?.length || 0;

    if (!startNode && start <= currentOffset + len) {
      startNode = node;
      startOffset = start - currentOffset;
    }

    if (!endNode && end <= currentOffset + len) {
      endNode = node;
      endOffset = end - currentOffset;
      break;
    }

    currentOffset += len;
  }

  if (!startNode || !endNode) return;

  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);

  sel.removeAllRanges();
  sel.addRange(range);
}

/* =========================
   RENDER
========================= */
function renderInline(nodes: InlineNode[]) {
  return nodes.map((n) => {
    if (n.type === "text") {
      return <span key={n.id}>{n.text}</span>;
    }

    if (n.type === "link") {
      return (
        <a key={n.href} href={n.href} className="text-blue-600 underline">
          {n.children.map((c) => (
            <span key={c.id}>{c.text}</span>
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

  /* =========================
     UNDO / REDO
  ========================= */
  const [history, setHistory] = useState<InlineNode[][]>([]);
  const [future, setFuture] = useState<InlineNode[][]>([]);

  function pushHistory(newValue: InlineNode[]) {
    setHistory((h) => [...h, value]);
    setFuture([]);
    onChange(newValue);
  }

  function undo() {
    if (!history.length) return;

    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [value, ...f]);

    onChange(prev);
  }

  function redo() {
    if (!future.length) return;

    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, value]);

    onChange(next);
  }

  /* =========================
     ACTIONS
  ========================= */
  function handleInsertLink() {
    if (!selectionRef.current) return;

    const url = prompt("Link");
    if (!url) return;

    const { start, end } = selectionRef.current;

    const newValue = applyLink(value, start, end, url);

    pushHistory(newValue);
    restoreRef.current = { start, end };
  }

  function handleUnlink() {
    if (!selectionRef.current) return;

    const { start, end } = selectionRef.current;

    const newValue = removeLink(value, start, end);

    pushHistory(newValue);
    restoreRef.current = { start, end };
  }

  /* =========================
     SHORTCUT
  ========================= */
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.metaKey || e.ctrlKey) {
      if (e.key === "k") {
        e.preventDefault();
        handleInsertLink();
      }

      if (e.key === "z") {
        e.preventDefault();
        undo();
      }

      if (e.key === "y") {
        e.preventDefault();
        redo();
      }
    }
  }

  /* =========================
     RESTORE
  ========================= */
  useEffect(() => {
    if (!ref.current || !restoreRef.current) return;

    restoreSelection(
      ref.current,
      restoreRef.current.start,
      restoreRef.current.end
    );

    restoreRef.current = null;
  }, [value]);

  return (
    <div>
      {/* TOOLBAR */}
      <div className="flex gap-2 mb-2">
        <button onClick={handleInsertLink}>🔗 Link</button>
        <button onClick={handleUnlink}>❌ Unlink</button>
        <button onClick={undo}>↩ Undo</button>
        <button onClick={redo}>↪ Redo</button>
      </div>

      {/* EDITOR */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="border p-2 rounded outline-none"
        onMouseUp={() => {
          if (!ref.current) return;
          selectionRef.current = getSelectionOffsets(ref.current);
        }}
        onKeyDown={handleKeyDown}
      >
        {renderInline(value)}
      </div>
    </div>
  );
}