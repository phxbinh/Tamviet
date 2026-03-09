// src/components/markdown/TableOfContents.tsx
"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, ListTree } from 'lucide-react'; // Đảm bảo đúng thư viện của bạn

interface TocProps {
  htmlContent: string;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export default function TableOfContents({ htmlContent, contentRef }: TocProps) {
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const lastScrollY = useRef(0);
  const accumulativeScrollUp = useRef(0);
  const accumulativeScrollDown = useRef(0);
  const isLock = useRef(false);

  // Cấu hình ngưỡng cuộn
  const SCROLL_UP_THRESHOLD = 60;   
  const SCROLL_DOWN_THRESHOLD = 100; 

  const toc = useMemo(() => {
    if (typeof window === 'undefined' || !htmlContent) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    return Array.from(doc.querySelectorAll('h2, h3')).map((heading, index) => ({
      text: heading.textContent?.trim() || "",
      id: heading.id || `toc-head-${index}`,
      level: parseInt(heading.tagName[1])
    }));
  }, [htmlContent]);

  useEffect(() => {
    if (!contentRef.current) return;

    // 1. Tìm container thực sự đang cuộn (thẻ div trong PublicShell)
    const scrollContainer = contentRef.current.closest('.overflow-y-auto') as HTMLElement;
    if (!scrollContainer) return;

    const allHeadings = contentRef.current.querySelectorAll('h2, h3');
    toc.forEach((item, index) => {
      if (allHeadings[index]) allHeadings[index].id = item.id;
    });

    const handleScroll = () => {
      // Dùng scrollTop của container thay vì window.scrollY
      const currentY = scrollContainer.scrollTop; 
      const diff = currentY - lastScrollY.current;

      // --- LOGIC ẨN/HIỆN TOC ---
      if (!isOpen) {
        if (diff > 0) { // Cuộn xuống
          accumulativeScrollDown.current += diff;
          accumulativeScrollUp.current = 0;
          if (accumulativeScrollDown.current > SCROLL_DOWN_THRESHOLD && currentY > 150) {
            setIsVisible(false);
          }
        } else { // Cuộn lên
          accumulativeScrollUp.current += Math.abs(diff);
          accumulativeScrollDown.current = 0;
          if (accumulativeScrollUp.current > SCROLL_UP_THRESHOLD || currentY < 50) {
            setIsVisible(true);
          }
        }
      }
      lastScrollY.current = currentY;

      // --- LOGIC HIGHLIGHT ---
      if (isLock.current) return;
      const headings = Array.from(allHeadings) as HTMLElement[];
      const scrollPos = currentY + 100; // Offset để khớp với điểm nhìn

      // Check chạm đáy trang
      if (scrollContainer.scrollHeight - scrollContainer.scrollTop <= scrollContainer.clientHeight + 50) {
        setActiveId(headings[headings.length - 1]?.id || "");
        return;
      }

      let currentId = "";
      for (const h of headings) {
        if (h.offsetTop <= scrollPos) {
          currentId = h.id;
        } else break;
      }
      setActiveId(currentId);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Lắng nghe trên Container
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toc, contentRef, isOpen]);

  const toggleMenu = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    isLock.current = true;
    setIsOpen(e.currentTarget.open);
    setTimeout(() => { isLock.current = false; }, 300);
  };

  if (toc.length === 0) return null;

  return (
    <div 
      className={`sticky top-4 z-30 w-full transition-all duration-500 ease-in-out 
      ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}
    >
      <details 
        ref={detailsRef}
        open={isOpen} 
        onToggle={toggleMenu}
        className="group w-full bg-card/80 backdrop-blur-md border border-border rounded-xl shadow-lg overflow-hidden"
      >
        <summary className="list-none cursor-pointer p-3 flex items-center justify-between hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-2">
            <ListTree size={16} className="text-neon-cyan" />
            <span className="text-xs font-bold uppercase tracking-wider">Mục lục</span>
          </div>
          <ChevronDown size={16} className="transition-transform duration-300 group-open:rotate-180" />
        </summary>

        <nav className="px-4 pb-4 pt-2 border-t border-border/50 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {toc.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li 
                  key={item.id} 
                  style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
                >
                  <a 
                    href={`#${item.id}`} 
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById(item.id);
                      if (target && contentRef.current) {
                        const container = contentRef.current.closest('.overflow-y-auto');
                        container?.scrollTo({
                          top: target.offsetTop - 120,
                          behavior: 'smooth'
                        });
                      }
                      setIsOpen(false);
                    }}
                    className={`block py-1 text-xs transition-colors ${
                      isActive ? 'text-neon-cyan font-medium' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.text}
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
