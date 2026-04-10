// src/components/editor/TOC.tsx
"use client";
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

interface TOCProps {
  sections: any[];
  sectionIds: string[];
  activeId: string;
  contentRef: React.RefObject<HTMLDivElement | null>; // Thêm Ref của bài viết vào đây
}

export function TableOfContents({ sections, sectionIds, activeId, contentRef }: TOCProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const tocContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY; 
      const diff = currentY - lastScrollY.current;
      if (!isOpen) {
        if (diff > 80 && currentY > 200) setIsVisible(false);
        else if (diff < -40 || currentY < 100) setIsVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    
    // Kiểm tra nếu có cả target và container chứa nội dung
    if (target && contentRef.current) {
      const HEADER_HEIGHT = 64; 
      const tocHeight = tocContainerRef.current?.getBoundingClientRect().height || 0;
      const isMobile = window.innerWidth < 1024;
      
      // Tính toán khoảng cách cuộn
      const offset = isMobile ? (HEADER_HEIGHT + tocHeight + 20) : 100;

      // Tính vị trí của target so với viewport và cộng với scroll hiện tại
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      
      window.scrollTo({
        top: targetPosition - offset,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  return (
    <aside 
      className={`sticky z-30 w-full transition-all duration-500 
      ${isVisible ? 'top-16 opacity-100' : '-top-20 opacity-0 pointer-events-none'} 
      lg:top-24 lg:opacity-100 lg:pointer-events-auto`}
    >
      <div ref={tocContainerRef} className="w-full bg-white/90 backdrop-blur-xl border border-gray-200 lg:border-none rounded-2xl shadow-xl lg:shadow-none overflow-hidden">
        {/* Nút điều khiển Mobile */}
        <button onClick={() => setIsOpen(!isOpen)} className="w-full p-3.5 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <ListTree size={18} className="text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest">Mục lục</span>
          </div>
          <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Danh sách Mục lục */}
        <div className={`grid transition-all duration-500 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] lg:grid-rows-[1fr]'}`}>
          <nav className="overflow-hidden">
            <div className="px-4 pb-6 pt-2 border-t border-gray-100 lg:border-none lg:px-0 lg:pt-0 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <ul className="space-y-1">
                {sections.map((section, idx) => {
                  const id = sectionIds[idx];
                  if (!section.heading) return null;
                  return (
                    <li key={id} style={{ paddingLeft: `${(section.heading.level - 1) * 12}px` }}>
                      <a 
                        href={`#${id}`}
                        onClick={(e) => { e.preventDefault(); scrollToSection(id); }}
                        className={`group flex items-center gap-3 py-2 px-3 text-[13.5px] rounded-xl relative transition-all ${activeId === id ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full border ${activeId === id ? 'bg-blue-600 border-blue-600 shadow-[0_0_8px_blue]' : 'bg-white border-gray-300'}`} />
                        <span className="truncate whitespace-normal">{section.heading.text}</span>
                        {activeId === id && <div className="absolute inset-0 bg-blue-50/50 border-l-2 border-blue-600 -z-10 rounded-xl" />}
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
