// lọc có thêm product_types
// src/app/(public)/testCategories/_shop/Filters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, ChangeEvent } from 'react';
import { Search, Tag, DollarSign, Loader2 } from 'lucide-react';

interface ProductType {
  code: string;
  name: string;
}

export function Filters({ productTypes }: { productTypes: ProductType[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateFilters(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set('page', '1'); 
    
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center w-full">
      {/* 1. Search Group */}
      <div className="relative w-full lg:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          className="w-full bg-background border border-border pl-9 pr-4 py-2 rounded-full text-[11px] font-medium focus:ring-1 focus:ring-primary outline-none transition-all"
          defaultValue={searchParams.get('search') ?? ''}
          onChange={(e) => updateFilters({ search: e.target.value })}
        />
      </div>

      {/* 2. Product Type Dropdown */}
      <div className="relative w-full lg:w-48">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <select
          className="w-full bg-background border border-border pl-9 pr-8 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider appearance-none cursor-pointer focus:ring-1 focus:ring-primary outline-none"
          value={searchParams.get('type') ?? ''}
          onChange={(e) => updateFilters({ type: e.target.value || null })}
        >
          <option value="">Tất cả loại</option>
          {productTypes.map((type) => (
            <option key={type.code} value={type.code}>
              {type.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      {/* 3. Price Filter Group */}
      <div className="flex items-center gap-2 bg-background border border-border px-3 py-1 rounded-full">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Giá từ:</span>
          <input
            type="number"
            placeholder="Min"
            className="w-16 bg-transparent text-[11px] font-bold focus:outline-none"
            defaultValue={searchParams.get('min') ?? ''}
            onBlur={(e) => updateFilters({ min: e.target.value })}
          />
        </div>
        <div className="w-[1px] h-4 bg-border mx-1" />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Đến:</span>
          <input
            type="number"
            placeholder="Max"
            className="w-16 bg-transparent text-[11px] font-bold focus:outline-none"
            defaultValue={searchParams.get('max') ?? ''}
            onBlur={(e) => updateFilters({ max: e.target.value })}
          />
        </div>
      </div>

      {/* Loading Indicator */}
      {isPending && (
        <div className="flex items-center gap-2 px-3 text-primary animate-in fade-in">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Đang lọc...</span>
        </div>
      )}
    </div>
  );
}
