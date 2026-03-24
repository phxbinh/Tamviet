'use client';

import { useTransition, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterContent } from './FilterContent_';

interface FilterPanelProps {
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;

  productTypes: any[];
  categoryTree: any[];
  path: string;
}

export function FilterPanel({
  isExpanded,
  setIsExpanded,
  productTypes,
  categoryTree,
  path
}: FilterPanelProps) {

  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  }, [isExpanded]);

  // ❌ BỎ cái này (gây UX giật)
  // useEffect(() => {
  //   if (isExpanded) {
  //     setIsExpanded(false);
  //   }
  // }, [paramsString]);

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`fixed inset-0 z-[105] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsExpanded(false)}
      />

      {/* MOBILE */}
      <div
        className={`fixed top-0 left-0 h-full w-[90%] max-w-[420px] bg-card/95 backdrop-blur-3xl border-r border-border/40 z-[110] transition-transform duration-500 ${
          isExpanded ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="h-full overflow-y-auto p-6">
          <FilterContent
            productTypes={productTypes}
            categoryTree={categoryTree}
            path={path}
            isPending={isPending}
            startTransition={startTransition}
            onNavigate={() => setIsExpanded(false)} // 🔥 đóng panel ngay khi click
          />
        </div>
      </div>

      {/* DESKTOP */}
      <div
        className={`hidden md:block absolute top-full left-0 w-full z-[108] pt-2 transition-all duration-300 ${
          isExpanded
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-card/95 backdrop-blur-3xl border border-border/40 shadow-xl rounded-b-2xl">
          <div className="max-h-[75vh] overflow-y-auto p-6 md:p-8">
            <FilterContent
              productTypes={productTypes}
              categoryTree={categoryTree}
              path={path}
              isPending={isPending}
              startTransition={startTransition}
              onNavigate={() => setIsExpanded(false)} // 🔥 same
            />
          </div>
        </div>
      </div>
    </>
  );
}