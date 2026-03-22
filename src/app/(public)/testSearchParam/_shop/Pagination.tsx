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

  // 🔥 core logic đã được FIX hoàn toàn
  const getPages = () => {
    const pagesSet = new Set<number>();

    // 1. Luôn hiển thị trang đầu và trang cuối
    pagesSet.add(1);
    if (totalPages > 1) {
      pagesSet.add(totalPages);
    }

    // 2. Lấy các trang xung quanh trang hiện tại (delta = 1)
    const delta = 1;
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pagesSet.add(i);
    }

    // 3. Chuyển Set về Array và sắp xếp lại theo thứ tự tăng dần
    const sortedPages = Array.from(pagesSet).sort((a, b) => a - b);
    const result: (number | '...')[] = [];

    // 4. Duyệt mảng để điền số hoặc dấu '...' một cách chuẩn xác
    for (let i = 0; i < sortedPages.length; i++) {
      if (i > 0) {
        const gap = sortedPages[i] - sortedPages[i - 1];
        if (gap === 2) {
          // Nếu chỉ thiếu đúng 1 số ở giữa (vd: 1 và 3), thì chèn luôn số 2 thay vì dùng '...'
          result.push(sortedPages[i - 1] + 1);
        } else if (gap > 2) {
          // Nếu thiếu nhiều số, mới chèn '...'
          result.push('...');
        }
      }
      result.push(sortedPages[i]);
    }

    return result;
  };

  const pages = getPages();

  const baseStyle =
    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center";

  return (
    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
      {/* ⏮ FIRST */}
      <Link
        href={createPageURL(1)}
        className={`${baseStyle} bg-card hover:bg-border ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
      >
        ⏮
      </Link>

      {/* ◀ PREV */}
      <Link
        href={createPageURL(Math.max(1, currentPage - 1))}
        className={`${baseStyle} bg-card hover:bg-border ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
      >
        ◀
      </Link>

      {/* PAGES */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-foreground/40 font-bold">
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
        ▶
      </Link>

      {/* LAST ⏭ */}
      <Link
        href={createPageURL(totalPages)}
        className={`${baseStyle} bg-card hover:bg-border ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
      >
        ⏭
      </Link>
    </div>
  );
}




