// src/app/(public)/testSearchParam/_shop/ExpandableSearch.tsx
'use client';

import { useState } from 'react';
import { SlidersHorizontal, ChevronUp, ChevronDown, FolderTree, ChevronRight } from 'lucide-react';
import { Filters } from "./Filters"; 
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function ExpandableSearch({ productTypes, categoryTree, path, productsLength }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchParams = useSearchParams();

  const getCategoryHref = (catPath: string) => {
    const params = new URLSearchParams(searchParams.toString());
    catPath ? params.set('cat', catPath) : params.delete('cat');
    params.set('page', '1');
    return `?${params.toString()}`;
  };

  return (
    <div className="flex flex-col relative z-50">
      {/* TRIGGER BUTTON */}
      <div className="bg-card/40 backdrop-blur-3xl p-1 border border-border/40 shadow-xl">
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

      {/* CONTENT AREA - Đã thêm scroll và bỏ overflow-hidden khi mở */}
      <div className={`transition-all duration-500 ease-in-out ${
        isExpanded 
          ? "max-h-[70vh] opacity-100 overflow-y-auto custom-scrollbar p-4 bg-card/30 backdrop-blur-xl border-x border-b border-border/40" 
          : "max-h-0 opacity-0 overflow-hidden pointer-events-none"
      }`}>
        
        {/* 1. Phần Filters cũ */}
        <Filters productTypes={productTypes} />

        <div className="h-px bg-border/40 my-6" />

        {/* 2. Phần Categories - Hiển thị trực tiếp, không dùng dropdown */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-primary" />
              <p className="text-[10px] font-black uppercase tracking-tighter text-primary">
                Browse Categories
              </p>
            </div>
            <Link 
              href={getCategoryHref("")} 
              className="text-[9px] font-bold text-foreground/40 hover:text-primary uppercase"
            >
              Clear Selection
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categoryTree.map((parent: any) => (
              <div key={parent.id} className="flex flex-col gap-3">
                <Link 
                  href={getCategoryHref(parent.category_path)} 
                  className={`text-[11px] font-black uppercase tracking-wide hover:text-primary transition-colors ${
                    path === parent.category_path ? "text-primary underline underline-offset-4" : "text-foreground/80"
                  }`}
                >
                  {parent.name}
                </Link>
                
                <div className="flex flex-col gap-2 pl-3 border-l border-border/60">
                  {parent.children?.map((child: any) => (
                    <Link 
                      key={child.id} 
                      href={getCategoryHref(child.category_path)} 
                      className={`text-[10px] font-bold flex items-center justify-between group transition-all ${
                        path === child.category_path 
                          ? "text-primary italic" 
                          : "text-foreground/40 hover:text-primary hover:pl-1"
                      }`}
                    >
                      {child.name}
                      <ChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-transform translate-x-[-4px] group-hover:translate-x-0" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
