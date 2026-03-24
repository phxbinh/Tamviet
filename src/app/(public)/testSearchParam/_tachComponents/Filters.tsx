// src/app/(public)/testSearchParam/_tachComponents/Filters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect, useRef } from 'react';
import { Search, Tag, ArrowUpDown, Loader2, CircleDollarSign } from 'lucide-react';


export interface ProductType {
  code: string;
  name: string;
}

// Đưa ra ngoài component để tránh re-create mỗi lần render
const itemStyle = "relative flex items-center bg-card border border-border rounded-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary shadow-sm";
const iconStyle = "absolute left-3.5 w-4 h-4 text-foreground/40 pointer-events-none";
const inputStyle = "w-full bg-transparent pl-10 pr-4 py-2.5 text-sm font-medium outline-none placeholder:text-foreground/30 text-foreground";

export function Filters({ productTypes }: { productTypes: ProductType[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const isTypingRef = useRef(false);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    params.set('page', '1');
    startTransition(() => router.push(`?${params}`, { scroll: false }));
  };

  // Sync URL -> State (chỉ khi không phải do user đang gõ)
  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? '';
    if (!isTypingRef.current && urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  // Debounce State -> URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get('search') ?? '')) updateFilters({ search: search || null });
      isTypingRef.current = false;
    }, 500);
    return () => clearTimeout(timer); // Cleanup timer tự động
  }, [search]);

  return (
    <div className="flex flex-col lg:flex-row gap-2 items-center w-full py-3">
      {/* SEARCH FIELD */}
      <div className={`${itemStyle} w-full lg:w-80`}>
        <Search className={iconStyle} />
        <input
          value={search}
          onChange={(e) => { isTypingRef.current = true; setSearch(e.target.value); }}
          placeholder="Tìm kiếm sản phẩm..."
          className={inputStyle}
        />
        {isPending && <Loader2 className="absolute right-3 w-4 h-4 animate-spin text-primary" />}
      </div>

      <div className="flex flex-col md:flex-nowrap gap-3 w-full lg:w-auto">
        {/* PRODUCT TYPE SELECT */}
        <div className={`${itemStyle} flex-1 lg:w-52`}>
          <Tag className={iconStyle} />
          <select
            value={searchParams.get('type') ?? ''}
            onChange={(e) => updateFilters({ type: e.target.value || null })}
            className={`${inputStyle} appearance-none cursor-pointer`}
          >
            <option value="" className="bg-card">Tất cả danh mục</option>
            {productTypes.map(t => <option key={t.code} value={t.code} className="bg-card">{t.name}</option>)}
          </select>
        </div>

        {/* SORT SELECT */}
        <div className={`${itemStyle} flex-1 lg:w-48`}>
          <ArrowUpDown className={iconStyle} />
          <select
            value={searchParams.get('sort') ?? 'newest'}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className={`${inputStyle} appearance-none cursor-pointer`}
          >
            <option value="newest" className="bg-card">Mới nhất</option>
            <option value="price_asc" className="bg-card">Giá: Thấp → Cao</option>
            <option value="price_desc" className="bg-card">Giá: Cao → Thấp</option>
            <option value="oldest" className="bg-card">Cũ nhất</option>
          </select>
        </div>

        {/* PRICE RANGE CAPSULE */}
        <div className={`${itemStyle} px-3 py-1 lg:w-60 gap-2`}>
          <CircleDollarSign className="w-4 h-4 text-foreground/40 ml-1" />
          <div className="flex items-center grow">
            <input
              type="number" placeholder="Min"
              defaultValue={searchParams.get('min') ?? ''}
              onBlur={(e) => updateFilters({ min: e.target.value || null })}
              className="w-full bg-transparent text-sm font-semibold text-center outline-none placeholder:font-normal placeholder:text-foreground/30"
            />
            <span className="text-border px-1">|</span>
            <input
              type="number" placeholder="Max"
              defaultValue={searchParams.get('max') ?? ''}
              onBlur={(e) => updateFilters({ max: e.target.value || null })}
              className="w-full bg-transparent text-sm font-semibold text-center outline-none placeholder:font-normal placeholder:text-foreground/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


