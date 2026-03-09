"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

 function TableOfContents__({ htmlContent, contentRef }: { 
  htmlContent: string, 
  contentRef: React.RefObject<HTMLDivElement> // Thêm Ref của vùng bài viết
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [activeId, setActiveId] = useState<string>("");
  const [readProgress, setReadProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 1. Logic tính toán tiến trình "Cô lập"
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const rect = element.getBoundingClientRect();
      const elementHeight = element.offsetHeight;
      
      // Tính xem người dùng đã cuộn qua bao nhiêu px tính từ đầu bài viết
      // rect.top âm nghĩa là đã cuộn qua đầu bài viết
      const scrolled = -rect.top; 
      const viewportHeight = window.innerHeight;
      
      // Tính % dựa trên chiều cao cố định của bài viết
      let progress = (scrolled / (elementHeight - viewportHeight)) * 100;
      
      // Giới hạn từ 0 - 100
      progress = Math.max(0, Math.min(100, progress));
      setReadProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [contentRef]);

  // Các logic khác (TOC extraction, Click Outside, Scroll Spy) giữ nguyên...
  // (Tôi sẽ lược bớt để tập trung vào phần hiển thị đã fix)

  return (
    <div className="w-full my-8">
      <details 
        ref={detailsRef}
        open={isOpen}
        onToggle={(e) => setIsOpen(e.currentTarget.open)}
        className="group w-full bg-card/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500"
      >
        <summary className="list-none cursor-pointer p-5 flex items-center justify-between focus:outline-none">
          <div className="flex items-center gap-4">
             {/* Icon và Progress Bar mini ở đây */}
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Tiến trình đọc bài</span>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500 transition-all duration-300 shadow-[0_0_8px_#06b6d4]" 
                        style={{ width: `${readProgress}%` }} 
                      />
                   </div>
                   <span className="text-cyan-400 font-mono text-[10px] font-bold">{Math.round(readProgress)}%</span>
                </div>
             </div>
          </div>
          <ChevronDown size={18} className="text-white/40 transition-transform duration-500 group-open:rotate-180" />
        </summary>

        <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
          <nav className="min-h-[0] overflow-hidden border-t border-white/5 bg-black/40 px-4">
             {/* Danh sách mục lục ul/li ở đây */}
             <ul className="py-6 space-y-3 relative list-none">
                {/* Thanh dọc bên trong menu cũng dùng readProgress này */}
                <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-white/5" />
                <div 
                  className="absolute left-[19px] top-4 w-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all duration-150"
                  style={{ height: `${readProgress}%` }}
                />
                {/* map toc... */}
             </ul>
          </nav>
        </div>
      </details>
    </div>
  );
}



/*
"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';
*/


"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

// FIX: Thêm contentRef vào interface này
interface TocProps {
  htmlContent: string;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export default function TableOfContents({ htmlContent, contentRef }: TocProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [activeId, setActiveId] = useState<string>("");
  const [readProgress, setReadProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 1. Trích xuất Heading
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

  useEffect(() => {
    // Gán ID vào DOM thực tế của bài viết để Scroll Spy tìm thấy
    toc.forEach((item, index) => {
      const allHeadings = document.querySelectorAll('h2, h3');
      if (allHeadings[index] && !allHeadings[index].id) {
        allHeadings[index].id = item.id;
      }
    });

    if (window.innerWidth > 1024) setIsOpen(true);

    const handleScroll = () => {
      // Tính % dựa trên contentRef để không bị nhảy khi mở menu
      if (!contentRef.current) return;
      const element = contentRef.current;
      const rect = element.getBoundingClientRect();
      const elementHeight = element.offsetHeight;
      const scrolled = -rect.top;
      const viewportHeight = window.innerHeight;
      
      let progress = (scrolled / (elementHeight - viewportHeight)) * 100;
      setReadProgress(Math.max(0, Math.min(100, progress)));
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (detailsRef.current?.open && !detailsRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toc, contentRef]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0.1 }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <details 
      ref={detailsRef}
      className="group w-full bg-card/40 backdrop-blur-md border border-border rounded-xl overflow-hidden shadow-xl"
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="list-none cursor-pointer p-4 flex items-center justify-between select-none hover:bg-neon-cyan/5 focus:outline-none">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <ListTree size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-[0.15em] text-foreground/90">Mục lục</span>
            <div className="flex items-center gap-2 mt-1">
                 <div className="w-16 h-1 bg-border/20 rounded-full overflow-hidden">
                    <div className="h-full bg-neon-cyan transition-all duration-300" style={{ width: `${readProgress}%` }} />
                 </div>
                 <span className="text-neon-cyan/60 text-[9px] font-mono leading-none">{Math.round(readProgress)}%</span>
              </div>
          </div>
        </div>
        <ChevronDown size={16} className="text-muted-foreground transition-transform duration-500 group-open:rotate-180" />
      </summary>

      <nav className="px-3 pb-5 pt-2 border-t border-border/30 bg-black/10">
        <ul className="space-y-1 relative list-none m-0 p-0">
          <div className="absolute left-[14px] top-2 bottom-2 w-[1px] bg-border/20" />
          <div 
            className="absolute left-[14px] top-2 w-[1.5px] bg-neon-cyan shadow-[0_0_8px_#06b6d4] transition-all duration-300"
            style={{ height: `${readProgress}%` }}
          />
          
          {toc.map((item, idx) => {
            const isActive = activeId === item.id;
            return (
              <li key={`${item.id}-${idx}`} style={{ paddingLeft: `${(item.level - 2) * 16}px` }} className="relative z-10">
                <a 
                  href={`#${item.id}`} 
                  onClick={() => { if (window.innerWidth < 1024) setIsOpen(false); }}
                  className={`group/item flex items-center gap-3 py-1.5 px-3 text-sm transition-all duration-300 rounded-lg relative ${isActive ? 'text-neon-cyan font-bold translate-x-1' : 'text-foreground/50 hover:text-foreground/80'}`}
                >
                  <span className={`w-2 h-2 rounded-full border-2 transition-all duration-300 z-20 bg-background ${isActive ? 'border-neon-cyan scale-125 shadow-[0_0_5px_#06b6d4]' : 'border-border'}`} />
                  <span className="truncate">{item.text}</span>
                  {isActive && <div className="absolute inset-0 bg-neon-cyan/5 rounded-lg border-l-2 border-neon-cyan -z-10" />}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </details>
  );
}







