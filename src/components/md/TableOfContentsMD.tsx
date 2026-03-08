"use client";
import { useEffect, useState } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

const slugify = (text: string) => {
  return text.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

export default function TableOfContents({ htmlContent }: { htmlContent: string }) {
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    if (!htmlContent) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2, h3'));
    
    const items = headings.map((heading) => ({
      text: heading.textContent || "",
      id: heading.id || slugify(heading.textContent || ""), 
      level: parseInt(heading.tagName[1])
    }));
    setToc(items);
  }, [htmlContent]);

  if (toc.length === 0) return null;

  return (
    <details 
      className="group w-full bg-card/40 backdrop-blur-md border border-border rounded-xl overflow-hidden transition-all duration-300"
      open={typeof window !== 'undefined' && window.innerWidth > 1024} // Tự mở trên Desktop
    >
      <summary className="list-none cursor-pointer p-4 flex items-center justify-between select-none hover:bg-neon-cyan/5 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-neon-cyan/10 text-neon-cyan">
            <ListTree size={16} />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">
            Mục lục <span className="text-neon-cyan/50 block text-[9px] tracking-normal font-medium italic">Navigation Area</span>
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className="text-muted-foreground transition-transform duration-300 group-open:rotate-180" 
        />
      </summary>

      <nav className="px-2 pb-4 pt-2 border-t border-border/30 bg-black/10">
        <ul className="space-y-1 relative">
          {/* Đường kẻ trang trí dọc */}
          <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-border/50" />
          
          {toc.map((item, idx) => (
            <li key={idx} style={{ paddingLeft: `${(item.level - 2) * 16}px` }}>
              <a 
                href={`#${item.id}`} 
                onClick={(e) => {
                  // Đóng dropdown trên mobile sau khi chọn link
                  if (window.innerWidth < 1024) {
                    e.currentTarget.closest('details')?.removeAttribute('open');
                  }
                }}
                className="group/item flex items-center gap-2 py-2 px-3 text-sm text-foreground/50 hover:text-neon-cyan hover:bg-neon-cyan/5 rounded-md transition-all relative overflow-hidden"
              >
                {/* Bullet point hiệu ứng */}
                <div className="w-1 h-1 rounded-full bg-border group-hover/item:bg-neon-cyan transition-colors" />
                <span className="truncate">{item.text}</span>
                
                {/* Hiệu ứng tia sáng khi hover */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-neon-cyan/10 to-transparent pointer-events-none" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
