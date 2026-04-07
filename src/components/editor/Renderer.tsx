// src/components/editor/Renderer.tsx
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