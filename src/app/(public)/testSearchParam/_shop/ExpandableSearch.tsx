// src/app/(public)/testSearchParam/_shop/ExpqndableSearch.tsx



'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ChevronUp, ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react';
import { Filters } from "./Filters"; 

interface ExpandableSearchProps {
  productTypes: any[];
  categories: any[];
  path: string;
  productsLength: number;
}

export function ExpandableSearch({ productTypes, categories, path, productsLength }: ExpandableSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Hàm update URL khi chọn Category
  const handleCategoryClick = (catPath: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catPath) params.set('cat', catPath);
    else params.delete('cat');
    
    params.set('page', '1'); // Reset về trang 1
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4 mb-12">
      <div className="flex items-center gap-3 bg-card/40 backdrop-blur-3xl p-2 rounded-full border border-border/40 shadow-xl">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            isExpanded ? "bg-primary text-white" : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      <div className={`transition-all duration-500 overflow-hidden ${
        isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      }`}>
        {/* Đưa Filters vào đây */}
        <Filters productTypes={productTypes} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-card/40 backdrop-blur-3xl p-2 rounded-[2rem] border border-border/40 shadow-2xl overflow-x-auto no-scrollbar">
            
            <button
              onClick={() => handleCategoryClick("")}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                !path ? "bg-foreground text-background border-foreground" : "border-transparent text-foreground/40"
              }`}
            >
              All Series
            </button>

            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.category_path)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                  path === cat.category_path
                  ? "bg-primary text-white border-primary"
                  : "border-transparent text-foreground/40 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {cat.category_depth > 0 && <ChevronRight className="w-3 h-3 opacity-30" />}
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 px-6 text-[10px] font-black uppercase tracking-widest text-foreground/30 italic">
            <LayoutGrid className="w-3.5 h-3.5" />
            Showing {productsLength} Results
          </div>
        </div>
      </div>
    </div>
  );
}

/*
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, ChevronUp, ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react';
import { Filters } from "./Filters__a__"; // Điều chỉnh đường dẫn import cho đúng

interface ExpandableSearchProps {
  productTypes: any[];
  categories: any[];
  path: string;
  productsLength: number;
}
*/

export function ExpandableSearch_({ 
  productTypes, 
  categories, 
  path, 
  productsLength 
}: ExpandableSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-4 mb-12">
      {/* SEARCH BAR CHÍNH & TOGGLE BUTTON */}
      <div className="flex items-center gap-3 bg-card/40 backdrop-blur-3xl p-2 rounded-full border border-border/40 shadow-xl">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            isExpanded ? "bg-primary text-white" : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* PHẦN CATEGORY TOOLBAR (BỊ ẨN/HIỆN) */}
      <div className={`transition-all duration-500 overflow-hidden ${
        isExpanded ? "max-h-[500px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-card/40 backdrop-blur-3xl p-2 rounded-[2rem] border border-border/40 shadow-2xl shadow-black/5 overflow-x-auto no-scrollbar">
            <Filters productTypes={productTypes} />
            
            <Link 
              href="/testSearchFilter"
              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${
                !path ? "bg-foreground text-background border-foreground shadow-lg" : "border-transparent text-foreground/40 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              All Series
            </Link>

            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/testSearchFilter/${cat.category_path}`}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border whitespace-nowrap ${
                  path === cat.category_path
                  ? "bg-primary text-white border-primary shadow-[0_10px_20px_rgba(var(--primary),0.3)]"
                  : "border-transparent text-foreground/40 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {cat.category_depth > 0 && <ChevronRight className="w-3 h-3 opacity-30" />}
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 px-6 text-[10px] font-black uppercase tracking-widest text-foreground/30 italic">
            <LayoutGrid className="w-3.5 h-3.5" />
            Showing {productsLength} Results
          </div>
        </div>
      </div>
    </div>
  );
}
