'use client';

import { useTransition, useEffect } from 'react';
import {
  FolderTree,
  ChevronRight,
  Loader2
} from 'lucide-react';

import { Filters } from "./Filters";
import { useRouter, useSearchParams } from 'next/navigation';

export function FilterPanel({
  isExpanded,
  setIsExpanded,
  productTypes,
  categoryTree,
  path
}: any) {

  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  }, [isExpanded]);

  const handleCategoryClick = (catPath: string) => {
    const params = new URLSearchParams(searchParams.toString());

    catPath ? params.set('cat', catPath) : params.delete('cat');
    params.set('page', '1');

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const renderContent = () => (
    <div className="relative h-full">
      {isPending && (
        <div className="absolute inset-0 z-[10] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      <div className="mb-10">
        <Filters productTypes={productTypes} />
      </div>

      <div className="h-px bg-border my-2" />

      <div className="space-y-6">
        {categoryTree.map((parent: any) => (
          <div key={parent.id}>
            <button onClick={() => handleCategoryClick(parent.category_path)}>
              {parent.name}
            </button>

            {parent.children?.map((child: any) => (
              <button key={child.id} onClick={() => handleCategoryClick(child.category_path)}>
                {child.name}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[105] bg-black/30"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* panel (giữ nguyên logic mobile + desktop của bạn) */}
      <div
        className={`fixed top-0 left-0 h-full w-[90%] max-w-[420px] bg-card z-[110] transition-transform ${
          isExpanded ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
    </>
  );
}