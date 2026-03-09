"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

interface TocProps {
  htmlContent: string;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export default function TableOfContents({ htmlContent, contentRef }: TocProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  
  // Khóa logic highlight khi đang đóng/mở menu để tránh nhảy loạn
  const isLock = useRef(false);

  const toc = useMemo(() => {
    if (typeof window === 'undefined' || !htmlContent) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2, h3'));
    return headings.map((heading, index) => ({
      text: heading.textContent?.trim() || "",
      id: heading.id || `toc-head-${index}`,
      level: parseInt(heading.tagName[1])
    }));
  }, [htmlContent]);

  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    isLock.current = true;
    setIsOpen(e.currentTarget.open);
    // Đợi layout ổn định sau 400ms mới cho phép highlight lại
    setTimeout(() => { isLock.current = false; }, 400);
  };

  useEffect(() => {
    if (!contentRef.current) return;
    
    // Đồng bộ ID giữa Menu và Nội dung bài viết
    const allHeadings = contentRef.current.querySelectorAll('h2, h3');
    toc.forEach((item, index) => {
      if (allHeadings[index]) allHeadings[index].id = item.id;
    });

    if (window.innerWidth > 1024) setIsOpen(true);

    const observer = new IntersectionObserver(
      (entries) => {
        if (isLock.current) return;

        // Tìm heading gần với đỉnh màn hình nhất (vùng đọc chính)
        const visibleEntry = entries.find(entry => 
          entry.isIntersecting && 
          entry.boundingClientRect.top > -20 && 
          entry.boundingClientRect.top < 250
        );

        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { 
        rootMargin: '-80px 0px -70% 0px', 
        threshold: [0, 1] 
      }
    );

    allHeadings.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [toc, contentRef]);

  if (toc.length === 0) return null;

  return (
    <div className="w-full my-4">
      <details 
        ref={detailsRef}
        open={isOpen}
        onToggle={handleToggle}
        className="group w-full bg-card/60 backdrop-blur-xl border border-border rounded-2xl overflow-hidden shadow-xl"
      >
        <summary className="list-none cursor-pointer p-4 flex items-center justify-between select-none hover:bg-neon-cyan/5 focus:outline-none appearance-none [&::-webkit-details-marker]:hidden">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <ListTree size={20} />
            </div>
            <span className="text-sm font-bold tracking-wider text-foreground/90 uppercase">Mục lục</span>
          </div>
          <ChevronDown size={18} className="text-muted-foreground transition-transform duration-500 group-open:rotate-180" />
        </summary>

        <nav className="px-4 pb-6 pt-2 border-t border-border/30 bg-black/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <ul className="space-y-1 relative list-none m-0 p-0 pt-2">
            
            {/* Đường kẻ dọc tĩnh (Không chạy progress) */}
            <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-border/20 rounded-full" />
            
            {toc.map((item, idx) => {
              const isActive = activeId === item.id;
              return (
                <li 
                  key={`${item.id}-${idx}`} 
                  style={{ paddingLeft: `${(item.level - 2) * 20}px` }}
                  className="relative z-10"
                >
                  <a 
                    href={`#${item.id}`} 
                    onClick={() => {
                      if (window.innerWidth < 1024) setIsOpen(false);
                    }}
                    className={`
                      group/item flex items-center gap-4 py-2 px-4 text-[13px] transition-all duration-300 rounded-xl relative
                      ${isActive 
                        ? 'text-neon-cyan font-bold translate-x-1' 
                        : 'text-foreground/50 hover:text-foreground/80 hover:bg-white/5'}
                    `}
                  >
                    {/* Dot indicator tĩnh */}
                    <div className="relative flex items-center justify-center">
                      <span className={`
                        w-2 h-2 rounded-full border-2 transition-all duration-500 bg-background
                        ${isActive ? 'border-neon-cyan scale-125 bg-neon-cyan shadow-[0_0_8px_#06b6d4]' : 'border-border'}
                      `} />
                    </div>

                    <span className="truncate">{item.text}</span>
                    
                    {/* Nền highlight khi active */}
                    {isActive && (
                      <div className="absolute inset-0 bg-neon-cyan/5 rounded-xl border-l-2 border-neon-cyan -z-10" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </details>
    </div>
  );
}
