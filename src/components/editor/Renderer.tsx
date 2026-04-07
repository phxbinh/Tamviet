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
import { groupByHeading } from "@/lib/parseContent";

export function Renderer({ content }: { content: any }) {
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