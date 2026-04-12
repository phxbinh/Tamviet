'use client';

import { useEffect, useState, useRef, useMemo } from "react";
import { groupByHeading } from "./parseContent"; 
import { TableOfContents } from "./TOC";
import { DocumentSchema } from "./blocks"

function parseContent(raw: any) {
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;

    // Logic Migration: Chuyển dữ liệu cũ sang mới trước khi parse
    if (data && Array.isArray(data.blocks)) {
      data.blocks = data.blocks.map((block: any) => {
        // Nếu là paragraph cũ (có .text nhưng thiếu .content)
        if (block.type === "paragraph" && block.text && !block.content) {
          return {
            ...block,
            content: [{ type: "text", text: block.text }],
          };
        }
        // Nếu là list cũ (items là mảng string chứ không phải mảng của mảng inline)
        if (block.type === "list" && Array.isArray(block.items)) {
          if (typeof block.items[0] === "string") {
            return {
              ...block,
              items: block.items.map((txt: string) => [{ type: "text", text: txt }]),
            };
          }
        }
        return block;
      });
    }

    return DocumentSchema.parse(data);
  } catch (err) {
    console.error("Invalid document structure:", err);
    return { type: "doc", blocks: [] };
  }
}








/* =========================
   INLINE RENDERER
========================= */
function renderInline(nodes: any[]) {
  if (!Array.isArray(nodes)) return null;

  return nodes.map((n, i) => {
    if (n.type === "text") return <span key={i}>{n.text}</span>;
    if (n.type === "link") {
      return (
        <a key={i} href={n.href} target="_blank" rel="noopener" className="text-blue-600 hover:underline">
          {n.text}
        </a>
      );
    }
    return null;
  });
}

export function Renderer({ content: rawContent }: { content: any }) {
  // ✅ FIX: Parse lại content để đảm bảo migration dữ liệu cũ hoạt động
  const content = useMemo(() => parseContent(rawContent), [rawContent]);
  const sections = useMemo(() => groupByHeading(content.blocks), [content]);
  
  const [activeId, setActiveId] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const slugMap = new Map<string, number>();

  function slugify(text: string) {
    if (!text) return "";
    let slug = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
    if (slugMap.has(slug)) {
      const count = slugMap.get(slug)! + 1;
      slugMap.set(slug, count);
      return `${slug}-${count}`;
    }
    slugMap.set(slug, 0);
    return slug;
  }

  const sectionIds = sections.map((s) => s.heading ? slugify(s.heading.text) : "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find(e => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-10% 0px -70% 0px" }
    );
    contentRef.current?.querySelectorAll("h2[id], h3[id]").forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-12 max-w-7xl mx-auto px-4">
      <aside className="hidden lg:block sticky top-24 h-fit">
        <TableOfContents sections={sections} sectionIds={sectionIds} activeId={activeId} contentRef={contentRef} />
      </aside>

      <article ref={contentRef} className="min-w-0 prose prose-slate max-w-none pb-20">
        {sections.map((section, i) => (
          <section key={i} className="mb-10">
            {section.heading && (
              <h2 id={sectionIds[i]} className={`font-extrabold text-slate-900 scroll-mt-28 mb-6 ${section.heading.level === 1 ? "text-4xl" : "text-3xl"}`}>
                {section.heading.text}
              </h2>
            )}
            <div className="space-y-6 text-slate-700">
              {section.children.map((b: any, idx: number) => {
                if (b.type === "paragraph") return <p key={idx} className="text-lg leading-8">{renderInline(b.content)}</p>;
                if (b.type === "list") return (
                  <ul key={idx} className="list-disc pl-6 space-y-3">
                    {b.items.map((item: any, liIdx: number) => <li key={liIdx}>{renderInline(item)}</li>)}
                  </ul>
                );
                if (b.type === "image") return (
                  <figure key={idx} className="my-8">
                    <img src={b.src} alt={b.alt || ""} className="rounded-2xl w-full border border-slate-100 shadow-sm" />
                    {b.alt && <figcaption className="text-center text-sm text-slate-400 mt-3">{b.alt}</figcaption>}
                  </figure>
                );
                if (b.type === "code") return (
                  <pre key={idx} className="bg-slate-900 text-slate-200 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-xl border border-slate-800">
                    <code>{b.code}</code>
                  </pre>
                );
                return null;
              })}
            </div>
          </section>
        ))}
      </article>
    </div>
  );
}
