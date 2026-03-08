
"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';


const slugify = (text: string) => {
  return text.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

function TableOfContents_({ htmlContent }: { htmlContent: string }) {
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    if (!htmlContent) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2, h3'));
    
    const items = headings.map((heading) => ({
      text: heading.textContent || "",
      id: heading.id || slugify(heading.textContent || ""), 
      level: parseInt(heading.tagName[1])
    }));
    setToc(items);
  }, [htmlContent]);

  if (toc.length === 0) return null;

  return (
    <details 
      className="group w-full bg-card/40 backdrop-blur-md border border-border rounded-xl overflow-hidden transition-all duration-300"
      open={typeof window !== 'undefined' && window.innerWidth > 1024} // Tự mở trên Desktop
    >
      <summary className="list-none cursor-pointer p-4 flex items-center justify-between select-none hover:bg-neon-cyan/5 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-neon-cyan/10 text-neon-cyan">
            <ListTree size={16} />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">
            Mục lục <span className="text-neon-cyan/50 block text-[9px] tracking-normal font-medium italic">Navigation Area</span>
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className="text-muted-foreground transition-transform duration-300 group-open:rotate-180" 
        />
      </summary>

      <nav className="px-2 pb-4 pt-2 border-t border-border/30 bg-black/10">
        <ul className="space-y-1 relative">
          {/* Đường kẻ trang trí dọc */}
          <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-border/50" />
          
          {toc.map((item, idx) => (
            <li key={idx} style={{ paddingLeft: `${(item.level - 2) * 16}px` }}>
              <a 
                href={`#${item.id}`} 
                onClick={(e) => {
                  // Đóng dropdown trên mobile sau khi chọn link
                  if (window.innerWidth < 1024) {
                    e.currentTarget.closest('details')?.removeAttribute('open');
                  }
                }}
                className="group/item flex items-center gap-2 py-2 px-3 text-sm text-foreground/50 hover:text-neon-cyan hover:bg-neon-cyan/5 rounded-md transition-all relative overflow-hidden"
              >
                {/* Bullet point hiệu ứng */}
                <div className="w-1 h-1 rounded-full bg-border group-hover/item:bg-neon-cyan transition-colors" />
                <span className="truncate">{item.text}</span>
                
                {/* Hiệu ứng tia sáng khi hover */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-neon-cyan/10 to-transparent pointer-events-none" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}



"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ htmlContent }: { htmlContent: string }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [activeId, setActiveId] = useState<string>("");
  const [readProgress, setReadProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // Quản lý trạng thái đóng/mở chuẩn React

  // 1. Trích xuất Heading từ HTML Content
  const toc = useMemo(() => {
    if (typeof window === 'undefined' || !htmlContent) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2, h3'));
    return headings.map((heading, index) => ({
      text: heading.textContent?.trim() || "",
      id: heading.id || `section-${index}`,
      level: parseInt(heading.tagName[1])
    }));
  }, [htmlContent]);

  useEffect(() => {
    // Tự động mở trên Desktop sau khi component mount
    if (window.innerWidth > 1024) {
      setIsOpen(true);
    }

    const handleScroll = () => {
      // Tính % tiến trình đọc
      const winScroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height > 0) {
        setReadProgress((winScroll / height) * 100);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (detailsRef.current?.open && !detailsRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 2. Scroll Spy: Highlight mục đang đọc
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
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
      className="group w-full bg-card/40 backdrop-blur-md border border-border rounded-xl overflow-hidden transition-all duration-500 shadow-xl"
      open={isOpen} // Sử dụng prop 'open' thay vì 'defaultOpen'
      onToggle={(e) => setIsOpen(e.currentTarget.open)} // Đồng bộ state khi người dùng click thủ công
    >
      <summary className="list-none cursor-pointer p-4 flex items-center justify-between select-none hover:bg-neon-cyan/5 transition-colors focus-visible:outline-none">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <ListTree size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-[0.15em] text-foreground/90">Mục lục</span>
            <span className="text-neon-cyan/50 text-[10px] font-medium italic leading-none">
              Tiến trình: {Math.round(readProgress)}%
            </span>
          </div>
        </div>
        <ChevronDown 
          size={16} 
          className="text-muted-foreground transition-transform duration-500 group-open:rotate-180" 
        />
      </summary>

      <nav className="px-3 pb-5 pt-2 border-t border-border/30 bg-gradient-to-b from-black/5 to-transparent relative">
        <ul className="space-y-1 relative list-none m-0 p-0">
          
          {/* Thanh tiến trình dọc */}
          <div className="absolute left-[14px] top-2 bottom-2 w-[2px] bg-border/20 rounded-full overflow-hidden">
            <div 
              className="w-full bg-neon-cyan shadow-[0_0_8px_#06b6d4] transition-all duration-200 ease-out"
              style={{ height: `${readProgress}%` }}
            />
          </div>
          
          {toc.map((item, idx) => {
            const isActive = activeId === item.id;
            return (
              <li 
                key={`${item.id}-${idx}`} 
                style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
                className="relative z-10"
              >
                <a 
                  href={`#${item.id}`} 
                  onClick={() => { 
                    if (window.innerWidth < 1024) setIsOpen(false); 
                  }}
                  className={`
                    group/item flex items-center gap-3 py-2 px-3 text-sm transition-all duration-300 rounded-lg relative
                    ${isActive ? 'text-neon-cyan font-semibold translate-x-1' : 'text-foreground/50 hover:text-foreground/80'}
                  `}
                >
                  {/* Dot Indicator */}
                  <span className={`
                    w-2 h-2 rounded-full border-2 transition-all duration-300 z-20 bg-background
                    ${isActive ? 'border-neon-cyan scale-125 shadow-[0_0_8px_#06b6d4]' : 'border-border group-hover/item:border-foreground/40'}
                  `} />

                  <span className="truncate">{item.text}</span>
                  
                  {isActive && (
                    <span className="absolute left-0 right-0 top-0 bottom-0 bg-neon-cyan/5 rounded-lg -z-10" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </details>
  );
}






