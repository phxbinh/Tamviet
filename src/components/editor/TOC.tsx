// src/components/editor/TOC.tsx
// src/components/editor/TOC.tsx
"use client";
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

export function TableOfContents({ sections, sectionIds, activeId, contentRef }: any) {
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
