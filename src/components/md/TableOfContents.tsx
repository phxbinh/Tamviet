"use client";
import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ htmlContent }: { htmlContent: string }) {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2, h3'));
    
    const items = headings.map((heading, index) => {
      const text = heading.textContent || "";
      const id = text.toLowerCase().replace(/\s+/g, '-');
      // Gán ID thực tế vào DOM nếu cần cuộn
      return { id, text, level: parseInt(heading.tagName[1]) };
    });
    setToc(items);
  }, [htmlContent]);

  if (toc.length === 0) return null;

  return (
    <nav className="p-4 bg-card rounded-xl border border-border sticky top-24">
      <h4 className="font-bold mb-4 text-primary italic uppercase tracking-wider">Mục lục</h4>
      <ul className="space-y-2 text-sm">
        {toc.map((item) => (
          <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 16}px` }}>
            <a href={`#${item.id}`} className="hover:text-neon-cyan transition-colors text-foreground/70">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
