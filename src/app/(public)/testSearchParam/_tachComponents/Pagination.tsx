// src/app/(public)/testCategories/_shop/Pagination.tsx

'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, MouseEvent } from 'react'; // Import MouseEvent từ react
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Send } from 'lucide-react';

export function Pagination({ totalCount, limit }: { totalCount: number; limit: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy trang hiện tại từ URL
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalCount / limit);
  const [jumpPage, setJumpPage] = useState('');

  // ✅ ĐIỂM HỘI TỤ (MUTEX-LIKE LOGIC): 
  // Mỗi khi currentPage thay đổi (do URL thay đổi), Effect này chắc chắn sẽ chạy sau khi render.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setJumpPage(''); // Reset ô nhập liệu luôn tại đây
  }, [currentPage]); 

  if (totalPages <= 1) return null;

  const createPageURL = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p.toString());
    return `?${params.toString()}`;
  };

  // Hàm này bây giờ chỉ làm 1 việc duy nhất: Điều hướng URL
  const navigate = (p: number) => {
    const target = Math.max(1, Math.min(p, totalPages));
    if (target !== currentPage) {
      // scroll: false để Next.js không can thiệp, để useEffect bên trên lo phần cuộn mượt
      router.push(createPageURL(target), { scroll: false });
    }
  };

  const handlePageClick = (e: MouseEvent<HTMLElement>, p: number) => {
    e.preventDefault();
    navigate(p);
  };

  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const btnBase = "w-10 h-10 flex items-center justify-center rounded-xl border transition-all text-xs font-bold";
  const activeStyle = "bg-primary border-primary text-white shadow-md shadow-primary/20 cursor-default";
  const idleStyle = "bg-card border-border hover:border-primary text-foreground/70 active:scale-95";

  return (
    <div className="flex flex-col items-center gap-6 mt-12 w-full">
      {/* HÀNG 1: LINKS (Tối ưu SEO) */}
      <div className="flex items-center gap-1.5">
        {currentPage > 1 && (
          <>
            <Link href={createPageURL(1)} onClick={(e) => handlePageClick(e, 1)} className={`${btnBase} ${idleStyle}`} prefetch={true}><ChevronsLeft size={18} /></Link>
            <Link href={createPageURL(currentPage - 1)} onClick={(e) => handlePageClick(e, currentPage - 1)} className={`${btnBase} ${idleStyle}`} prefetch={true}><ChevronLeft size={18} /></Link>
          </>
        )}

        {getPages().map((p, i) => (
          typeof p === 'number' ? (
            <Link key={i} href={createPageURL(p)} onClick={(e) => handlePageClick(e, p)} className={`${btnBase} ${p === currentPage ? activeStyle : idleStyle}`} prefetch={true}>{p}</Link>
          ) : (
            <span key={i} className="px-1 text-foreground/30 font-bold">...</span>
          )
        ))}

        {currentPage < totalPages && (
          <>
            <Link href={createPageURL(currentPage + 1)} onClick={(e) => handlePageClick(e, currentPage + 1)} className={`${btnBase} ${idleStyle}`} prefetch={true}><ChevronRight size={18} /></Link>
            <Link href={createPageURL(totalPages)} onClick={(e) => handlePageClick(e, totalPages)} className={`${btnBase} ${idleStyle}`} prefetch={true}><ChevronsRight size={18} /></Link>
          </>
        )}
      </div>

      {/* HÀNG 2: NHẢY TRANG (UX) */}
      <div className="flex items-center bg-card border border-border p-1 rounded-2xl shadow-sm focus-within:border-primary transition-all">
        <span className="text-[10px] uppercase tracking-widest font-black text-foreground/30 px-4 select-none">Đến trang</span>
        <input
          type="number"
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && navigate(Number(jumpPage))}
          placeholder={`${currentPage}/${totalPages}`}
          className="w-16 bg-transparent text-sm font-bold text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-foreground/20"
        />
        <button 
          onClick={() => navigate(Number(jumpPage))}
          className="bg-primary hover:bg-primary/90 text-white p-2.5 rounded-xl transition-transform active:scale-90 shadow-sm"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}






