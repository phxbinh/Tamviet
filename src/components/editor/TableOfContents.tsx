// src/components/editor/TableOfContents.tsx
'use client';

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface TOCProps {
  sections: any[];
  sectionIds: string[];
  activeId: string;
}

export function TableOfContents({ sections, sectionIds, activeId }: TOCProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
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

  return (
    <aside className="sticky top-0 lg:top-20 z-20 bg-white/95 backdrop-blur lg:bg-transparent -mx-6 px-6 py-3 lg:p-0 border-b lg:border-0 h-fit transition-all duration-300">
      
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
