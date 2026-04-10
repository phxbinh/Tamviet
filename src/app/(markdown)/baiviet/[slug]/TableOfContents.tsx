// src/components/editor/TableOfContents.tsx
"use client";
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

interface TOCProps {
  sections: any[];
  sectionIds: string[];
  activeId: string;
}

export function TableOfContents({ sections, sectionIds, activeId }: TOCProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  // Ref để đo chiều cao của Menu nhằm tính toán khoảng cách cuộn (offset)
  const containerRef = useRef<HTMLDivElement>(null);
  
  const lastScrollY = useRef(0);
  const accumulativeScrollUp = useRef(0);
  const accumulativeScrollDown = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY; 
      const diff = currentY - lastScrollY.current;

      if (!isOpen) {
        if (diff > 0) {
          accumulativeScrollDown.current += diff;
          accumulativeScrollUp.current = 0;
          if (accumulativeScrollDown.current > 80 && currentY > 200) {
            setIsVisible(false);
          }
        } else {
          accumulativeScrollUp.current += Math.abs(diff);
          accumulativeScrollDown.current = 0;
          if (accumulativeScrollUp.current > 40 || currentY < 100) {
            setIsVisible(true);
          }
        }
      }
      lastScrollY.current = currentY;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // HÀM FIX LỖI CUỘN TẠI ĐÂY
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      // 1. Lấy chiều cao của Header cố định (thường là 64px)
      const HEADER_HEIGHT = 64; 
      
      // 2. Lấy chiều cao của thanh TOC khi đang đóng (để tránh bị che tiêu đề)
      const tocHeight = containerRef.current?.getBoundingClientRect().height || 0;
      
      // 3. Tính toán tổng Offset
      // Trên mobile: Header + TOC Bar
      // Trên desktop: Header + một chút khoảng trống
      const isMobile = window.innerWidth < 1024;
      const totalOffset = isMobile ? (HEADER_HEIGHT + tocHeight + 10) : (HEADER_HEIGHT + 20);

      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      
      window.scrollTo({
        top: elementPosition - totalOffset,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  if (sections.length === 0) return null;

  return (
    <aside 
      className={`sticky z-30 w-full transition-all duration-500 ease-in-out lg:translate-y-0 lg:opacity-100
      ${isVisible ? 'top-16 opacity-100' : '-top-20 opacity-0 pointer-events-none'}
      lg:top-24 lg:block`}
    >
      <div 
        ref={containerRef} // Đã gán Ref vào container chính
        className="w-full bg-white/90 backdrop-blur-xl border border-gray-200 lg:border-none rounded-2xl shadow-xl lg:shadow-none overflow-hidden"
      >
        {/* Nút bấm điều khiển - Chỉ hiện trên mobile */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-all duration-300 lg:hidden"
        >
          <div className="flex items-center gap-2">
            <ListTree size={18} className="text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-700">Mục lục bài viết</span>
          </div>
          <ChevronDown 
            size={18} 
            className={`text-gray-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Tiêu đề mục lục - Chỉ hiện trên desktop */}
        <div className="hidden lg:block font-bold mb-4 text-[11px] uppercase tracking-[0.2em] text-gray-400">
          Nội dung chính
        </div>

        {/* Danh sách xổ xuống */}
        <div 
          className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] 
          ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 lg:grid-rows-[1fr] lg:opacity-100'}`}
        >
          <nav className="overflow-hidden">
            <div className={`
              px-4 pb-6 pt-2 border-t border-gray-100 lg:border-none lg:px-0 lg:pt-0 max-h-[60vh] overflow-y-auto custom-scrollbar 
              transition-all duration-700 
              ${isOpen ? 'blur-0 translate-y-0' : 'blur-md -translate-y-4 lg:blur-0 lg:translate-y-0'}
            `}>
              <ul className="space-y-1">
                {sections.map((section, idx) => {
                  if (!section.heading) return null;
                  const id = sectionIds[idx];
                  const isActive = activeId === id;

                  return (
                    <li key={`${id}-${idx}`} style={{ paddingLeft: `${(section.heading.level - 1) * 12}px` }}>
                      <a 
                        href={`#${id}`} 
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(id);
                        }}
                        className={`
                          group flex items-center gap-3 py-2 px-3 text-[13.5px] transition-all duration-300 rounded-xl relative
                          ${isActive ? 'text-blue-600 font-bold translate-x-1' : 'text-gray-500 hover:text-gray-900'}
                        `}
                      >
                        <div className="relative flex items-center justify-center">
                          <span className={`
                            w-1.5 h-1.5 rounded-full border transition-all duration-500
                            ${isActive ? 'border-blue-600 bg-blue-600 scale-125 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'border-gray-300 bg-white'}
                          `} />
                        </div>
                        <span className="truncate whitespace-normal leading-snug">{section.heading.text}</span>
                        {isActive && (
                          <div className="absolute inset-0 bg-blue-50/50 rounded-xl border-l-2 border-blue-600 -z-10" />
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
    </aside>
  );
}
