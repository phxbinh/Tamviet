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

      {/* CONTENT AREA - Scrollable Container */}
      <div className={`transition-all duration-500 ease-in-out ${
        isExpanded 
          ? "max-h-[80vh] opacity-100 overflow-y-auto custom-scrollbar p-6 bg-card/95 backdrop-blur-2xl border-x border-b border-border/40 shadow-2xl" 
          : "max-h-0 opacity-0 overflow-hidden pointer-events-none"
      }`}>
        
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
              <p className="text-[11px] font-black uppercase tracking-widest text-primary">
                Explore Categories
              </p>
            </div>
            <Link 
              href={getCategoryHref("")} 
              className="text-[10px] font-bold text-foreground/30 hover:text-primary transition-colors uppercase border-b border-transparent hover:border-primary"
            >
              Reset Category
            </Link>
          </div>

          {/* GRID CONFIGURATION: Mobile 2 cols, Desktop 4 cols */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 items-start">
            {categoryTree.map((parent: any) => (
              <div key={parent.id} className="flex flex-col gap-4">
                {/* Parent Category */}
                <Link 
                  href={getCategoryHref(parent.category_path)} 
                  className={`text-[11px] font-black uppercase tracking-tight hover:text-primary transition-all leading-tight ${
                    path === parent.category_path ? "text-primary" : "text-foreground/90"
                  }`}
                >
                  {parent.name}
                </Link>
                
                {/* Children List */}
                <div className="flex flex-col gap-2.5 border-l border-border/40 pl-3">
                  {parent.children?.map((child: any) => (
                    <Link 
                      key={child.id} 
                      href={getCategoryHref(child.category_path)} 
                      className={`text-[10px] font-medium flex items-start justify-between group transition-all leading-relaxed ${
                        path === child.category_path 
                          ? "text-primary font-bold italic" 
                          : "text-foreground/50 hover:text-primary"
                      }`}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {child.name}
                      </span>
                      <ChevronRight className="w-2.5 h-2.5 mt-0.5 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
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
