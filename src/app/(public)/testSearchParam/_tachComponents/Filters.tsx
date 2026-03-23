'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect, useRef } from 'react';
import { X, Search, Tag, ArrowUpDown, Loader2, CircleDollarSign } from 'lucide-react';

export interface ProductType {
  code: string;
  name: string;
}

const itemStyle = "relative flex items-center bg-card border border-border rounded-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary shadow-sm";
const iconStyle = "absolute left-3.5 w-4 h-4 text-foreground/40 pointer-events-none";
const inputStyle = "w-full bg-transparent pl-10 pr-4 py-2.5 text-sm font-medium outline-none placeholder:text-foreground/30 text-foreground";

export function Filters({ productTypes }: { productTypes: ProductType[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const isTypingRef = useRef(false);

  // ✅ ALWAYS dùng string snapshot
  const paramsString = searchParams.toString();

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(paramsString);

    Object.entries(updates).forEach(([k, v]) => {
      if (v && v !== '') params.set(k, v);
      else params.delete(k);
    });

    params.set('page', '1');

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  // ✅ URL -> State (stable)
  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? '';

    if (!isTypingRef.current && urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [paramsString]); // 👈 dùng string thay vì object

  // ✅ State -> URL (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      const current = searchParams.get('search') ?? '';

      if (search !== current) {
        updateFilters({ search: search || null });
      }

      isTypingRef.current = false;
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="flex overflow-y-auto no-scrollbar flex-col lg:flex-row gap-4 items-center w-full py-6">
      
      {/* SEARCH */} {/*
      <div className={`${itemStyle} w-full lg:w-80`}>
        <Search className={iconStyle} />
        <input
          value={search}
          onChange={(e) => {
            isTypingRef.current = true;
            setSearch(e.target.value);
          }}
          placeholder="Tìm kiếm sản phẩm..."
          className={inputStyle}
        />
        {isPending && <Loader2 className="absolute right-3 w-4 h-4 animate-spin text-primary" />}
      </div> */}

<div className={`${itemStyle} w-full lg:w-80`}>
  <Search className={iconStyle} />

  <input
    value={search}
    onChange={(e) => {
      isTypingRef.current = true;
      setSearch(e.target.value);
    }}
    placeholder="Tìm kiếm sản phẩm..."
    className={inputStyle}
  />

  {/* 🔥 CLEAR BUTTON */}
  {search && !isPending && (
    <button
      onClick={() => {
        isTypingRef.current = false;
        setSearch('');
        updateFilters({ search: null }); // 🚀 push ngay
      }}
      className="absolute right-3 w-4 h-4 text-foreground/40 hover:text-primary transition"
    >
      <X className="w-4 h-4" />
    </button>
  )}

  {/* LOADING */}
  {isPending && (
    <Loader2 className="absolute right-3 w-4 h-4 animate-spin text-primary" />
  )}
</div>



      <div className="flex flex-wrap md:flex-nowrap gap-3 w-full lg:w-auto">

        {/* TYPE */}
        <div className={`${itemStyle} flex-1 lg:w-52`}>
          <Tag className={iconStyle} />
          <select
            value={searchParams.get('type') ?? ''}
            onChange={(e) => updateFilters({ type: e.target.value || null })}
            className={`${inputStyle} appearance-none cursor-pointer`}
          >
            <option value="" className="bg-card">Tất cả danh mục</option>
            {productTypes.map(t => (
              <option key={t.code} value={t.code} className="bg-card">
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* SORT */}
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

        {/* PRICE (FIX SYNC) */}
        <div className={`${itemStyle} px-3 py-1 lg:w-60 gap-2`}>
          <CircleDollarSign className="w-4 h-4 text-foreground/40 ml-1" />
          <div className="flex items-center grow">
            <input
              type="number"
              placeholder="Min"
              value={searchParams.get('min') ?? ''}
              onChange={(e) => updateFilters({ min: e.target.value || null })}
              className="w-full bg-transparent text-sm font-semibold text-center outline-none placeholder:font-normal placeholder:text-foreground/30"
            />
            <span className="text-border px-1">|</span>
            <input
              type="number"
              placeholder="Max"
              value={searchParams.get('max') ?? ''}
              onChange={(e) => updateFilters({ max: e.target.value || null })}
              className="w-full bg-transparent text-sm font-semibold text-center outline-none placeholder:font-normal placeholder:text-foreground/30"
            />
          </div>
        </div>

      </div>
    </div>
  );
}