'use client';

import {
  FolderTree,
  ChevronRight,
  Loader2
} from 'lucide-react';

import { Filters } from "./Filters";

interface FilterContentProps {
  productTypes: any[];
  categoryTree: any[];
  path: string;
  isPending: boolean;
  handleCategoryClick: (catPath: string) => void;
}

export function FilterContent({
  productTypes,
  categoryTree,
  path,
  isPending,
  handleCategoryClick
}: FilterContentProps) {
  return (

    /*<div className="relative h-full overflow-y-auto no-scrollbar">
Lỗi hiển thị không full FilterPanel
      {isPending && (
        <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] z-[10] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-[9px] font-bold uppercase tracking-widest animate-pulse">
              Updating...
            </span>
          </div>
        </div>
      )}*/


<div className="relative h-full">
      {isPending && (
        <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] z-[20] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-[9px] font-bold uppercase tracking-widest animate-pulse">
              Updating...
            </span>
          </div>
        </div>
      )}
    <div className="relative h-full overflow-y-auto no-scrollbar">
      <div className="mb-10">
        <Filters productTypes={productTypes} />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent my-2" />

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

        <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
          {categoryTree.map((parent: any) => (
            <div key={parent.id} className="flex flex-col gap-4">
        
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
    </div>
  );
}