/*
"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

interface TocProps {
  htmlContent: string;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export default function TableOfContents({ htmlContent, contentRef }: TocProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const isLock = useRef(false);

  // 1. Trích xuất mục lục từ HTML
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

  // 2. Đồng bộ ID và Logic Highlight chuẩn xác
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Gán ID cho các thẻ heading trong bài viết để khớp với TOC
    const allHeadings = contentRef.current.querySelectorAll('h2, h3');
    toc.forEach((item, index) => {
      if (allHeadings[index]) allHeadings[index].id = item.id;
    });

    if (window.innerWidth > 1024) setIsOpen(true);

    const handleScroll = () => {
      // Nếu đang trong quá trình đóng/mở menu thì tạm dừng tính toán để tránh nhảy loạn
      if (isLock.current || !contentRef.current) return;

      const headings = Array.from(contentRef.current.querySelectorAll('h2, h3')) as HTMLElement[];
      const scrollPos = window.scrollY + 120; // Khoảng cách bù trừ cho Header cố định

      // TH1: Nếu cuộn đến cuối bài viết -> Luôn highlight mục cuối cùng
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isAtBottom && headings.length > 0) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }

      // TH2: Tìm mục gần nhất với vị trí cuộn
      let currentId = "";
      for (const heading of headings) {
        if (heading.offsetTop <= scrollPos) {
          currentId = heading.id;
        } else {
          break; // Đã tìm thấy mục sát nhất, dừng vòng lặp
        }
      }
      
      if (currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Chạy ngay khi mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc, contentRef, activeId]);

  // 3. Xử lý Toggle có bảo vệ vị trí
  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    isLock.current = true;
    setIsOpen(e.currentTarget.open);
    // Khóa 400ms để trình duyệt ổn định layout sau khi đóng/mở
    setTimeout(() => { isLock.current = false; }, 400);
  };

  if (toc.length === 0) return null;

  return (
    <div className="w-full my-6">
      <details 
        ref={detailsRef}
        open={isOpen}
        onToggle={handleToggle}
        className="group w-full bg-card/60 backdrop-blur-xl border border-border rounded-2xl overflow-hidden shadow-xl"
      >
        <summary className="list-none cursor-pointer p-4 flex items-center justify-between select-none hover:bg-neon-cyan/5 focus:outline-none appearance-none [&::-webkit-details-marker]:hidden">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
              <ListTree size={20} />
            </div>
            <span className="text-sm font-bold tracking-widest text-foreground/90 uppercase">Mục lục bài viết</span>
          </div>
          <ChevronDown size={18} className="text-muted-foreground transition-transform duration-500 group-open:rotate-180" />
        </summary>

        <nav className="px-4 pb-6 pt-2 border-t border-border/30 bg-black/5 overflow-hidden">
          <ul className="space-y-1 relative list-none m-0 p-0 pt-2">
        
            <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-border/20 rounded-full" />
            
            {toc.map((item, idx) => {
              const isActive = activeId === item.id;
              return (
                <li key={`${item.id}-${idx}`} style={{ paddingLeft: `${(item.level - 2) * 20}px` }} className="relative z-10">
                  <a 
                    href={`#${item.id}`} 
                    onClick={(e) => {
                      if (window.innerWidth < 1024) setIsOpen(false);
                      // Có thể thêm logic smooth scroll thủ công tại đây nếu cần
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
        </nav>
      </details>
    </div>
  );
}
*/





"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

interface TocProps {
  htmlContent: string;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export default function TableOfContents({ htmlContent, contentRef }: TocProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const isLock = useRef(false);
  const lastScrollY = useRef(0);

  // 1. Trích xuất mục lục
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

  // 2. Logic điều khiển Ẩn/Hiện và Highlight
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Đồng bộ ID cho các thẻ heading trong bài viết
    const allHeadings = contentRef.current.querySelectorAll('h2, h3');
    toc.forEach((item, index) => {
      if (allHeadings[index]) allHeadings[index].id = item.id;
    });

    if (window.innerWidth > 1024) setIsOpen(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // --- PHẦN 1: Logic Ẩn/Hiện menu khi cuộn ---
      // Nếu đang mở menu (isOpen) thì không ẩn menu đi để tránh trải nghiệm tệ
      if (!isOpen) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
          setIsVisible(false); // Cuộn xuống: Ẩn
        } else {
          setIsVisible(true); // Cuộn lên: Hiện
        }
      }
      lastScrollY.current = currentScrollY;

      // --- PHẦN 2: Logic Highlight mục đang đọc ---
      if (isLock.current || !contentRef.current) return;

      const headings = Array.from(contentRef.current.querySelectorAll('h2, h3')) as HTMLElement[];
      const scrollPos = currentScrollY + 120;

      // Kiểm tra chạm đáy bài viết
      const isAtBottom = window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 100;
      if (isAtBottom && headings.length > 0) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }

      // Tìm mục gần nhất dựa trên Offset thực tế
      let currentId = "";
      for (const heading of headings) {
        if (heading.offsetTop <= scrollPos) {
          currentId = heading.id;
        } else {
          break;
        }
      }
      if (currentId !== activeId) setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc, contentRef, activeId, isOpen]);

  // 3. Xử lý Toggle (Đóng/Mở)
  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const newState = e.currentTarget.open;
    isLock.current = true;
    setIsOpen(newState);
    // Khóa tính toán trong 400ms để layout ổn định
    setTimeout(() => { isLock.current = false; }, 400);
  };

  if (toc.length === 0) return null;

  return (
    <div 
      className={`
        w-full transition-all duration-500 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
      `}
    >
      <details 
        ref={detailsRef}
        open={isOpen}
        onToggle={handleToggle}
        className="group w-full bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <summary className="list-none cursor-pointer p-4 flex items-center justify-between select-none hover:bg-neon-cyan/5 focus:outline-none appearance-none [&::-webkit-details-marker]:hidden">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
              <ListTree size={20} />
            </div>
            <span className="text-sm font-bold tracking-widest text-foreground/90 uppercase">Mục lục</span>
          </div>
          <ChevronDown size={18} className="text-muted-foreground transition-transform duration-500 group-open:rotate-180" />
        </summary>

        <nav className="px-4 pb-6 pt-2 border-t border-border/30 bg-black/5 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 relative list-none m-0 p-0 pt-2">
            {/* Đường kẻ dọc tĩnh */}
            <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-border/20 rounded-full" />
            
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
          </ul>
        </nav>
      </details>
    </div>
  );
}




