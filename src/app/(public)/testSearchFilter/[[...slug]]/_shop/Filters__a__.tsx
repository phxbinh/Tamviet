'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect, useCallback } from 'react';
import { Search, Tag, ArrowUpDown, Loader2, CircleDollarSign } from 'lucide-react';

export function Filters({ productTypes }: { productTypes: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // ✅ 1. CHỈ dùng Local State để điều khiển Input (Mượt 100%)
  const [inputValue, setInputValue] = useState(searchParams.get('search') ?? '');

  // ✅ 2. Hàm update URL (Tối ưu hóa memo)
  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set('page', '1');

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }, [searchParams, router]);

  // ✅ 3. Debounce Search: Chỉ push URL, không đụng vào Local State
  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentSearch = searchParams.get('search') ?? '';
      if (inputValue !== currentSearch) {
        updateFilters({ search: inputValue || null });
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [inputValue, updateFilters, searchParams]);

  // ✅ 4. Đồng bộ ngược từ URL (Chỉ khi User bấm Back/Forward trình duyệt)
  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? '';
    if (urlSearch !== inputValue) {
      setInputValue(urlSearch);
    }
  }, [searchParams]);

  // Style chuẩn "Stoic"
  const itemStyle = "relative flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-zinc-900/10 dark:focus-within:ring-white/10 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 shadow-sm";
  const iconStyle = "absolute left-3.5 w-3.5 h-3.5 text-zinc-400 pointer-events-none";

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center w-full py-4">
      {/* SEARCH FIELD - FIX LỖI NHẢY */}
      <div className={`${itemStyle} w-full lg:w-72`}>
        <Search className={iconStyle} />
        <input
          value={inputValue} // Luôn đi theo state nội bộ
          onChange={(e) => setInputValue(e.target.value)} // Gõ đến đâu ăn đến đó
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full bg-transparent pl-10 pr-10 py-2.5 text-[12px] font-medium outline-none placeholder:text-zinc-400 text-zinc-700 dark:text-zinc-200"
        />
        {isPending && (
          <div className="absolute right-3.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-3 w-full lg:w-auto">
        {/* TYPE & SORT (GIỮ NGUYÊN CSS SANG TRỌNG) */}
        <div className={`${itemStyle} flex-1 lg:w-48`}>
          <Tag className={iconStyle} />
          <select
            value={searchParams.get('type') ?? ''}
            onChange={(e) => updateFilters({ type: e.target.value || null })}
            className="w-full bg-transparent pl-10 pr-4 py-2.5 text-[12px] font-medium outline-none appearance-none cursor-pointer text-zinc-700 dark:text-zinc-200"
          >
            <option value="">Tất cả danh mục</option>
            {productTypes.map((t) => (
              <option key={t.code} value={t.code}>{t.name}</option>
            ))}
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
              className="w-full bg-transparent text-[11px] font-semibold text-center outline-none"
            />
            <span className="text-zinc-300 dark:text-zinc-700 px-1">|</span>
            <input
              type="number"
              placeholder="Max"
              defaultValue={searchParams.get('max') ?? ''}
              onBlur={(e) => updateFilters({ max: e.target.value || null })}
              className="w-full bg-transparent text-[11px] font-semibold text-center outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
