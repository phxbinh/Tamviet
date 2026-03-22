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
import { useSearchParams } from 'next/navigation';

export function Pagination({
  totalCount,
  limit,
}: {
  totalCount: number;
  limit: number;
}) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalCount / limit);

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `?${params.toString()}`;
  };

  // 🔥 core logic
  const getPages = () => {
    const pages: (number | '...')[] = [];

    const delta = 1; // số trang xung quanh current

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (rangeStart > 2) {
      pages.push('...');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPages();

  const baseStyle =
    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all";

  return (
    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">

      {/* ⏮ FIRST */}
      <Link
        href={createPageURL(1)}
        className={`${baseStyle} bg-card hover:bg-border`}
      >
        ⏮
      </Link>

      {/* ◀ PREV */}
      <Link
        href={createPageURL(Math.max(1, currentPage - 1))}
        className={`${baseStyle} bg-card hover:bg-border`}
      >
        ◀
      </Link>

      {/* PAGES */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={i} className="px-2 text-foreground/40">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={createPageURL(p)}
            className={`${baseStyle} ${
              p === currentPage
                ? 'bg-primary text-white'
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
        className={`${baseStyle} bg-card hover:bg-border`}
      >
        ▶
      </Link>

      {/* LAST ⏭ */}
      <Link
        href={createPageURL(totalPages)}
        className={`${baseStyle} bg-card hover:bg-border`}
      >
        ⏭
      </Link>
    </div>
  );
}



