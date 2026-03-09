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
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const accumulativeScrollUp = useRef(0);
  const accumulativeScrollDown = useRef(0);
  const isLock = useRef(false);

  // Cấu hình ngưỡng cuộn
  const SCROLL_UP_THRESHOLD = 40;   
  const SCROLL_DOWN_THRESHOLD = 40; 

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

    const scrollContainer = contentRef.current.closest('.overflow-y-auto') as HTMLElement;
    if (!scrollContainer) return;

    const allHeadings = contentRef.current.querySelectorAll('h2, h3');
    toc.forEach((item, index) => {
      if (allHeadings[index]) allHeadings[index].id = item.id;
    });

    const handleScroll = () => {
      const currentY = scrollContainer.scrollTop; 
      const diff = currentY - lastScrollY.current;

      if (!isOpen) {
        if (diff > 0) {
          accumulativeScrollDown.current += diff;
          accumulativeScrollUp.current = 0;
          if (accumulativeScrollDown.current > SCROLL_DOWN_THRESHOLD && currentY > 150) {
            setIsVisible(false);
          }
        } else {
          accumulativeScrollUp.current += Math.abs(diff);
          accumulativeScrollDown.current = 0;
          if (accumulativeScrollUp.current > SCROLL_UP_THRESHOLD || currentY < 50) {
            setIsVisible(true);
          }
        }
      }
      lastScrollY.current = currentY;

      if (isLock.current) return;
      const headings = Array.from(allHeadings) as HTMLElement[];
      const scrollPos = currentY + 100;

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
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toc, contentRef, isOpen]);

  if (toc.length === 0) return null;

  return (
    <div 
      className={`sticky top-4 z-30 w-full transition-all duration-500 ease-in-out 
      ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}
    >
      <div 
        ref={containerRef}
        className="w-full bg-card/70 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header điều khiển (Thay thế summary) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 flex items-center justify-between hover:bg-accent/30 transition-all duration-300"
        >
          <div className="flex items-center gap-2">
            <ListTree size={16} className="text-neon-cyan animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/80">Mục lục</span>
          </div>
          <ChevronDown 
            size={16} 
            className={`text-muted-foreground transition-transform duration-500 ease-out ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Nội dung trượt mượt mà với hiệu ứng Blur */}
        <div 
          className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <nav className="overflow-hidden bg-gradient-to-b from-transparent to-accent/5">
            <div className={`px-4 pb-5 pt-2 border-t border-border/30 max-h-[60vh] overflow-y-auto custom-scrollbar transition-all duration-700 delay-100 ${isOpen ? 'blur-0 translate-y-0' : 'blur-md -translate-y-4'}`}>
              <ul className="space-y-1">
{/*
                {toc.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <li 
                      key={item.id} 
                      style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
                      className="relative"
                    >
                      <a 
                        href={`#${item.id}`} 
                        onClick={(e) => {
                          e.preventDefault();
                          const target = document.getElementById(item.id);
                          if (target && contentRef.current) {
                            const container = contentRef.current.closest('.overflow-y-auto');
                            const tocHeight = containerRef.current?.getBoundingClientRect().height || 0;
                            const scrollTarget = target.offsetTop - (tocHeight + 20);

                            container?.scrollTo({
                              top: scrollTarget,
                              behavior: 'smooth'
                            });
                          }
                          setIsOpen(false);
                        }}
                        className={`group block py-1.5 text-[13px] transition-all duration-300 ${
                          isActive 
                            ? 'text-neon-cyan font-semibold translate-x-1' 
                            : 'text-muted-foreground hover:text-foreground hover:translate-x-1'
                        }`}
                      >
                        {item.text}
                      </a>
                    </li>
                  );
                })}
*/}
       {toc.map((item, idx) => {
              const isActive = activeId === item.id;
              return (
                <li key={`${item.id}-${idx}`} style={{ paddingLeft: `${(item.level - 2) * 20}px` }} className="relative z-10">
                  <a 
                    href={`#${item.id}`} 
                    onClick={(e) => {
                          e.preventDefault();
                          const target = document.getElementById(item.id);
                          if (target && contentRef.current) {
                            const container = contentRef.current.closest('.overflow-y-auto');
                            const tocHeight = containerRef.current?.getBoundingClientRect().height || 0;
                            const scrollTarget = target.offsetTop - (tocHeight + 20);

                            container?.scrollTo({
                              top: scrollTarget,
                              behavior: 'smooth'
                            });
                          }
                          setIsOpen(false);
                        }}
                    className={`
                      group/item flex items-center gap-4 py-2 px-4 text-[13px] transition-all duration-300 rounded-xl relative
                      ${isActive ? 'text-neon-cyan font-bold translate-x-1' : 'text-foreground/50 hover:text-foreground/80'}
                    `}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`
                        w-2 h-2 rounded-full border-2 transition-all duration-500 bg-background
                        ${isActive ? 'border-neon-cyan bg-neon-cyan scale-125 shadow-[0_0_8px_#06b6d4]' : 'border-border'}
                      `} />
                    </div>
                    <span className="truncate whitespace-normal leading-snug">{item.text}</span>
                    {isActive && (
                      <div className="absolute inset-0 bg-neon-cyan/5 rounded-xl border-l-2 border-neon-cyan -z-10" />
                    )}
                  </a>
                </li>
              );
            })}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}


/*
       {toc.map((item, idx) => {
              const isActive = activeId === item.id;
              return (
                <li key={`${item.id}-${idx}`} style={{ paddingLeft: `${(item.level - 2) * 20}px` }} className="relative z-10">
                  <a 
                    href={`#${item.id}`} 
                    onClick={() => { if (window.innerWidth < 1024) setIsOpen(false); }}
                    className={`
                      group/item flex items-center gap-4 py-2 px-4 text-[13px] transition-all duration-300 rounded-xl relative
                      ${isActive ? 'text-neon-cyan font-bold translate-x-1' : 'text-foreground/50 hover:text-foreground/80'}
                    `}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`
                        w-2 h-2 rounded-full border-2 transition-all duration-500 bg-background
                        ${isActive ? 'border-neon-cyan bg-neon-cyan scale-125 shadow-[0_0_8px_#06b6d4]' : 'border-border'}
                      `} />
                    </div>
                    <span className="truncate whitespace-normal leading-snug">{item.text}</span>
                    {isActive && (
                      <div className="absolute inset-0 bg-neon-cyan/5 rounded-xl border-l-2 border-neon-cyan -z-10" />
                    )}
                  </a>
                </li>
              );
            })}


*/






