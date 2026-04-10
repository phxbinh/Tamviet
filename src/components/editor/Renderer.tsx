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
'use client'
import { groupByHeading } from "@/lib/parseContent";
import { useEffect, useState } from "react";


export function Renderer({ content }: { content: any }) {
  const sections = groupByHeading(content.blocks);
  const [activeId, setActiveId] = useState<string>("");

  const slugMap = new Map<string, number>();
  const toc: { id: string; text: string; level: number }[] = [];

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

            const id = slugify(section.heading.text);

            // build toc luôn tại đây
            toc.push({
              id,
              text: section.heading.text,
              level: section.heading.level,
            });

            return (
              <li
                key={id}
                style={{ marginLeft: (section.heading.level - 1) * 12 }}
              >
                {/*<a
                  href={`#${id}`}
                  className="text-gray-600 hover:text-black"
                >
                  {section.heading.text}
                </a> */}

<a
  href={`#${id}`}
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
          let id = "";

          if (section.heading) {
            id = slugify(section.heading.text);
          }

          return (
            <section key={i} className="mb-10">
              {/* HEADING */}
              {section.heading && (
                <h2
                  id={id} // 🔥 gắn id
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

              {/* CONTENT giữ nguyên */}
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