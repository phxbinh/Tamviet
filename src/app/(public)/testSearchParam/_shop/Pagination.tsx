// src/app/(public)/testCategories/_shop/Pagination.tsx
/*
'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function Pagination({ totalCount, limit }: { totalCount: number, limit: number }) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalCount / limit);

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex justify-center gap-2 mt-12">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={createPageURL(p)} prefetch={true}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            p === currentPage 
            ? "bg-primary text-white" 
            : "bg-card hover:bg-border text-foreground/60"
          }`}
        >
          {p}
        </Link>
      ))}
    </div>
  );
}
*/

'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Send } from 'lucide-react';

export function Pagination({ totalCount, limit }: { totalCount: number; limit: number }) {
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
