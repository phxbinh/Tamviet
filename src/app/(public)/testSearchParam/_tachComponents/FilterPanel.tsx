'use client';

import { useTransition, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterContent } from './FilterContent';

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
  const router = useRouter();

  // Khóa cuộn khi mở filter
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isExpanded]);

  const handleCategoryClick = (catPath: string) => {
    const params = new URLSearchParams(searchParams.toString());
    catPath ? params.set('cat', catPath) : params.delete('cat');
    params.set('page', '1');

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <>
      {/* OVERLAY - Dùng chung cho cả Mobile và Desktop */}
      <div
        className={`fixed inset-0 z-[105] bg-black/20 backdrop-blur-[2px] transition-opacity duration-500 ${
          isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsExpanded(false)}
      />

      {/* MOBILE (Dọc & Ngang) */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[380px] bg-card/95 backdrop-blur-3xl border-r border-border/40 z-[110] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isExpanded ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="h-full overflow-y-auto p-6 custom-scrollbar">
          <FilterContent
            productTypes={productTypes}
            categoryTree={categoryTree}
            path={path}
            isPending={isPending}
            handleCategoryClick={handleCategoryClick}
          />
        </div>
      </div>

      {/* DESKTOP (Fix lỗi trôi khi scroll) */}
      <div
        className={`hidden md:block fixed left-0 right-0 z-[108] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isExpanded
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        // top-16 khớp với chiều cao Header của PublicShell, landscape:top-12 khớp khi xoay ngang
        style={{ top: 'calc(var(--header-height, 64px) + 48px)' }} 
        // Lưu ý: 48px là chiều cao toolbar chứa nút Filter của bạn, hãy điều chỉnh cho khớp
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-card/95 backdrop-blur-3xl border border-border/40 shadow-2xl rounded-2xl overflow-hidden">
            <div className="max-h-[70vh] overflow-y-auto p-8 custom-scrollbar">
              <FilterContent
                productTypes={productTypes}
                categoryTree={categoryTree}
                path={path}
                isPending={isPending}
                handleCategoryClick={handleCategoryClick}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
