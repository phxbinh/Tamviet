'use client';

import { useState, useTransition } from 'react';
import { SlidersHorizontal, ChevronUp, ChevronDown, FolderTree, ChevronRight, Loader2 } from 'lucide-react';
import { Filters } from "./Filters"; 
import { useRouter, useSearchParams } from 'next/navigation';

export function ExpandableSearch({ productTypes, categoryTree, path, productsLength }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCategoryClick = (catPath: string) => {
    const params = new URLSearchParams(searchParams.toString());
    catPath ? params.set('cat', catPath) : params.delete('cat');
    params.set('page', '1');
    
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col relative z-50 w-full">
      {/* TRIGGER BUTTON */}
      <div className="bg-card/40 backdrop-blur-3xl p-1 border border-border/40 shadow-xl relative z-[60]">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full flex items-center justify-between gap-2 px-4 py-2 transition-all ${
            isExpanded ? "bg-primary text-white" : "bg-foreground/5 text-foreground/60"
          }`}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Filters & Categories</span>
          </div>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* OVERLAY: Click ra ngoài để đóng menu */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px]" 
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* CONTENT AREA - CHUYỂN SANG ABSOLUTE */}
      <div className={`absolute top-full left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isExpanded 
          ? "translate-y-0 opacity-100 pointer-events-auto" 
          : "-translate-y-4 opacity-0 pointer-events-none"
      }`}>
        <div className="mt-2 max-h-[70vh] overflow-y-auto custom-scrollbar p-6 bg-card/95 backdrop-blur-3xl border border-border/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          
          {/* Trạng thái loading khi đang load category */}
          {isPending && (
            <div className="absolute inset-0 bg-card/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {/* SECTION: FILTERS */}
          <div className="mb-8">
              <Filters productTypes={productTypes} />
          </div>

          <div className="h-px bg-border/20 my-8" />

          {/* SECTION: CATEGORIES GRID */}
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-primary" />
                <p className="text-[11px] font-black uppercase tracking-widest text-primary">Explore Categories</p>
              </div>
              <button 
                onClick={() => handleCategoryClick("")}
                className="text-[10px] font-bold text-foreground/30 hover:text-primary uppercase"
              >
                Reset
              </button>
            </div>

            {/* Grid: 2 cột mobile, 4 cột desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 items-start pb-4">
              {categoryTree.map((parent: any) => (
                <div key={parent.id} className="flex flex-col gap-4">
                  <button 
                    onClick={() => handleCategoryClick(parent.category_path)}
                    className={`text-left text-[11px] font-black uppercase tracking-tight hover:text-primary transition-all ${
                      path === parent.category_path ? "text-primary" : "text-foreground/90"
                    }`}
                  >
                    {parent.name}
                  </button>
                  
                  <div className="flex flex-col gap-2.5 border-l border-border/40 pl-3">
                    {parent.children?.map((child: any) => (
                      <button 
                        key={child.id} 
                        onClick={() => handleCategoryClick(child.category_path)}
                        className={`text-left text-[10px] font-medium flex items-start justify-between group transition-all ${
                          path === child.category_path ? "text-primary font-bold italic" : "text-foreground/50 hover:text-primary"
                        }`}
                      >
                        <span className="group-hover:translate-x-1 transition-transform">{child.name}</span>
                        <ChevronRight className="w-2.5 h-2.5 mt-0.5 opacity-0 group-hover:opacity-100 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
