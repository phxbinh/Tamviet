// src/app/(public)/testCategories/_shop/Pagination.tsx

'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, MouseEvent } from 'react'; // Import MouseEvent từ react
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Send } from 'lucide-react';

/*
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Send } from 'lucide-react';
*/


export function Pagination_({ totalCount, limit }: { totalCount: number; limit: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalCount / limit);
  const [jumpPage, setJumpPage] = useState('');

  useEffect(() => setJumpPage(''), [currentPage]);

  if (totalPages <= 1) return null;

  const createPageURL = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p.toString());
    return `?${params.toString()}`;
  };

  const handleJump = () => {
    let p = Math.max(1, Math.min(Number(jumpPage), totalPages));
    if (p && p !== currentPage) router.push(createPageURL(p), { scroll: false });
  };

  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const btnBase = "w-9 h-9 flex items-center justify-center rounded-xl border transition-all text-xs font-bold";
  const activeStyle = "bg-primary border-primary text-white shadow-lg shadow-primary/20";
  const idleStyle = "bg-card border-border hover:border-primary/50 text-foreground/70";

  return (
    <div className="flex flex-col items-center gap-6 mt-12 w-full">
      {/* HÀNG 1: HIỂN THỊ SỐ TRANG */}
      <div className="flex items-center gap-1.5">
        {currentPage > 1 && (
          <>
            <Link href={createPageURL(1)} className={`${btnBase} ${idleStyle}`} title="Trang đầu" prefetch={true}><ChevronsLeft size={16} /></Link>
            <Link href={createPageURL(currentPage - 1)} className={`${btnBase} ${idleStyle}`} title="Trang trước" prefetch={true}><ChevronLeft size={16} /></Link>
          </>
        )}

        {getPages().map((p, i) => (
          typeof p === 'number' ? (
            <Link key={i} href={createPageURL(p)} className={`${btnBase} ${p === currentPage ? activeStyle : idleStyle}`} prefetch={true}>{p}</Link>
          ) : (
            <span key={i} className="px-1 text-foreground/30 font-bold">...</span>
          )
        ))}

        {currentPage < totalPages && (
          <>
            <Link href={createPageURL(currentPage + 1)} className={`${btnBase} ${idleStyle}`} title="Trang sau" prefetch={true}><ChevronRight size={16} /></Link>
            <Link href={createPageURL(totalPages)} className={`${btnBase} ${idleStyle}`} title="Trang cuối" prefetch={true}><ChevronsRight size={16} /></Link>
          </>
        )}
      </div>

      {/* HÀNG 2: NHẢY TRANG NHANH */}
      <div className="flex items-center bg-card border border-border p-1 rounded-xl shadow-sm">
        <span className="text-[10px] uppercase tracking-wider font-bold text-foreground/40 px-3">Đi đến</span>
        <input
          type="number"
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJump()}
          placeholder={`${currentPage}/${totalPages}`}
          className="w-16 bg-transparent text-sm font-bold text-center outline-none border-none placeholder:font-normal placeholder:text-foreground/20"
        />
        <button 
          onClick={handleJump}
          className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-colors"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}




// chạy được SEO good
export function Pagination_seo({ totalCount, limit }: { totalCount: number; limit: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalCount / limit);
  const [jumpPage, setJumpPage] = useState('');

  useEffect(() => setJumpPage(''), [currentPage]);

  if (totalPages <= 1) return null;

  const createPageURL = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p.toString());
    return `?${params.toString()}`;
  };

  // FIX: Hàm handleJump để cuộn lên đầu trang
  const handleJump = () => {
    const p = Math.max(1, Math.min(Number(jumpPage), totalPages));
    if (p && p !== currentPage) {
      // 1. Chuyển trang và cho phép Next.js scroll mặc định
      router.push(createPageURL(p), { scroll: true }); 
      
      // 2. (Tùy chọn) Force scroll mượt mà lên đầu trang nếu router.push bị delay
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  // --- UI RÚT GỌN ---
  const btnBase = "w-9 h-9 flex items-center justify-center rounded-xl border transition-all text-xs font-bold";
  const activeStyle = "bg-primary border-primary text-white shadow-lg shadow-primary/20";
  const idleStyle = "bg-card border-border hover:border-primary/50 text-foreground/70";

  return (
    <div className="flex flex-col items-center gap-6 mt-12 w-full">
      {/* HÀNG 1: SỐ TRANG (Dùng Link mặc định sẽ tự scroll lên đầu) */}
      <div className="flex items-center gap-1.5">
        {currentPage > 1 && (
          <>
            <Link href={createPageURL(1)} className={`${btnBase} ${idleStyle}`}><ChevronsLeft size={16} /></Link>
            <Link href={createPageURL(currentPage - 1)} className={`${btnBase} ${idleStyle}`}><ChevronLeft size={16} /></Link>
          </>
        )}

        {getPages().map((p, i) => (
          typeof p === 'number' ? (
            <Link key={i} href={createPageURL(p)} className={`${btnBase} ${p === currentPage ? activeStyle : idleStyle}`} prefetch={true}>{p}</Link>
          ) : (
            <span key={i} className="px-1 text-foreground/30 font-bold">...</span>
          )
        ))}

        {currentPage < totalPages && (
          <>
            <Link href={createPageURL(currentPage + 1)} className={`${btnBase} ${idleStyle}`}><ChevronRight size={16} /></Link>
            <Link href={createPageURL(totalPages)} className={`${btnBase} ${idleStyle}`}><ChevronsRight size={16} /></Link>
          </>
        )}
      </div>

      {/* HÀNG 2: NHẢY TRANG */}
      <div className="flex items-center bg-card border border-border p-1 rounded-xl shadow-sm focus-within:border-primary transition-colors">
        <span className="text-[10px] uppercase tracking-wider font-bold text-foreground/40 px-3">Đi đến</span>
        <input
          type="number"
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJump()}
          placeholder={`${currentPage}/${totalPages}`}
          className="w-16 bg-transparent text-sm font-bold text-center outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button 
          onClick={handleJump}
          className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-all active:scale-95"
          title="Nhảy đến trang"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}


export function Pagination_scroll({ totalCount, limit }: { totalCount: number; limit: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalCount / limit);
  const [jumpPage, setJumpPage] = useState('');

  useEffect(() => setJumpPage(''), [currentPage]);

  if (totalPages <= 1) return null;

  const createPageURL = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p.toString());
    return `?${params.toString()}`;
  };

  // Hàm điều hướng chung có Smooth Scroll
  const navigateToPage = (p: number) => {
    if (p === currentPage || p < 1 || p > totalPages) return;
    
    // Cuộn mượt lên đầu trước hoặc song song với chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Chuyển URL (để scroll: false để tránh bị giật khung hình của Next.js)
    router.push(createPageURL(p), { scroll: false });
  };

  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const btnBase = "w-9 h-9 flex items-center justify-center rounded-xl border transition-all text-xs font-bold cursor-pointer";
  const activeStyle = "bg-primary border-primary text-white shadow-lg shadow-primary/20";
  const idleStyle = "bg-card border-border hover:border-primary/50 text-foreground/70";

  return (
    <div className="flex flex-col items-center gap-6 mt-12 w-full">
      {/* HÀNG 1: SỐ TRANG */}
      <div className="flex items-center gap-1.5">
        {currentPage > 1 && (
          <>
            <button onClick={() => navigateToPage(1)} className={`${btnBase} ${idleStyle}`}><ChevronsLeft size={16} /></button>
            <button onClick={() => navigateToPage(currentPage - 1)} className={`${btnBase} ${idleStyle}`}><ChevronLeft size={16} /></button>
          </>
        )}

        {getPages().map((p, i) => (
          typeof p === 'number' ? (
            <button 
              key={i} 
              onClick={() => navigateToPage(p)} 
              className={`${btnBase} ${p === currentPage ? activeStyle : idleStyle}`}
            >
              {p}
            </button>
          ) : (
            <span key={i} className="px-1 text-foreground/30 font-bold">...</span>
          )
        ))}

        {currentPage < totalPages && (
          <>
            <button onClick={() => navigateToPage(currentPage + 1)} className={`${btnBase} ${idleStyle}`}><ChevronRight size={16} /></button>
            <button onClick={() => navigateToPage(totalPages)} className={`${btnBase} ${idleStyle}`}><ChevronsRight size={16} /></button>
          </>
        )}
      </div>

      {/* HÀNG 2: NHẢY TRANG NHANH */}
      <div className="flex items-center bg-card border border-border p-1 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-primary/10 transition-all">
        <span className="text-[10px] uppercase tracking-wider font-bold text-foreground/40 px-3">Đi đến</span>
        <input
          type="number"
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && navigateToPage(Number(jumpPage))}
          placeholder={`${currentPage}/${totalPages}`}
          className="w-16 bg-transparent text-sm font-bold text-center outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-foreground/20"
        />
        <button 
          onClick={() => navigateToPage(Number(jumpPage))}
          className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-transform active:scale-90"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}



export function Pagination__scroll_({ totalCount, limit }: { totalCount: number; limit: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalCount / limit);
  const [jumpPage, setJumpPage] = useState('');

  // Reset input khi trang thay đổi
  useEffect(() => setJumpPage(''), [currentPage]);

  if (totalPages <= 1) return null;

  const createPageURL = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p.toString());
    return `?${params.toString()}`;
  };

  const navigateToPage = (p: number) => {
    const targetPage = Math.max(1, Math.min(p, totalPages));
    if (targetPage === currentPage) return;

    // 1. Chuyển URL trước (tắt scroll mặc định của Next.js để tránh xung đột)
    router.push(createPageURL(targetPage), { scroll: false });

    // 2. Ép trình duyệt cuộn lên đầu ở frame hình tiếp theo
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  // Style constants
  const btnBase = "w-9 h-9 flex items-center justify-center rounded-xl border transition-all text-xs font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed";
  const activeStyle = "bg-primary border-primary text-white shadow-md shadow-primary/20";
  const idleStyle = "bg-card border-border hover:border-primary/50 text-foreground/70 active:scale-90";

  return (
    <div className="flex flex-col items-center gap-6 mt-12 w-full">
      {/* HÀNG 1: SỐ TRANG */}
      <div className="flex items-center gap-1.5">
        {currentPage > 1 && (
          <>
            <button onClick={() => navigateToPage(1)} className={`${btnBase} ${idleStyle}`}><ChevronsLeft size={16} /></button>
            <button onClick={() => navigateToPage(currentPage - 1)} className={`${btnBase} ${idleStyle}`}><ChevronLeft size={16} /></button>
          </>
        )}

        {getPages().map((p, i) => (
          typeof p === 'number' ? (
            <button 
              key={i} 
              onClick={() => navigateToPage(p)} 
              className={`${btnBase} ${p === currentPage ? activeStyle : idleStyle}`}
            >
              {p}
            </button>
          ) : (
            <span key={i} className="px-1 text-foreground/30 font-bold">...</span>
          )
        ))}

        {currentPage < totalPages && (
          <>
            <button onClick={() => navigateToPage(currentPage + 1)} className={`${btnBase} ${idleStyle}`}><ChevronRight size={16} /></button>
            <button onClick={() => navigateToPage(totalPages)} className={`${btnBase} ${idleStyle}`}><ChevronsRight size={16} /></button>
          </>
        )}
      </div>

      {/* HÀNG 2: NHẢY TRANG NHANH */}
      <div className="group flex items-center bg-card border border-border p-1 rounded-xl shadow-sm focus-within:border-primary transition-all">
        <span className="text-[10px] uppercase tracking-wider font-black text-foreground/30 px-3 select-none">Đến trang</span>
        <input
          type="number"
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && navigateToPage(Number(jumpPage))}
          placeholder={`${currentPage} / ${totalPages}`}
          className="w-20 bg-transparent text-sm font-bold text-center outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-foreground/20"
        />
        <button 
          onClick={() => navigateToPage(Number(jumpPage))}
          className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-transform active:scale-90 flex items-center justify-center"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}




export function Pagination__a({ totalCount, limit }: { totalCount: number; limit: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalCount / limit);
  const [jumpPage, setJumpPage] = useState('');

  useEffect(() => setJumpPage(''), [currentPage]);
  if (totalPages <= 1) return null;

  const createPageURL = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p.toString());
    return `?${params.toString()}`;
  };

  // FIX TYPE: Sử dụng React.MouseEvent
  const handlePageClick = (e: MouseEvent<HTMLElement>, p: number) => {
    const target = Math.max(1, Math.min(p, totalPages));
    if (target === currentPage) return e.preventDefault();

    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Dùng { scroll: false } để chặn Next.js tự nhảy "bộp" lên đầu
    router.push(createPageURL(target), { scroll: false });
  };

  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const btnBase = "w-10 h-10 flex items-center justify-center rounded-xl border transition-all text-xs font-bold";
  const activeStyle = "bg-primary border-primary text-white shadow-md shadow-primary/20 cursor-default";
  const idleStyle = "bg-card border-border hover:border-primary text-foreground/70 active:scale-90";

  return (
    <div className="flex flex-col items-center gap-6 mt-12 w-full">
      {/* HÀNG 1: LINKS (SEO) */}
      <div className="flex items-center gap-1.5">
        {currentPage > 1 && (
          <>
            <Link href={createPageURL(1)} onClick={(e) => handlePageClick(e, 1)} className={`${btnBase} ${idleStyle}`}><ChevronsLeft size={18} /></Link>
            <Link href={createPageURL(currentPage - 1)} onClick={(e) => handlePageClick(e, currentPage - 1)} className={`${btnBase} ${idleStyle}`}><ChevronLeft size={18} /></Link>
          </>
        )}

        {getPages().map((p, i) => (
          typeof p === 'number' ? (
            <Link key={i} href={createPageURL(p)} onClick={(e) => handlePageClick(e, p)} className={`${btnBase} ${p === currentPage ? activeStyle : idleStyle}`}>{p}</Link>
          ) : (
            <span key={i} className="px-1 text-foreground/30 font-bold">...</span>
          )
        ))}

        {currentPage < totalPages && (
          <>
            <Link href={createPageURL(currentPage + 1)} onClick={(e) => handlePageClick(e, currentPage + 1)} className={`${btnBase} ${idleStyle}`}><ChevronRight size={18} /></Link>
            <Link href={createPageURL(totalPages)} onClick={(e) => handlePageClick(e, totalPages)} className={`${btnBase} ${idleStyle}`}><ChevronsRight size={18} /></Link>
          </>
        )}
      </div>

      {/* HÀNG 2: JUMP FIELD */}
      <div className="flex items-center bg-card border border-border p-1 rounded-2xl shadow-sm focus-within:border-primary transition-all">
        <span className="text-[10px] uppercase tracking-widest font-black text-foreground/30 px-4 select-none">Đến trang</span>
        <input
          type="number"
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handlePageClick(e as any, Number(jumpPage))}
          placeholder={`${currentPage}/${totalPages}`}
          className="w-16 bg-transparent text-sm font-bold text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-foreground/20"
        />
        <button 
          onClick={(e) => handlePageClick(e as any, Number(jumpPage))}
          className="bg-primary hover:bg-primary/90 text-white p-2.5 rounded-xl transition-transform active:scale-95 shadow-sm shadow-primary/20"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}



export function Pagination_SEO_OK({ totalCount, limit }: { totalCount: number; limit: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalCount / limit);
  const [jumpPage, setJumpPage] = useState('');

  useEffect(() => setJumpPage(''), [currentPage]);
  if (totalPages <= 1) return null;

  const createPageURL = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p.toString());
    return `?${params.toString()}`;
  };

  const navigate = (p: number) => {
    const target = Math.max(1, Math.min(p, totalPages));
    if (target === currentPage) return;

    // Bước 1: Cuộn mượt lên đầu trước
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Bước 2: Chuyển trang nhưng chặn scroll mặc định của Next.js
    router.push(createPageURL(target), { scroll: false });

    // Bước 3: (Cú chốt) Đảm bảo cuộn lại lần nữa sau khi DOM đã render
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
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
      {/* HÀNG 1: LINKS (SEO) */}
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

      {/* HÀNG 2: JUMP FIELD */}
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
          className="bg-primary hover:bg-primary/90 text-white p-2.5 rounded-xl transition-transform active:scale-90"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}


/*
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, MouseEvent } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Send } from 'lucide-react';
*/
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






