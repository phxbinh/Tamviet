'use client';

import { useState, useTransition, useEffect } from 'react';
import {
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  FolderTree,
  ChevronRight,
  Loader2
} from 'lucide-react';

import { Filters } from "./Filters";
import { useRouter, useSearchParams } from 'next/navigation';

export function ExpandableSearch({
  productTypes,
  categoryTree,
  path,
  productsLength
}: any) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ Lock scroll khi mở sidebar (mobile)
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

  // 🔥 TÁCH CONTENT RA (tránh duplicate)
  const renderContent = () => (
    <div className="relative h-full">
      {/* LOADING */}
      {isPending && (
        <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] z-[10] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-[9px] font-bold uppercase tracking-widest animate-pulse">
              Updating...
            </span>
          </div>
        </div>
      )}

      {/* FILTER */}
      <div className="mb-10">
        <Filters productTypes={productTypes} />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent my-2" />

      {/* CATEGORY */}
      <div className="space-y-8">
        <div className="flex justify-between items-end mb-4">
          <div className="flex items-center gap-3">
            <FolderTree className="w-5 h-5 text-primary" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-primary">
                Browse Categories
              </p>
              <p className="text-[9px] text-foreground/40 italic">
                Select a category to refine your search
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCategoryClick("")}
            className="text-[10px] font-bold text-foreground/30 hover:text-primary uppercase border-b border-transparent hover:border-primary transition-all pb-1"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-6">
          {categoryTree.map((parent: any) => (
            <div key={parent.id} className="flex flex-col gap-4">

              {/* PARENT */}
              <button
                onClick={() => handleCategoryClick(parent.category_path)}
                className={`text-left text-[11px] font-black uppercase transition-all ${
                  path === parent.category_path
                    ? "text-primary border-l-2 border-primary pl-3"
                    : "text-foreground/90 hover:text-primary"
                }`}
              >
                {parent.name}
              </button>

              {/* CHILD */}
              <div className="flex flex-col gap-3 border-l border-border/20 pl-4">
                {parent.children?.map((child: any) => (
                  <button
                    key={child.id}
                    onClick={() => handleCategoryClick(child.category_path)}
                    className={`text-left text-[10px] flex items-center justify-between group ${
                      path === child.category_path
                        ? "text-primary font-bold italic"
                        : "text-foreground/50 hover:text-primary"
                    }`}
                  >
                    <span>{child.name}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>

            </div>
          ))}
        </div>

        <div className="h-10" />
      </div>
    </div>
  );

  return (
    <>
      {/* 🔘 TRIGGER */}
      <div className="relative w-full z-[100]">
        <div className="bg-card/40 backdrop-blur-3xl p-1 border border-border/40 shadow-xl relative z-[110]">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 ${
              isExpanded ? "bg-primary text-white" : "bg-foreground/5 text-foreground/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className={`w-4 h-4 ${isExpanded ? 'rotate-180' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Filters & Categories
              </span>
            </div>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 🌑 OVERLAY */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[105] bg-black/30 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`fixed top-0 left-0 h-full w-[90%] max-w-[420px] bg-card/95 backdrop-blur-3xl border-r border-border/40 z-[110] transition-transform duration-500 md:hidden ${
          isExpanded ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto p-6 custom-scrollbar">
          {renderContent()}
        </div>
      </div>

      {/* ================= DESKTOP DROPDOWN ================= */}
      <div
        className={`hidden md:block absolute top-full left-0 w-full z-[108] pt-2 transition-all duration-500 ${
          isExpanded
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-card/95 backdrop-blur-3xl border border-border/40 shadow-xl rounded-b-2xl">
          <div className="max-h-[75vh] overflow-y-auto custom-scrollbar p-6 md:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}