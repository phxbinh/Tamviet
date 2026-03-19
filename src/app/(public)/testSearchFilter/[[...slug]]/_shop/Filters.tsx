// src/app/(public)/testCategories/_shop/Filters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateFilters(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set('page', '1'); // Reset về trang 1 khi lọc
    
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-card/50 p-4 rounded-2xl border border-border/40">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        className="bg-background border border-border px-4 py-2 rounded-full text-xs w-full md:w-64"
        defaultValue={searchParams.get('search') ?? ''}
        onChange={(e) => updateFilters({ search: e.target.value })}
      />

      {/* Price Filter */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min Price"
          className="bg-background border border-border px-3 py-2 rounded-xl text-xs w-24"
          onChange={(e) => updateFilters({ min: e.target.value })}
        />
        <span className="text-foreground/30">-</span>
        <input
          type="number"
          placeholder="Max Price"
          className="bg-background border border-border px-3 py-2 rounded-xl text-xs w-24"
          onChange={(e) => updateFilters({ max: e.target.value })}
        />
      </div>
      
      {isPending && <span className="text-[10px] animate-pulse">Updating...</span>}
    </div>
  );
}
