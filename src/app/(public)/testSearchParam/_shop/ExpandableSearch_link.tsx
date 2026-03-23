// src/app/(public)/testSearchParam/_shop/ExpandableSearch.tsx
'use client';

import { useState, useTransition } from 'react';
import { SlidersHorizontal, ChevronUp, ChevronDown, LayoutGrid, FolderTree, ChevronRight } from 'lucide-react';
import { Filters } from "./Filters"; 
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface ExpandableSearchProps {
  productTypes: any[];
  categoryTree: any[]; // Đổi từ categories sang categoryTree
  path: string;
  productsLength: number;
}

export function ExpandableSearch({ productTypes, categoryTree, path, productsLength }: ExpandableSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State cho Mega Menu
  const [isPending] = useTransition();
  const searchParams = useSearchParams();

  // Hàm build URL giữ lại các params khác (giá, sort, type...)
  const getCategoryHref = (catPath: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catPath) params.set('cat', catPath);
    else params.delete('cat');
    params.set('page', '1');
    return `?${params.toString()}`;
  };

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center bg-card/40 backdrop-blur-3xl p-1 border border-border/40 shadow-xl">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
            isExpanded ? "bg-primary text-white" : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      <div className={`transition-all duration-500 overflow-hidden ${
        isExpanded ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      }`}>
        <Filters productTypes={productTypes} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 pb-4 px-2">
          
          {/* CATEGORY MEGA MENU (THAY THẾ SỐ 1 BẰNG SỐ 2) */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                isDropdownOpen 
                ? "border-primary bg-primary text-white shadow-lg" 
                : "border-foreground/10 bg-card/50 text-foreground/60 hover:bg-foreground/5"
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              {path ? "Category: " + path.split('/').pop() : "Browse Categories"}
              <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute top-full left-0 mt-4 w-[280px] md:w-[500px] bg-card/95 backdrop-blur-2xl border border-border rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-200 z-50">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Select a category</p>
                    <Link 
                      href={getCategoryHref("")}
                      onClick={() => setIsDropdownOpen(false)}
                      className="text-[9px] font-bold uppercase text-foreground/40 hover:text-primary"
                    >
                      Clear All
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {categoryTree.map((parent: any) => (
                      <div key={parent.id} className="space-y-3">
                        <Link
                          href={getCategoryHref(parent.category_path)}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`block text-[11px] font-black uppercase tracking-wider hover:text-primary transition-colors ${
                            path === parent.category_path ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {parent.name}
                        </Link>

                        {parent.children && parent.children.length > 0 && (
                          <div className="flex flex-col gap-2 pl-3 border-l border-border/60">
                            {parent.children.map((child: any) => (
                              <Link
                                key={child.id}
                                href={getCategoryHref(child.category_path)}
                                onClick={() => setIsDropdownOpen(false)}
                                className={`text-[10px] font-bold text-foreground/40 hover:text-primary transition-colors flex items-center justify-between group ${
                                  path === child.category_path ? "text-primary italic" : ""
                                }`}
                              >
                                {child.name}
                                <ChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-all" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RESULT COUNT */}
          <div className="flex items-center gap-4 px-6 text-[10px] font-black uppercase tracking-widest text-foreground/30 italic">
            <LayoutGrid className="w-3.5 h-3.5" />
            {isPending ? "Loading..." : `Showing ${productsLength} Results`}
          </div>
        </div>
      </div>
    </div>
  );
}
