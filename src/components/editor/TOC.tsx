// src/components/editor/TOC.tsx
// src/components/editor/TOC.tsx
"use client";
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';


// src/components/editor/TOC.tsx
/*
"use client";
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';
*/

interface TOCProps {
  sections: any[];
  sectionIds: string[];
  activeId: string;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export function TableOfContents({ sections, sectionIds, activeId, contentRef }: TOCProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const tocContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const accumulativeScrollUp = useRef(0);
  const accumulativeScrollDown = useRef(0);

  const SCROLL_UP_THRESHOLD = 80;   
  const SCROLL_DOWN_THRESHOLD = 80; 

  useEffect(() => {
    // Tìm div cha có class overflow-y-auto trong MarkdownShell
    const scrollContainer = contentRef.current?.closest('.overflow-y-auto');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentY = scrollContainer.scrollTop; 
      const diff = currentY - lastScrollY.current;

      if (!isOpen) {
        if (diff > 0) { // Đang cuộn xuống
          accumulativeScrollDown.current += diff;
          accumulativeScrollUp.current = 0;
          // Ẩn menu khi cuộn xuống đủ ngưỡng và đã cuộn qua 150px
          if (accumulativeScrollDown.current > SCROLL_DOWN_THRESHOLD && currentY > 150) {
            setIsVisible(false);
          }
        } else { // Đang cuộn lên
          accumulativeScrollUp.current += Math.abs(diff);
          accumulativeScrollDown.current = 0;
          // Hiện menu khi cuộn lên đủ ngưỡng hoặc về đầu trang
          if (accumulativeScrollUp.current > SCROLL_UP_THRESHOLD || currentY < 50) {
            setIsVisible(true);
          }
        }
      }
      lastScrollY.current = currentY;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (tocContainerRef.current && !tocContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, contentRef]);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    const scrollContainer = contentRef.current?.closest('.overflow-y-auto');

    if (target && scrollContainer) {
      const HEADER_HEIGHT = 64; 
      // Lấy chiều cao của thanh TOC khi đang đóng
      const tocHeight = tocContainerRef.current?.getBoundingClientRect().height || 0;
      const isMobile = window.innerWidth < 1024;
      
      // Tính toán khoảng cách cuộn để tiêu đề nằm dưới Header và TOC
      const offset = isMobile ? (HEADER_HEIGHT + tocHeight + 10) : (HEADER_HEIGHT + 20);

      // Sử dụng target.offsetTop là chuẩn nhất khi cuộn trong container có relative/absolute
      const scrollTarget = target.offsetTop - offset;

      scrollContainer.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  if (sections.length === 0) return null;

  return (
    <aside 
      className={`sticky top-2 z-30 w-full transition-all duration-500 ease-in-out 
      ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-50 pointer-events-none'}`}
    >
      <div 
        ref={tocContainerRef}
        className="w-full bg-white/90 backdrop-blur-xl border border-gray-200 lg:border-none rounded-xl shadow-xl lg:shadow-none overflow-hidden"
      >
        {/* Header điều khiển Mobile */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 flex items-center justify-between hover:bg-gray-50 lg:hidden"
        >
          <div className="flex items-center gap-2">
            <ListTree size={16} className="text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-700">Mục lục</span>
          </div>
          <ChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Danh sách Mục lục */}
        <div 
          className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 lg:grid-rows-[1fr] lg:opacity-100'
          }`}
        >
          <nav className="overflow-hidden">
            <div className={`
              px-4 pb-5 pt-2 border-t border-gray-100 lg:border-none lg:px-0 lg:pt-0 max-h-[60vh] overflow-y-auto custom-scrollbar 
              transition-all duration-700 ${isOpen ? 'blur-0 translate-y-0' : 'blur-md -translate-y-4 lg:blur-0 lg:translate-y-0'}
            `}>
              <ul className="space-y-1">
                {sections.map((section, idx) => {
                  if (!section.heading) return null;
                  const id = sectionIds[idx];
                  const isActive = activeId === id;

                  return (
                    <li key={`${id}-${idx}`} style={{ paddingLeft: `${(section.heading.level - 1) * 12}px` }} className="relative z-10">
                      <a 
                        href={`#${id}`} 
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(id);
                        }}
                        className={`
                          group flex items-center gap-3 py-2 px-3 text-[13px] transition-all duration-300 rounded-xl relative
                          ${isActive ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'}
                        `}
                      >
                        <span className={`
                          w-1.5 h-1.5 rounded-full border transition-all duration-500
                          ${isActive ? 'border-blue-600 bg-blue-600 shadow-[0_0_8px_#2563eb]' : 'border-gray-300 bg-white'}
                        `} />
                        <span className="truncate whitespace-normal leading-snug">{section.heading.text}</span>
                        {isActive && (
                          <div className="absolute inset-0 bg-blue-50/50 border-l-2 border-blue-600 -z-10 rounded-xl" />
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
    </aside>
  );
}



export function TableOfContents_({ sections, sectionIds, activeId, contentRef }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const tocContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Lắng nghe scroll của div cha thay vì window
    const scrollContainer = contentRef.current?.closest('.overflow-y-auto');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentY = scrollContainer.scrollTop;
      const diff = currentY - lastScrollY.current;
      if (!isOpen) {
        if (diff > 80 && currentY > 200) setIsVisible(false);
        else if (diff < -40 || currentY < 100) setIsVisible(true);
      }
      lastScrollY.current = currentY;
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [isOpen, contentRef]);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    const scrollContainer = contentRef.current?.closest('.overflow-y-auto');

    if (target && scrollContainer) {
      const HEADER_HEIGHT = 64; 
      const tocHeight = tocContainerRef.current?.getBoundingClientRect().height || 0;
      const isMobile = window.innerWidth < 1024;
      
      const offset = isMobile ? (HEADER_HEIGHT + tocHeight + 20) : 40;

      // TÍNH TOÁN: Vị trí của target so với container đang scroll
      const targetTop = target.offsetTop; 
      
      scrollContainer.scrollTo({
        top: targetTop - offset,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  return (
    <aside className={`sticky z-30 w-full transition-all duration-500 
      ${isVisible ? 'top-0 lg:top-4 opacity-100' : '-top-20 opacity-0'} 
      lg:block`}>
      <div ref={tocContainerRef} className="bg-white/90 backdrop-blur-xl border border-border rounded-2xl shadow-lg lg:shadow-none">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full p-3 flex justify-between items-center lg:hidden">
           <div className="flex items-center gap-2 font-bold text-xs uppercase"><ListTree size={16}/> Mục lục</div>
           <ChevronDown size={16} className={`${isOpen ? 'rotate-180' : ''} transition-transform`}/>
        </button>
        <div className={`grid transition-all duration-500 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] lg:grid-rows-[1fr]'}`}>
          <nav className="overflow-hidden px-4 pb-4 lg:p-0">
             <ul className="space-y-1 pt-2 lg:pt-0">
                {sections.map((s: any, i: number) => (
                  <li key={i} style={{ paddingLeft: (s.heading.level - 1) * 12 }}>
                    <a 
                      href={`#${sectionIds[i]}`}
                      onClick={(e) => { e.preventDefault(); scrollToSection(sectionIds[i]); }}
                      className={`block py-1 text-sm ${activeId === sectionIds[i] ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
                    >
                      {s.heading.text}
                    </a>
                  </li>
                ))}
             </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}
