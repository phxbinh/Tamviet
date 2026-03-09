"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

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

  // Cấu hình ngưỡng cuộn để tăng độ mượt
  const SCROLL_UP_THRESHOLD = 40;   // Cuộn lên 40px mới hiện
  const SCROLL_DOWN_THRESHOLD = 80; // Cuộn xuống 50px mới ẩn

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

    const allHeadings = contentRef.current.querySelectorAll('h2, h3');
    toc.forEach((item, index) => {
      if (allHeadings[index]) allHeadings[index].id = item.id;
    });

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      // --- LOGIC ẨN/HIỆN VỚI NGƯỠNG ĐỆM ---
      if (!isOpen) {
        if (diff > 0) {
          // Đang cuộn xuống
          accumulativeScrollDown.current += diff;
          accumulativeScrollUp.current = 0; // Reset bộ tích lũy cuộn lên
          
          if (accumulativeScrollDown.current > SCROLL_DOWN_THRESHOLD && currentY > 200) {
            setIsVisible(false);
          }
        } else {
          // Đang cuộn lên
          accumulativeScrollUp.current += Math.abs(diff);
          accumulativeScrollDown.current = 0; // Reset bộ tích lũy cuộn xuống
          
          if (accumulativeScrollUp.current > SCROLL_UP_THRESHOLD || currentY < 50) {
            setIsVisible(true);
          }
        }
      }
      lastScrollY.current = currentY;

      // --- LOGIC HIGHLIGHT ---
      if (isLock.current) return;
      const headings = Array.from(allHeadings) as HTMLElement[];
      const scrollPos = currentY + 120;

      if (window.innerHeight + currentY >= document.documentElement.scrollHeight - 100) {
        setActiveId(headings[headings.length - 1]?.id || "");
        return;
      }

      let currentId = "";
      for (const h of headings) {
        if (h.offsetTop <= scrollPos) currentId = h.id;
        else break;
      }
      setActiveId(currentId);
    };

    // --- LOGIC CLICK OUTSIDE (Đóng menu khi nhấn ngoài) ---
    const handleClickOutside = (event: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toc, contentRef, isOpen, activeId]);

  const toggleMenu = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const target = e.currentTarget;
    isLock.current = true;
    setIsOpen(target.open);
    // Timeout để layout ổn định sau khi đóng/mở
    setTimeout(() => { isLock.current = false; }, 400);
  };

  if (toc.length === 0) return null;

  return (
    <div className={`w-full transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
      <details 
        ref={detailsRef}
        open={isOpen} 
        onToggle={toggleMenu}
        className="group w-full bg-card/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <summary className="list-none cursor-pointer p-4 flex items-center justify-between hover:bg-neon-cyan/5 focus:outline-none">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
              <ListTree size={18} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-foreground/80">Mục lục</span>
          </div>
          <ChevronDown size={18} className="text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
        </summary>

        <nav className="px-4 pb-6 pt-2 border-t border-border/30 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 relative list-none m-0 p-0">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-border/20" />
            {toc.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 16}px` }} className="relative z-10 py-1">
                  <a 
                    href={`#${item.id}`} 
                    onClick={() => { if (window.innerWidth < 1024) setIsOpen(false); }}
                    className={`flex items-center gap-3 py-1.5 px-3 text-[13px] transition-all rounded-lg ${isActive ? 'text-neon-cyan font-bold translate-x-1' : 'text-foreground/50 hover:text-foreground/80'}`}
                  >
                    <span className={`w-2 h-2 rounded-full border-2 transition-colors ${isActive ? 'border-neon-cyan bg-neon-cyan shadow-[0_0_8px_#06b6d4]' : 'border-border'}`} />
                    <span className="truncate whitespace-normal leading-snug">{item.text}</span>
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
