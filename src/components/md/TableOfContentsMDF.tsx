"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';

export default function TableOfContents({ htmlContent, contentRef }: { 
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
