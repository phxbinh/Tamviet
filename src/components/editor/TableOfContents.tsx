// src/components/editor/TableOfContents.tsx
/*
'use client';

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface TOCProps {
  sections: any[];
  sectionIds: string[];
  activeId: string;
}
*/

// src/components/editor/TableOfContents.tsx
"use client";
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

interface TOCProps {
  sections: any[];
  sectionIds: string[];
  activeId: string;
}

// src/components/editor/TableOfContents.tsx
/*
"use client";
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

interface TOCProps {
  sections: any[];
  sectionIds: string[];
  activeId: string;
}*/

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







export function TableOfContents_x_({ sections, sectionIds, activeId }: TOCProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const accumulativeScrollUp = useRef(0);
  const accumulativeScrollDown = useRef(0);

  // Cấu hình ngưỡng cuộn để ẩn/hiện TOC trên mobile
  const SCROLL_UP_THRESHOLD = 40;   
  const SCROLL_DOWN_THRESHOLD = 80; 

  useEffect(() => {
    const handleScroll = () => {
      // Vì là sticky component, ta theo dõi scroll của toàn window
      const currentY = window.scrollY; 
      const diff = currentY - lastScrollY.current;

      if (!isOpen) { // Chỉ ẩn/hiện khi menu đang đóng
        if (diff > 0) {
          accumulativeScrollDown.current += diff;
          accumulativeScrollUp.current = 0;
          if (accumulativeScrollDown.current > SCROLL_DOWN_THRESHOLD && currentY > 200) {
            setIsVisible(false);
          }
        } else {
          accumulativeScrollUp.current += Math.abs(diff);
          accumulativeScrollDown.current = 0;
          if (accumulativeScrollUp.current > SCROLL_UP_THRESHOLD || currentY < 100) {
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

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const tocHeight = containerRef.current?.getBoundingClientRect().height || 0;
      // Offset cho mobile (Header + TOC) và Desktop (Header)
      const isMobile = window.innerWidth < 1024;
      const offset = isMobile ? (tocHeight + 80) : 100;

      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  if (sections.length === 0) return null;

  return (
    <aside 
      className={`sticky top-4 lg:top-24 z-30 w-full transition-all duration-500 ease-in-out lg:translate-y-0 lg:opacity-100
      ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}
    >
      <div 
        ref={containerRef}
        className="w-full bg-white/80 backdrop-blur-xl border border-gray-200 lg:border-none rounded-2xl shadow-xl lg:shadow-none overflow-hidden"
      >
        {/* Header điều khiển */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50/50 transition-all duration-300 lg:hidden"
        >
          <div className="flex items-center gap-2">
            <ListTree size={18} className="text-blue-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-700">Mục lục</span>
          </div>
          <ChevronDown 
            size={18} 
            className={`text-gray-400 transition-transform duration-500 ease-out ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        <div className="hidden lg:block font-bold mb-4 text-[11px] uppercase tracking-[0.2em] text-gray-400">
          Nội dung chính
        </div>

        {/* Nội dung trượt mượt mà */}
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
                  const level = section.heading.level;

                  return (
                    <li key={`${id}-${idx}`} style={{ paddingLeft: `${(level - 1) * 12}px` }} className="relative z-10">
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
                            ${isActive ? 'border-blue-600 bg-blue-600 scale-125 shadow-[0_0_8px_rgba(37,99,235,0.5)]' : 'border-gray-300 bg-white'}
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </aside>
  );
}






// src/components/editor/TableOfContents.tsx
export function TableOfContents_({ sections, sectionIds, activeId }: TOCProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection_ = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Khoảng cách bù trừ cho Header và TOC sticky
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };


const scrollToSection = (id: string) => {
    setIsOpen(false); // Đóng menu trước khi cuộn
    
    const element = document.getElementById(id);
    if (element) {
      // TÍNH TOÁN OFFSET:
      // Header: 64px
      // TOC Mobile Bar: ~56px
      // Padding thêm: 20px
      // Tổng cộng khoảng 140px cho mobile, và 80px cho desktop
      const isMobile = window.innerWidth < 1024;
      const offset = isMobile ? 140 : 80; 

      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };


  return (
    <aside className="sticky top-16 lg:top-20 z-20 bg-white/95 backdrop-blur lg:bg-transparent -mx-6 px-6 py-3 lg:p-0 border-b lg:border-0 h-fit transition-all duration-300">
      
      {/* Nút bấm Dropdown Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full lg:hidden bg-gray-50 hover:bg-gray-100 p-3 rounded-xl border border-gray-200 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-bold text-xs uppercase tracking-widest text-gray-600">Mục lục bài viết</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Danh sách Mục lục với hiệu ứng đóng mở mượt */}
      <div 
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          lg:max-h-none lg:opacity-100 lg:mt-0
          ${isOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0 lg:block"}
        `}
      >
        <div className="hidden lg:block font-bold mb-4 text-[11px] uppercase tracking-[0.2em] text-gray-400">
          Nội dung chính
        </div>

        <ul className="space-y-1 max-h-[60vh] overflow-y-auto lg:max-h-none pr-2 py-2 lg:py-0 custom-scrollbar">
          {sections.map((section, i) => {
            if (!section.heading) return null;
            const id = sectionIds[i];
            const isActive = activeId === id;

            return (
              <li 
                key={id} 
                className="transition-all duration-200"
                style={{ marginLeft: (section.heading.level - 1) * 12 }}
              >
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(id);
                  }}
                  className={`
                    relative block py-1.5 text-[14px] transition-colors
                    ${isActive 
                      ? "text-blue-600 font-semibold" 
                      : "text-gray-500 hover:text-gray-900"}
                  `}
                >
                  {isActive && (
                    <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-600 rounded-full hidden lg:block" />
                  )}
                  {section.heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
