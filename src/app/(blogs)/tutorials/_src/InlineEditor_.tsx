"use client";

import { useEffect, useRef, useState } from "react";

/* =========================
   TYPES
========================= */
type TextNode = {
  type: "text";
  id: string;
  text: string;

  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
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
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

/* =========================
   FLATTEN
========================= */
function flatten(nodes: InlineNode[]): FlatChar[] {
  const result: FlatChar[] = [];

  for (const n of nodes) {
    if (n.type === "text") {
      for (const c of n.text) {
        result.push({
          char: c,
          bold: n.bold,
          italic: n.italic,
          underline: n.underline,
          code: n.code,
        });
      }
    }

    if (n.type === "link") {
      for (const child of n.children) {
        for (const c of child.text) {
          result.push({
            char: c,
            link: n.href,
            bold: child.bold,
            italic: child.italic,
            underline: child.underline,
            code: child.code,
          });
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
  let style: any = {};
  let link: string | null = null;

  function flush() {
    if (!buffer) return;

    const textNode: TextNode = {
      type: "text",
      id: crypto.randomUUID(),
      text: buffer,
      ...style,
    };

    if (link) {
      result.push({
        type: "link",
        href: link,
        children: [textNode],
      });
    } else {
      result.push(textNode);
    }

    buffer = "";
  }

  for (const c of flat) {
    const same =
      c.link === link &&
      c.bold === style.bold &&
      c.italic === style.italic &&
      c.underline === style.underline &&
      c.code === style.code;

    if (!same) {
      flush();
      link = c.link || null;
      style = {
        bold: c.bold,
        italic: c.italic,
        underline: c.underline,
        code: c.code,
      };
    }

    buffer += c.char;
  }

  flush();

  return result;
}

/* =========================
   APPLY
========================= */
function applyLink(nodes: InlineNode[], start: number, end: number, href: string) {
  const flat = flatten(nodes);
  for (let i = start; i < end; i++) flat[i].link = href;
  return rebuild(flat);
}

function removeLink(nodes: InlineNode[], start: number, end: number) {
  const flat = flatten(nodes);
  for (let i = start; i < end; i++) delete flat[i].link;
  return rebuild(flat);
}

function applyFormat(
  nodes: InlineNode[],
  start: number,
  end: number,
  key: "bold" | "italic" | "underline" | "code"
) {
  const flat = flatten(nodes);
  for (let i = start; i < end; i++) {
    flat[i][key] = !flat[i][key];
  }
  return rebuild(flat);
}

/* =========================
   SELECTION
========================= */
function getSelectionOffsets(container: HTMLElement) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;

  const range = sel.getRangeAt(0);

  let start = 0;
  let end = 0;
  let offset = 0;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const len = node.textContent?.length || 0;

    if (node === range.startContainer) {
      start = offset + range.startOffset;
    }

    if (node === range.endContainer) {
      end = offset + range.endOffset;
    }

    offset += len;
  }

  return {
    start: Math.min(start, end),
    end: Math.max(start, end),
  };
}

function restoreSelection(container: HTMLElement, start: number, end: number) {
  const sel = window.getSelection();
  if (!sel) return;

  const range = document.createRange();
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

  let offset = 0;
  let startNode: Node | null = null;
  let endNode: Node | null = null;
  let startOffset = 0;
  let endOffset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const len = node.textContent?.length || 0;

    if (!startNode && start <= offset + len) {
      startNode = node;
      startOffset = start - offset;
    }

    if (!endNode && end <= offset + len) {
      endNode = node;
      endOffset = end - offset;
      break;
    }

    offset += len;
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
    const renderText = (t: TextNode) => {
      let el = <>{t.text}</>;

      if (t.code) el = <code className="bg-gray-200 px-1">{el}</code>;
      if (t.bold) el = <strong>{el}</strong>;
      if (t.italic) el = <em>{el}</em>;
      if (t.underline) el = <u>{el}</u>;

      return el;
    };

    if (n.type === "text") {
      return <span key={n.id}>{renderText(n)}</span>;
    }

    if (n.type === "link") {
      return (
        <a key={n.href} href={n.href} className="text-blue-600 underline">
          {n.children.map((c) => (
            <span key={c.id}>{renderText(c)}</span>
          ))}
        </a>
      );
    }

    return null;
  });
}

/* =========================
   HTML → JSON
========================= */
export function htmlToInline(html: string): InlineNode[] {
  const div = document.createElement("div");
  div.innerHTML = html;

  function walk(node: any): FlatChar[] {
    if (node.nodeType === 3) {
      return node.textContent.split("").map((c: string) => ({ char: c }));
    }

    if (node.nodeType !== 1) return [];

    const tag = node.tagName.toLowerCase();

    let style: any = {};
    let link: string | undefined;

    if (tag === "strong") style.bold = true;
    if (tag === "em") style.italic = true;
    if (tag === "u") style.underline = true;
    if (tag === "code") style.code = true;
    if (tag === "a") link = node.getAttribute("href");

    return Array.from(node.childNodes).flatMap((child: any) =>
      walk(child).map((c: FlatChar) => ({
        ...c,
        ...style,
        link: link || c.link,
      }))
    );
  }

  return rebuild(walk(div));
}

/* =========================
   EDITOR
========================= */
export default function InlineEditor({
  value,
  onChange,
  onEnter,
}: {
  value: InlineNode[];
  onChange: (v: InlineNode[]) => void;
  onEnter?: () => void;
}) {
/*
export default function InlineEditor({
  value,
  onChange,
}: {
  value: InlineNode[];
  onChange: (v: InlineNode[]) => void;
}) {*/
  const ref = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);
  const restoreRef = useRef<{ start: number; end: number } | null>(null);

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

  function handleInsertLink() {
    if (!selectionRef.current) return;
    const url = prompt("Link");
    if (!url) return;

    const { start, end } = selectionRef.current;

    pushHistory(applyLink(value, start, end, url));
    restoreRef.current = { start, end };
  }

  function handleUnlink() {
    if (!selectionRef.current) return;
    const { start, end } = selectionRef.current;

    pushHistory(removeLink(value, start, end));
    restoreRef.current = { start, end };
  }

  function handleFormat(key: any) {
    if (!selectionRef.current) return;
    const { start, end } = selectionRef.current;

    pushHistory(applyFormat(value, start, end, key));
    restoreRef.current = { start, end };
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b") {
        e.preventDefault();
        handleFormat("bold");
      }
      if (e.key === "i") {
        e.preventDefault();
        handleFormat("italic");
      }
      if (e.key === "u") {
        e.preventDefault();
        handleFormat("underline");
      }
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

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }

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
      <div className="flex gap-2 mb-2">
        <button onClick={() => handleFormat("bold")}>B</button>
        <button onClick={() => handleFormat("italic")}>I</button>
        <button onClick={() => handleFormat("underline")}>U</button>
        <button onClick={() => handleFormat("code")}>{"</>"}</button>

        <button onClick={handleInsertLink}>🔗</button>
        <button onClick={handleUnlink}>❌</button>

        <button onClick={undo}>↩</button>
        <button onClick={redo}>↪</button>
      </div>

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
        onPaste={handlePaste}
      >
        {renderInline(value)}
      </div>
    </div>
  );
}