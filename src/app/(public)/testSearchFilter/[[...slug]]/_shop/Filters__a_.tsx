'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect, useRef } from 'react';
import { Search, Tag, ArrowUpDown, Loader2, CircleDollarSign } from 'lucide-react';

export interface ProductType {
  code: string;
  name: string;
}

export function Filters({ productTypes }: { productTypes: ProductType[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? '';
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  function updateFilters(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== '') params.set(key, value);
      else params.delete(key);
    });
    params.set('page', '1');
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const current = searchParams.get('search') ?? '';
      if (search !== current) updateFilters({ search: search || null });
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  // Style chung cho các filter item
  const itemStyle = "relative flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-zinc-900/10 dark:focus-within:ring-white/10 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 shadow-sm";
  const iconStyle = "absolute left-3.5 w-3.5 h-3.5 text-zinc-400 pointer-events-none";
  const inputStyle = "w-full bg-transparent pl-10 pr-4 py-2.5 text-[12px] font-medium outline-none placeholder:text-zinc-400 text-zinc-700 dark:text-zinc-200";

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center w-full py-4">
      
      {/* SEARCH FIELD */}
      <div className={`${itemStyle} w-full lg:w-72`}>
        <Search className={iconStyle} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Tìm kiếm sản phẩm cao cấp..."
          className={inputStyle}
        />
        {isPending && (
          <div className="absolute right-3">
            <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-3 w-full lg:w-auto">
        {/* PRODUCT TYPE SELECT */}
        <div className={`${itemStyle} flex-1 lg:w-48`}>
          <Tag className={iconStyle} />
          <select
            value={searchParams.get('type') ?? ''}
            onChange={(e) => updateFilters({ type: e.target.value || null })}
            className={`${inputStyle} appearance-none cursor-pointer`}
          >
            <option value="">Tất cả danh mục</option>
            {productTypes.map((type) => (
              <option key={type.code} value={type.code}>{type.name}</option>
            ))}
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
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp → Cao</option>
            <option value="price_desc">Giá: Cao → Thấp</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </div>

        {/* PRICE RANGE CAPSULE */}
        <div className={`${itemStyle} px-3 py-1 lg:w-56 gap-2`}>
          <CircleDollarSign className="w-3.5 h-3.5 text-zinc-400 ml-1" />
          <div className="flex items-center grow">
            <input
              type="number"
              placeholder="Min"
              defaultValue={searchParams.get('min') ?? ''}
              onBlur={(e) => updateFilters({ min: e.target.value || null })}
              className="w-full bg-transparent text-[11px] font-semibold text-center outline-none placeholder:font-normal"
            />
            <span className="text-zinc-300 dark:text-zinc-700 px-1">|</span>
            <input
              type="number"
              placeholder="Max"
              defaultValue={searchParams.get('max') ?? ''}
              onBlur={(e) => updateFilters({ max: e.target.value || null })}
              className="w-full bg-transparent text-[11px] font-semibold text-center outline-none placeholder:font-normal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
