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
import { useState, useEffect, KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export function Pagination({
  totalCount,
  limit,
}: {
  totalCount: number;
  limit: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalCount / limit);

  // State cho field nhập số trang
  const [jumpPage, setJumpPage] = useState('');

  // Clear input khi chuyển trang thành công
  useEffect(() => {
    setJumpPage('');
  }, [currentPage]);

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `?${params.toString()}`;
  };

  const handleJump = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let page = Number(jumpPage);
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      
      if (page && page !== currentPage) {
        router.push(createPageURL(page), { scroll: false });
      }
    }
  };

  // 🔥 Logic cố định hiển thị TỐI ĐA 5 trang (có kèm ...)
  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  const pages = getPages();

  const baseStyle =
    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center min-w-[32px] h-[32px]";

  return (
    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
      {/* ⏮ FIRST */}
      <Link
        href={createPageURL(1)}
        className={`${baseStyle} bg-card hover:bg-border ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
      >
        <ChevronsLeft className="w-4 h-4" />
      </Link>

      {/* ◀ PREV */}
      <Link
        href={createPageURL(Math.max(1, currentPage - 1))}
        className={`${baseStyle} bg-card hover:bg-border ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {/* PAGES */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-1 text-foreground/40 font-bold h-[32px] flex items-center">
            ...
          </span>
        ) : (
          <Link
            key={`page-${p}`}
            href={createPageURL(p as number)}
            className={`${baseStyle} ${
              p === currentPage
                ? 'bg-primary text-white pointer-events-none'
                : 'bg-card hover:bg-border text-foreground/60'
            }`}
          >
            {p}
          </Link>
        )
      )}

      {/* NEXT ▶ */}
      <Link
        href={createPageURL(Math.min(totalPages, currentPage + 1))}
        className={`${baseStyle} bg-card hover:bg-border ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
      >
        <ChevronRight className="w-4 h-4" />
      </Link>

      {/* LAST ⏭ */}
      <Link
        href={createPageURL(totalPages)}
        className={`${baseStyle} bg-card hover:bg-border ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
      >
        <ChevronsRight className="w-4 h-4" />
      </Link>

      {/* JUMP TO PAGE INPUT */}
      <div className="flex items-center gap-2 ml-2 md:ml-4 pl-2 md:pl-4 border-l border-border h-[32px]">
        <span className="text-xs text-foreground/60 hidden sm:block">Trang:</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={handleJump}
          placeholder="Số..."
          title="Nhập số trang và nhấn Enter"
          className="w-14 px-2 h-full text-xs font-medium bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-center placeholder:text-foreground/30 placeholder:font-normal transition-all"
        />
      </div>
    </div>
  );
}





