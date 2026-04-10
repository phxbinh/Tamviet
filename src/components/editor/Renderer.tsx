// src/components/editor/Renderer.tsx
/*
import { Document } from "@/lib/blocks";

export function Renderer({ content }: { content: Document }) {
  return (
    <div>
      {content.blocks.map((b, i) => {
        if (b.type === "heading") return <h1 key={i}>{b.text}</h1>;
        if (b.type === "paragraph") return <p key={i}>{b.text}</p>;
        if (b.type === "image") return <img key={i} src={b.src} />;
        return null;
      })}
    </div>
  );
}
*/


  // src/components/editor/Renderer.tsx
'use client';

import { groupByHeading } from "@/lib/parseContent";
import { useEffect, useState } from "react";



/*
'use client';

import { groupByHeading } from "@/lib/parseContent";
import { useEffect, useState } from "react";
*/
import { ChevronDown } from "lucide-react"; // Cần cài lucide-react hoặc dùng icon khác

export function Renderer({ content }: { content: any }) {
  const sections = groupByHeading(content.blocks);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false); // State cho dropdown trên mobile

  // ================= SLUG & IDS =================
  const slugMap = new Map<string, number>();
  function slugify(text: string) {
    let slug = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, "").trim().replace(/\s+/g, "-");
    if (slugMap.has(slug)) {
      const count = slugMap.get(slug)! + 1;
      slugMap.set(slug, count);
      slug = `${slug}-${count}`;
    } else { slugMap.set(slug, 0); }
    return slug;
  }
  const sectionIds = sections.map((section) => section.heading ? slugify(section.heading.text) : "");

  // ================= SCROLL SPY =================
  useEffect(() => {
    const headings = document.querySelectorAll("h2[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-10">
      
      {/* ================= TOC ASIDE ================= */}
      {/* Mobile: sticky top-0, z-index cao để đè nội dung 
          Laptop: sticky top-20
      */}
      <aside className="sticky top-0 lg:top-20 z-30 lg:z-10 bg-white lg:bg-transparent -mx-6 px-6 py-4 lg:p-0 border-b lg:border-0 h-fit">
        
        {/* Nút bấm Dropdown (Chỉ hiện trên Mobile) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full lg:hidden bg-gray-50 p-3 rounded-lg border border-gray-200"
        >
          <span className="font-bold text-sm uppercase tracking-wider text-gray-700">Mục lục</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Danh sách mục lục: 
            Mobile: Ẩn/Hiện dựa trên state `isOpen`
            Laptop: Luôn hiện (`lg:block`)
        */}
        <div className={`mt-4 lg:mt-0 ${isOpen ? "block" : "hidden"} lg:block`}>
          <div className="hidden lg:block font-bold mb-4 text-sm uppercase tracking-wider text-gray-900">
            Mục lục
          </div>

          <ul className="space-y-3 lg:space-y-2 max-h-[60vh] overflow-y-auto lg:max-h-none pr-2">
            {sections.map((section, i) => {
              if (!section.heading) return null;
              const id = sectionIds[i];

              return (
                <li key={id} style={{ marginLeft: (section.heading.level - 1) * 12 }}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false); // Đóng dropdown sau khi chọn (mobile)
                      const element = document.getElementById(id);
                      if (element) {
                        const offset = 100; // Offset lớn hơn vì có TOC sticky trên mobile
                        window.scrollTo({
                          top: element.getBoundingClientRect().top + window.scrollY - offset,
                          behavior: "smooth"
                        });
                      }
                    }}
                    className={`block py-1 text-sm transition-all ${
                      activeId === id
                        ? "text-blue-600 font-semibold lg:border-l-2 lg:border-blue-600 lg:pl-3 lg:-ml-3"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {section.heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* ================= CONTENT ================= */}
      <article className="mt-8 lg:mt-0">
        {sections.map((section, i) => {
          const id = section.heading ? sectionIds[i] : "";
          return (
            <section key={i} id={id ? `container-${id}` : ""} className="mb-12">
              {section.heading && (
                <h2 id={id} className="font-bold mb-6 scroll-mt-32 text-2xl lg:text-3xl lg:scroll-mt-24">
                  {section.heading.text}
                </h2>
              )}
              <div className="space-y-5 text-gray-700 leading-relaxed text-lg">
                {/* ... (phần render content giữ nguyên như cũ) */}
                {section.children.map((b: any, idx: number) => (
                   <div key={idx}>
                      {b.type === "paragraph" && <p>{b.text}</p>}
                      {b.type === "image" && <img src={b.src} alt="" className="rounded-xl w-full" />}
                      {/* Thêm các type khác ở đây... */}
                   </div>
                ))}
              </div>
            </section>
          );
        })}
      </article>
    </div>
  );
}




/*
'use client';

import { groupByHeading } from "@/lib/parseContent";
import { useEffect, useState } from "react";
*/




export function Renderer__x({ content }: { content: any }) {
  const sections = groupByHeading(content.blocks);
  const [activeId, setActiveId] = useState<string>("");

  // ================= SLUG =================
  const slugMap = new Map<string, number>();
  function slugify(text: string) {
    let slug = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    if (slugMap.has(slug)) {
      const count = slugMap.get(slug)! + 1;
      slugMap.set(slug, count);
      slug = `${slug}-${count}`;
    } else {
      slugMap.set(slug, 0);
    }
    return slug;
  }

  const sectionIds = sections.map((section) => {
    if (!section.heading) return "";
    return slugify(section.heading.text);
  });

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
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  return (
    /* THAY ĐỔI CHÍNH Ở ĐÂY:
       - Mặc định (mobile): flex flex-col (TOC ở trên, Content ở dưới)
       - Từ màn hình lớn (lg): Quay lại dùng grid và đảo thứ tự hiển thị nếu cần
    */
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-10">
      
      {/* ================= TOC ================= */}
      <aside className="lg:sticky lg:top-20 h-fit order-1 lg:order-1 border-b pb-6 lg:border-b-0 lg:pb-0">
        <div className="font-bold mb-4 text-lg lg:text-sm uppercase tracking-wider text-gray-900">
          Mục lục
        </div>

        <ul className="space-y-2 lg:space-y-1">
          {sections.map((section, i) => {
            if (!section.heading) return null;
            const id = sectionIds[i];

            return (
              <li
                key={id}
                style={{ marginLeft: (section.heading.level - 1) * 12 }}
              >
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(id);
                    if (element) {
                      const offset = 80; // Tránh bị đè bởi Header nếu có
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = element.getBoundingClientRect().top;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                      });
                    }
                  }}
                  className={`block py-1 transition-all ${
                    activeId === id
                      ? "text-blue-600 font-semibold border-l-2 border-blue-600 pl-3 -ml-3"
                      : "text-gray-500 hover:text-black pl-0"
                  }`}
                >
                  {section.heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* ================= CONTENT ================= */}
      <article className="order-2 lg:order-2">
        {sections.map((section, i) => {
          const id = section.heading ? sectionIds[i] : "";

          return (
            <section key={i} className="mb-12">
              {section.heading && (
                <h2
                  id={id}
                  className={`
                    font-bold mb-6 scroll-mt-24
                    ${
                      section.heading.level === 1
                        ? "text-3xl lg:text-4xl"
                        : section.heading.level === 2
                        ? "text-2xl lg:text-3xl"
                        : "text-xl lg:text-2xl"
                    }
                  `}
                >
                  {section.heading.text}
                </h2>
              )}

              <div className="space-y-5">
                {section.children.map((b: any, idx: number) => {
                  if (b.type === "paragraph") {
                    return <p key={idx} className="text-gray-700 leading-relaxed text-lg">{b.text}</p>;
                  }
                  if (b.type === "image") {
                    return <img key={idx} src={b.src} alt={b.alt || ""} className="rounded-2xl w-full shadow-sm" />;
                  }
                  if (b.type === "code") {
                    return (
                      <pre key={idx} className="bg-slate-900 text-slate-100 p-5 rounded-xl overflow-x-auto text-sm font-mono leading-6">
                        <code>{b.code}</code>
                      </pre>
                    );
                  }
                  if (b.type === "list") {
                    return (
                      <ul key={idx} className="list-disc pl-6 space-y-2 text-gray-700">
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





export function Renderer__({ content }: { content: any }) {
  const sections = groupByHeading(content.blocks);
  const [activeId, setActiveId] = useState<string>("");

  // ================= SLUG =================
  const slugMap = new Map<string, number>();

  function slugify(text: string) {
    let slug = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    if (slugMap.has(slug)) {
      const count = slugMap.get(slug)! + 1;
      slugMap.set(slug, count);
      slug = `${slug}-${count}`;
    } else {
      slugMap.set(slug, 0);
    }

    return slug;
  }

  // ================= GENERATE IDS (QUAN TRỌNG) =================
  const sectionIds = sections.map((section) => {
    if (!section.heading) return "";
    return slugify(section.heading.text);
  });

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
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );

    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-[250px_1fr] gap-10">
      
      {/* ================= TOC ================= */}
      <aside className="sticky top-20 text-sm h-fit">
        <div className="font-bold mb-3">Mục lục</div>

        <ul className="space-y-1">
          {sections.map((section, i) => {
            if (!section.heading) return null;

            const id = sectionIds[i];

            return (
              <li
                key={id}
                style={{ marginLeft: (section.heading.level - 1) * 12 }}
              >
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className={`block transition ${
                    activeId === id
                      ? "text-black font-semibold"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {section.heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* ================= CONTENT ================= */}
      <article>
        {sections.map((section, i) => {
          const id = section.heading ? sectionIds[i] : "";

          return (
            <section key={i} className="mb-10">
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




export function Renderer_({ content }: { content: any }) {
  const sections = groupByHeading(content.blocks);

  return (
    <article className="max-w-3xl mx-auto px-6 py-10">
      {sections.map((section, i) => (
        <section key={i} className="mb-10">
          {/* HEADING */}
          {section.heading && (
            <h2
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
      ))}
    </article>
  );
}