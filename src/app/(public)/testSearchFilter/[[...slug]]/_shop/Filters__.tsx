'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';
import { Search, Tag, ArrowUpDown, Loader2 } from 'lucide-react';

export interface ProductType {
  code: string;
  name: string;
}

export function Filters({ productTypes }: { productTypes: ProductType[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // ✅ controlled state (fix sync URL)
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');
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

  // ✅ debounce search (500ms)
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateFilters({ search: search || null });
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-3 items-center w-full">
      
      {/* 1. SEARCH */}
      <div className="relative w-full lg:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Tìm sản phẩm..."
          className="w-full bg-background border border-border pl-9 pr-4 py-2 rounded-full text-[11px]"
        />
      </div>

      {/* 2. PRODUCT TYPE */}
      <div className="relative w-full lg:w-44">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <select
          value={searchParams.get('type') ?? ''}
          onChange={(e) => updateFilters({ type: e.target.value || null })}
          className="w-full bg-background border border-border pl-9 pr-8 py-2 rounded-full text-[11px]"
        >
          <option value="">Tất cả loại</option>
          {productTypes.map((type) => (
            <option key={type.code} value={type.code}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* 3. SORT */}
      <div className="relative w-full lg:w-44">
        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <select
          value={searchParams.get('sort') ?? 'newest'} // ✅ fix
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="w-full bg-background border border-border pl-9 pr-8 py-2 rounded-full text-[11px]"
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá: Thấp → Cao</option>
          <option value="price_desc">Giá: Cao → Thấp</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      {/* 4. PRICE */}
      <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-full">
        
        <input
          type="number"
          placeholder="Min"
          defaultValue={searchParams.get('min') ?? ''}
          onBlur={(e) =>
            updateFilters({
              min: e.target.value ? e.target.value : null, // ✅ fix
            })
          }
          className="w-14 text-[11px]"
        />

        <span>-</span>

        <input
          type="number"
          placeholder="Max"
          defaultValue={searchParams.get('max') ?? ''}
          onBlur={(e) =>
            updateFilters({
              max: e.target.value ? e.target.value : null, // ✅ fix
            })
          }
          className="w-14 text-[11px]"
        />
      </div>

      {/* LOADING */}
      <div className="w-6 flex justify-center">
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
      </div>
    </div>
  );
}