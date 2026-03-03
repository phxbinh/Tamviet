'use client';

import { X, ShieldCheck, ScrollText, Lock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'terms' | 'privacy';
}

export default function LegalModal({ isOpen, onClose, title, type }: LegalModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Logic tính toán % đã cuộn
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const totalScroll = scrollHeight - clientHeight;
      const currentProgress = (scrollTop / totalScroll) * 100;
      setScrollProgress(currentProgress);
    }
  };

  // Khóa scroll của body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset progress khi mở lại
      setScrollProgress(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[80vh] bg-card border border-border shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
        
        {/* --- PROGRESS BAR (Top) --- */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-muted z-20">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30 pt-7">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
              {type === 'terms' ? <ScrollText size={20} /> : <Lock size={20} />}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-none">{title}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Hệ thống bảo mật v1.0</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-6 text-sm leading-relaxed text-muted-foreground"
        >
          {/* Nội dung mẫu (Lặp lại để test scroll) */}
          {[1, 2, 3, 4, 5].map((i) => (
            <section key={i} className="space-y-3">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <span className="text-emerald-500">0{i}.</span> Quy định mục {i}
              </h4>
              <p>
                Đây là nội dung chi tiết về các chính sách bảo mật và điều khoản sử dụng của hệ thống TÂM VIỆT. 
                Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn thông qua các giao thức mã hóa tiên tiến nhất. 
                Mọi hành vi truy cập trái phép hoặc sử dụng sai mục đích sẽ bị ghi lại bởi hệ thống giám sát thời gian thực.
              </p>
              <p>
                Người dùng có quyền yêu cầu trích xuất dữ liệu hoặc xóa tài khoản vĩnh viễn bất kỳ lúc nào 
                thông qua bảng điều khiển quản trị.
              </p>
            </section>
          ))}

          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 leading-tight">
              Bạn đã đọc đến cuối tài liệu. Hệ thống đã xác nhận phiên đọc của bạn là hợp lệ.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-muted/30 flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground">
            READING: {Math.round(scrollProgress)}%
          </span>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-foreground text-background font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all text-xs"
          >
            ĐÃ HIỂU VÀ ĐỒNG Ý
          </button>
        </div>
      </div>
    </div>
  );
}
