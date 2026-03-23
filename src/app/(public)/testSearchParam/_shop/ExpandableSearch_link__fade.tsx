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
    <div className="relative w-full z-[100]">
      {/* 1. TRIGGER BUTTON: Nằm cố định trong luồng trang */}
      <div className="bg-card/40 backdrop-blur-3xl p-1 border border-border/40 shadow-xl relative z-[110]">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 transition-all duration-300 ${
            isExpanded ? "bg-primary text-white" : "bg-foreground/5 text-foreground/60"
          }`}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filters & Categories</span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. OVERLAY: Lớp nền mờ khi mở menu, giúp click ra ngoài là đóng */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-[105] bg-black/20 backdrop-blur-[2px] transition-opacity cursor-pointer" 
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* 3. ABSOLUTE CONTENT AREA: Bung ra đè lên mọi thứ bên dưới */}
      <div 
        className={`absolute top-full left-0 w-full z-[108] pt-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExpanded 
            ? "translate-y-0 opacity-100 pointer-events-auto" 
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        {/* Container nội dung có Scroll nội bộ */}
        <div className="bg-card/95 backdrop-blur-3xl border border-border/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden rounded-b-2xl">
          <div className="max-h-[75vh] overflow-y-auto custom-scrollbar p-6 md:p-8">
            
            {/* Hiệu ứng Loading khi chọn Category */}
            {isPending && (
              <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] z-[120] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-[9px] font-bold uppercase tracking-widest animate-pulse">Updating...</span>
                </div>
              </div>
            )}

            {/* SECTION: FILTERS */}
            <div className="mb-10">
              <Filters productTypes={productTypes} />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent my-10" />

            {/* SECTION: CATEGORIES GRID */}
            <div className="space-y-8">
              <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-3">
                  <FolderTree className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-primary">Browse Categories</p>
                    <p className="text-[9px] text-foreground/40 font-medium italic">Select a category to refine your search</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleCategoryClick("")}
                  className="text-[10px] font-bold text-foreground/30 hover:text-primary uppercase border-b border-transparent hover:border-primary transition-all pb-1"
                >
                  Clear All
                </button>
              </div>

              {/* GRID CONFIG: 2 cột mobile, 4 cột desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 items-start pt-4">
                {categoryTree.map((parent: any) => (
                  <div key={parent.id} className="flex flex-col gap-5">
                    {/* Parent Button */}
                    <button 
                      onClick={() => handleCategoryClick(parent.category_path)}
                      className={`text-left text-[11px] font-black uppercase tracking-tight transition-all duration-300 hover:pl-1 ${
                        path === parent.category_path 
                          ? "text-primary border-l-2 border-primary pl-3" 
                          : "text-foreground/90 hover:text-primary"
                      }`}
                    >
                      {parent.name}
                    </button>
                    
                    {/* Children List */}
                    <div className="flex flex-col gap-3 border-l border-border/20 pl-4">
                      {parent.children?.map((child: any) => (
                        <button 
                          key={child.id} 
                          onClick={() => handleCategoryClick(child.category_path)}
                          className={`text-left text-[10px] font-medium flex items-center justify-between group transition-all duration-200 ${
                            path === child.category_path 
                              ? "text-primary font-bold italic" 
                              : "text-foreground/50 hover:text-primary hover:translate-x-1"
                          }`}
                        >
                          <span className="leading-tight">{child.name}</span>
                          <ChevronRight className={`w-3 h-3 transition-all ${
                            path === child.category_path ? "opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bottom Spacing cho mobile */}
            <div className="h-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
