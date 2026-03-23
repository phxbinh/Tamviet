// src/app/(public)/testSearchParam/_shop/ExpandableSearch.tsx
'use client';

import { useState, useTransition } from 'react';
import { SlidersHorizontal, ChevronUp, ChevronDown, LayoutGrid, FolderTree, ChevronRight } from 'lucide-react';
import { Filters } from "./Filters"; 
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function ExpandableSearch({ productTypes, categoryTree, path, productsLength }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPending] = useTransition();
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
          className={`flex items-center gap-2 px-4 py-2 transition-all ${isExpanded ? "bg-primary text-white" : "bg-foreground/5 text-foreground/60"}`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className={`transition-all duration-500 ${
        isExpanded ? "max-h-[2000px] opacity-100 overflow-visible" : "max-h-0 opacity-0 overflow-hidden pointer-events-none"
      }`}>
        <Filters productTypes={productTypes} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4 px-2">
          {/* MEGA DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${isDropdownOpen ? "bg-primary text-white border-primary" : "border-foreground/10 bg-card/50 text-foreground/60"}`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              {path ? path.split('/').pop() : "Browse Categories"}
              <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-[60]" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute top-full left-0 mt-4 w-[280px] md:w-[500px] bg-card/95 backdrop-blur-2xl border border-border rounded-[2rem] p-6 shadow-2xl z-[70] animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between mb-4 border-b border-border pb-2">
                    <p className="text-[9px] font-black uppercase text-primary">Select Category</p>
                    <Link href={getCategoryHref("")} onClick={() => setIsDropdownOpen(false)} className="text-[9px] font-bold text-foreground/40 hover:text-primary">Clear</Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    {categoryTree.map((parent: any) => (
                      <div key={parent.id} className="space-y-2">
                        <Link href={getCategoryHref(parent.category_path)} onClick={() => setIsDropdownOpen(false)} className={`block text-[11px] font-black uppercase hover:text-primary ${path === parent.category_path ? "text-primary" : ""}`}>
                          {parent.name}
                        </Link>
                        {parent.children?.map((child: any) => (
                          <Link key={child.id} href={getCategoryHref(child.category_path)} onClick={() => setIsDropdownOpen(false)} className={`text-[10px] font-bold text-foreground/40 hover:text-primary flex items-center justify-between group pl-3 border-l border-border/60 ${path === child.category_path ? "text-primary italic" : ""}`}>
                            {child.name}
                            <ChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-all" />
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* COUNT */}
          <div className="flex items-center gap-4 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/30 italic">
            <LayoutGrid className="w-3.5 h-3.5" />
            {isPending ? "Loading..." : `${productsLength} Results`}
          </div>
        </div>
      </div>
    </div>
  );
}
