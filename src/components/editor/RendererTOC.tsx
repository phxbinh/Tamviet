// src/components/editor/RendererTOC.tsx
// src/components/editor/RendererTOC.tsx hj
'use client';

import { groupByHeading } from "@/lib/parseContent";
import { useEffect, useState, useRef } from "react";
import { TableOfContents } from "./TOC";

export function Renderer({ content }: { content: any }) {
  const sections = groupByHeading(content.blocks);
  const [activeId, setActiveId] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Logic Slugify giữ nguyên...
  const slugMap = new Map<string, number>();
  function slugify(text: string) {
    let slug = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, "").trim().replace(/\s+/g, "-");
    if (slugMap.has(slug)) {
      const count = slugMap.get(slug)! + 1;
      slugMap.set(slug, count);
      return `${slug}-${count}`;
    }
    slugMap.set(slug, 0);
    return slug;
  }
  const sectionIds = sections.map((section) => section.heading ? slugify(section.heading.text) : "");

  // FIX SCROLL SPY: Lắng nghe div cha của contentRef
  useEffect(() => {
    const scrollContainer = contentRef.current?.closest('.overflow-y-auto');
    if (!scrollContainer) return;

    const headings = contentRef.current?.querySelectorAll("h2[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        root: scrollContainer, // Quan trọng: Quan sát bên trong div scroll
        rootMargin: "-100px 0px -70% 0px", 
        threshold: 0 
      }
    );

    headings?.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [sections]);

  return (
    // Xóa bớt padding ngoài vì Shell đã có padding
    <div className="flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-10">
      <TableOfContents 
        sections={sections} 
        sectionIds={sectionIds} 
        activeId={activeId} 
        contentRef={contentRef} 
      />

      <article ref={contentRef} className="min-w-0 pb-20">
        {sections.map((section, i) => {
          const id = section.heading ? sectionIds[i] : "";
          return (
            <section key={i} className="mb-12">
              {section.heading && (
                <h2 id={id} className={`font-bold mb-4 scroll-mt-20 ${section.heading.level === 1 ? "text-3xl" : "text-2xl"}`}>
                  {section.heading.text}
                </h2>
              )}
              <div className="space-y-4">
                {/* Render children giữ nguyên... */}
                {section.children.map((b: any, idx: number) => {
                   if (b.type === "paragraph") return <p key={idx} className="text-gray-700 leading-7">{b.text}</p>;
                   if (b.type === "image") return <img key={idx} src={b.src} alt="" className="rounded-xl w-full" />;
                  if (b.type === "code") return <pre key={idx} className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm"><code>{b.code}</code></pre>;
                  if (b.type === "list") {
                    return (
                      <ul key={idx} className="list-disc pl-6 space-y-1">
                        {b.items.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                   return null;
                })}
              </div>
            </section>
          );
        })}
      </article>
    </div>
  );
}
