// src/app/(public)/testCategories/_shop/Pagination.tsx
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
          href={createPageURL(p)}
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
