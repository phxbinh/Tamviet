// src/app/(public)/testCategories/_shop/Filters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Search, Tag, ArrowUpDown, Loader2 } from 'lucide-react';

export interface ProductType {
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
      // Sử dụng scroll: false để giữ vị trí màn hình khi lọc
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-3 items-center w-full">
      {/* 1. Tìm kiếm */}
      <div className="relative w-full lg:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          className="w-full bg-background border border-border pl-9 pr-4 py-2 rounded-full text-[11px] font-medium focus:ring-1 focus:ring-primary outline-none transition-all"
          defaultValue={searchParams.get('search') ?? ''}
          onChange={(e) => updateFilters({ search: e.target.value })}
        />
      </div>

      {/* 2. Loại sản phẩm (Product Type) */}
      <div className="relative w-full lg:w-44">
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
          <ChevronDownIcon />
        </div>
      </div>

      {/* 3. Sắp xếp (Sort By) - MỚI */}
      <div className="relative w-full lg:w-44">
        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <select
          className="w-full bg-background border border-border pl-9 pr-8 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider appearance-none cursor-pointer focus:ring-1 focus:ring-primary outline-none"
          value={searchParams.get('sort') ?? 'latest'}
          onChange={(e) => updateFilters({ sort: e.target.value })}
        >
          <option value="latest">Mới nhất</option>
          <option value="price_asc">Giá: Thấp đến Cao</option>
          <option value="price_desc">Giá: Cao đến Thấp</option>
          <option value="oldest">Cũ nhất</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <ChevronDownIcon />
        </div>
      </div>

      {/* 4. Khoảng giá */}
      <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-full shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Min:</span>
          <input
            type="number"
            className="w-14 bg-transparent text-[11px] font-bold focus:outline-none"
            defaultValue={searchParams.get('min') ?? ''}
            onBlur={(e) => updateFilters({ min: e.target.value })}
          />
        </div>
        <div className="w-[1px] h-3 bg-border" />
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Max:</span>
          <input
            type="number"
            className="w-14 bg-transparent text-[11px] font-bold focus:outline-none"
            defaultValue={searchParams.get('max') ?? ''}
            onBlur={(e) => updateFilters({ max: e.target.value })}
          />
        </div>
      </div>

      {/* Trạng thái đang tải */}
      <div className="w-6 flex justify-center">
        {isPending && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
      </div>
    </div>
  );
}

// Icon mũi tên nhỏ cho Select
function ChevronDownIcon() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
