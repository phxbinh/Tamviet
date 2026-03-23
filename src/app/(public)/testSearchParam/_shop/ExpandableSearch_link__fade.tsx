'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, X, FolderTree, ChevronRight } from 'lucide-react';
import { Filters } from "./Filters"; 
import { useRouter, useSearchParams } from 'next/navigation';

export function ExpandableSearch({ productTypes, categoryTree, path, productsLength }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Khóa scroll body khi mở sidebar
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleCategoryClick = (catPath: string) => {
    const params = new URLSearchParams(searchParams.toString());
    catPath ? params.set('cat', catPath) : params.delete('cat');
    params.set('page', '1');
    
    router.push(`?${params.toString()}`, { scroll: false });
    // Thường thì chọn xong category trên mobile nên đóng sidebar lại
    // setIsOpen(false); 
  };

  return (
    <>
      {/* TRIGGER BUTTON - Cố định hoặc nằm trong luồng trang */}
      <div className="bg-card/40 backdrop-blur-3xl p-1 border border-border/40 shadow-xl inline-block">
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-6 py-2.5 bg-foreground/5 text-foreground/60 hover:bg-primary hover:text-white transition-all group"
        >
          <SlidersHorizontal className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Filters</span>
        </button>
      </div>

      {/* SIDEBAR OVERLAY (BACKDROP) */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* SIDEBAR CONTENT - Slide from right to left */}
      <div className={`fixed top-0 right-0 h-full w-[85vw] md:w-[450px] bg-card/95 backdrop-blur-3xl z-[101] shadow-[-20px_0_50px_rgba(0,0,0,0.2)] border-l border-border/40 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        
        {/* HEADER SIDEBAR */}
        <div className="flex items-center justify-between p-6 border-b border-border/40">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest">Advanced Filters</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY - SCROLLABLE AREA */}
        <div className="h-[calc(100%-80px)] overflow-y-auto custom-scrollbar p-6 pb-20">
          
          {/* SECTION: FILTERS */}
          <div className="mb-10">
              <Filters productTypes={productTypes} />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent my-10" />

          {/* SECTION: CATEGORIES */}
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-primary" />
                <p className="text-[11px] font-black uppercase tracking-widest text-primary">Categories</p>
              </div>
              <button 
                onClick={() => handleCategoryClick("")}
                className="text-[9px] font-bold text-foreground/30 hover:text-primary transition-colors uppercase underline underline-offset-4"
              >
                Reset
              </button>
            </div>

            {/* Render kiểu Sidebar List (Dọc) thay vì Grid để phù hợp chiều ngang hẹp của Sidebar */}
            <div className="flex flex-col gap-8">
              {categoryTree.map((parent: any) => (
                <div key={parent.id} className="group">
                  <button 
                    onClick={() => handleCategoryClick(parent.category_path)}
                    className={`w-full text-left text-[11px] font-black uppercase tracking-wider mb-3 transition-colors ${
                      path === parent.category_path ? "text-primary" : "text-foreground/90 hover:text-primary"
                    }`}
                  >
                    {parent.name}
                  </button>
                  
                  <div className="flex flex-col gap-1 border-l-2 border-border/20 ml-1">
                    {parent.children?.map((child: any) => (
                      <button 
                        key={child.id} 
                        onClick={() => handleCategoryClick(child.category_path)}
                        className={`text-left text-[10px] py-2 px-4 flex items-center justify-between transition-all ${
                          path === child.category_path 
                            ? "bg-primary/10 text-primary font-bold border-l-2 border-primary -ml-[2px]" 
                            : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
                        }`}
                      >
                        {child.name}
                        <ChevronRight className={`w-3 h-3 transition-transform ${path === child.category_path ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER SIDEBAR (Tùy chọn) */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-card border-t border-border/40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
           <button 
            onClick={() => setIsOpen(false)}
            className="w-full bg-primary text-white py-3 text-[10px] font-black uppercase tracking-[0.2em]"
           >
             Show Results ({productsLength})
           </button>
        </div>
      </div>
    </>
  );
}
