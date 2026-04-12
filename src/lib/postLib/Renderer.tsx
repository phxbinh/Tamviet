'use client';

import { useEffect, useState, useRef } from "react";
// Đảm bảo bạn đã có file parseContent.ts chứa hàm groupByHeading
import { groupByHeading } from "./parseContent"; 
import { TableOfContents } from "./TOC";

/* =========================
   INLINE RENDERER (Hỗ trợ Link & Text)
========================= */
function renderInline(nodes: any[]) {
  if (!Array.isArray(nodes)) return null;

  return nodes.map((n, i) => {
    if (n.type === "text") {
      return <span key={i}>{n.text}</span>;
    }

    if (n.type === "link") {
      return (
        <a
          key={i}
          href={n.href}
          className="text-blue-600 hover:text-blue-800 underline transition-colors"
          target="_blank"
          rel="noopener noreferrer" // Bảo mật khi dùng target="_blank"
        >
          {n.text}
        </a>
      );
    }

    return null;
  });
}

/* =========================
   MAIN RENDERER COMPONENT
========================= */
export function Renderer({ content }: { content: any }) {
  const sections = groupByHeading(content?.blocks || []);
  const [activeId, setActiveId] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Dùng để tạo slug không trùng lặp cho Table of Contents
  const slugMap = new Map<string, number>();

  function slugify(text: string) {
    if (!text) return "";
    let slug = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Khử dấu tiếng Việt
      .replace(/[^\w\s-]/g, "") // Xóa ký tự đặc biệt
      .trim()
      .replace(/\s+/g, "-"); // Thay khoảng trắng bằng dấu gạch ngang

    if (slugMap.has(slug)) {
      const count = slugMap.get(slug)! + 1;
      slugMap.set(slug, count);
      return `${slug}-${count}`;
    }

    slugMap.set(slug, 0);
    return slug;
  }

  // Khởi tạo danh sách IDs cho Scroll Spy
  const sectionIds = sections.map((section) =>
    section.heading ? slugify(section.heading.text) : ""
  );

  /* =========================
     SCROLL SPY LOGIC
  ========================= */
  useEffect(() => {
    // Tìm container cuộn (thường là window hoặc một div bọc ngoài)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-10% 0px -70% 0px", // Kích hoạt khi heading nằm ở 1/3 trên màn hình
        threshold: 0,
      }
    );

    const headings = contentRef.current?.querySelectorAll("h2[id], h3[id]");
    headings?.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-12 max-w-7xl mx-auto px-4">
      
      {/* CỘT TRÁI: TABLE OF CONTENTS */}
      <aside className="hidden lg:block sticky top-24 h-fit">
        <TableOfContents
          sections={sections}
          sectionIds={sectionIds}
          activeId={activeId}
          contentRef={contentRef}
        />
      </aside>

      {/* CỘT PHẢI: NỘI DUNG BÀI VIẾT */}
      <article ref={contentRef} className="min-w-0 prose prose-slate max-w-none">
        {sections.map((section, i) => {
          const id = section.heading ? sectionIds[i] : "";

          return (
            <section key={i} className="mb-10">
              {/* RENDER HEADING */}
              {section.heading && (
                <h2
                  id={id}
                  className={`font-extrabold text-slate-900 scroll-mt-28 mb-6 ${
                    section.heading.level === 1 ? "text-4xl" : "text-3xl"
                  }`}
                >
                  {section.heading.text}
                </h2>
              )}

              <div className="space-y-6 text-slate-700">
                {section.children.map((b: any, idx: number) => {
                  
                  // 1. Paragraph
                  if (b.type === "paragraph") {
                    return (
                      <p key={idx} className="text-lg leading-8 italic-last-child">
                        {renderInline(b.content)}
                      </p>
                    );
                  }

                  // 2. List
                  if (b.type === "list") {
                    return (
                      <ul key={idx} className="list-disc pl-6 space-y-3">
                        {b.items.map((item: any, i: number) => (
                          <li key={i} className="leading-7">
                            {renderInline(item)}
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  // 3. Image
                  if (b.type === "image") {
                    return (
                      <figure key={idx} className="my-8">
                        <img
                          src={b.src}
                          alt={b.alt || "Nội dung hình ảnh"}
                          className="rounded-2xl w-full shadow-md border border-slate-100"
                        />
                        {b.alt && <figcaption className="text-center text-sm text-slate-400 mt-3">{b.alt}</figcaption>}
                      </figure>
                    );
                  }

                  // 4. Image Group (Dành cho nhiều ảnh cạnh nhau)
                  if (b.type === "imageGroup") {
                    return (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                        {b.images.map((img: any, imgIdx: number) => (
                          <img 
                            key={imgIdx} 
                            src={img.src} 
                            alt={img.alt || ""} 
                            className="rounded-xl w-full h-64 object-cover"
                          />
                        ))}
                      </div>
                    );
                  }

                  // 5. Code Block
                  if (b.type === "code") {
                    return (
                      <div key={idx} className="relative group my-6">
                        <div className="absolute top-0 right-0 px-3 py-1 text-[10px] text-slate-500 font-mono uppercase bg-slate-800 rounded-bl-lg">
                          {b.language || "code"}
                        </div>
                        <pre className="bg-slate-900 text-slate-200 p-5 rounded-xl overflow-x-auto text-sm leading-6 font-mono shadow-xl border border-slate-800">
                          <code>{b.code}</code>
                        </pre>
                      </div>
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
