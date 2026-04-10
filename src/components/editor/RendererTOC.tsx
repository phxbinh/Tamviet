// src/components/editor/RendererTOC.tsx

'use client';

import { groupByHeading } from "@/lib/parseContent";
import { useEffect, useState, useRef } from "react";
import { TableOfContents } from "./TOC";

export function Renderer({ content }: { content: any }) {
  const sections = groupByHeading(content.blocks);
  const [activeId, setActiveId] = useState<string>("");
    const contentRef = useRef<HTMLDivElement>(null);

  // ================= SLUG LOGIC =================
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

  // ================= SCROLL SPY =================
useEffect(() => {
  const headings = document.querySelectorAll("h2[id]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    },
    { 
      // rootMargin: "Top Right Bottom Left"
      // -150px ở Top để nó chỉ tính là "Active" khi tiêu đề đã vượt qua Header và TOC
      rootMargin: "-150px 0px -70% 0px", 
      threshold: 0 
    }
  );

  headings.forEach((h) => observer.observe(h));
  return () => observer.disconnect();
}, []);




  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-10">
      
      {/* TRUYỀN contentRef VÀO TOC */}
      <TableOfContents 
        sections={sections} 
        sectionIds={sectionIds} 
        activeId={activeId} 
        contentRef={contentRef}
      />

      <article ref={contentRef} className="min-w-0">
        {sections.map((section, i) => {
          const id = section.heading ? sectionIds[i] : "";
          return (
            <section key={i} id={id ? `container-${id}` : ""} className="mb-12">
              {/* HEADING */}
              {section.heading && (
                <h2
                  id={id}
                  className={`
                    font-bold mb-4
                    ${
                      section.heading.level === 1
                        ? "text-3xl"
                        : section.heading.level === 2
                        ? "text-2xl"
                        : "text-xl"
                    }
                  `}
                >
                  {section.heading.text}
                </h2>
              )}

              {/* CONTENT */}
              <div className="space-y-4">
                {section.children.map((b: any, idx: number) => {
                  if (b.type === "paragraph") {
                    return (
                      <p key={idx} className="text-gray-700 leading-7">
                        {b.text}
                      </p>
                    );
                  }

                  if (b.type === "image") {
                    return (
                      <img
                        key={idx}
                        src={b.src}
                        alt={b.alt || ""}
                        className="rounded-xl w-full object-cover"
                      />
                    );
                  }

                  if (b.type === "code") {
                    return (
                      <pre
                        key={idx}
                        className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm"
                      >
                        <code>{b.code}</code>
                      </pre>
                    );
                  }

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



