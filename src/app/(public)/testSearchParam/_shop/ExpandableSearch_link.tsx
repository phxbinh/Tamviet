// src/app/(public)/testSearchParam/_shop/ExpandableSearch_link.tsx
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { SlidersHorizontal, ChevronUp, ChevronDown, LayoutGrid, FolderTree, ChevronRight } from 'lucide-react';
import { Filters } from "./Filters"; 
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface ExpandableSearchProps {
  productTypes: any[];
  categoryTree: any[];
  path: string;
  productsLength: number;
}

export function ExpandableSearch({ productTypes, categoryTree, path, productsLength }: ExpandableSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPending] = useTransition();
  const searchParams = useSearchParams();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // Cập nhật vị trí dropdown khi mở hoặc resize/scroll
  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current && isDropdownOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 10, // +10px khoảng cách
          left: rect.left + window.scrollX,
        });
      }
    };

    updatePosition();

    // Listen resize & scroll để giữ vị trí chính xác
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isDropdownOpen]);

  const getCategoryHref = (catPath: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catPath) params.set('cat', catPath);
    else params.delete('cat');
    params.set('page', '1');
    return `?${params.toString()}`;
  };

  return (
    <div className="flex flex-col gap-0 relative z-[100]">
      
      {/* 1. NÚT FILTER CHÍNH */}
      <div className="flex items-center bg-card/40 backdrop-blur-3xl p-1 border border-border/40 shadow-xl relative z-[101]">
        <button 
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (isExpanded) setIsDropdownOpen(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
            isExpanded ? "bg-primary text-white" : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* 2. VÙNG NỘI DUNG (EXPANDABLE) */}
      <div 
        className={`transition-all duration-500 ease-in-out ${
          isExpanded 
            ? "max-h-[2000px] opacity-100 visible" 
            : "max-h-0 opacity-0 invisible overflow-hidden" 
        }`}
        style={{ overflow: isExpanded ? 'visible' : 'hidden' }}
      >
        <div className="bg-background/50 backdrop-blur-md border-x border-b border-border/40 pb-4">
          <Filters productTypes={productTypes} />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 px-4 relative">
            
            {/* --- MEGA MENU CATEGORIES --- */}
            <div className="relative inline-block">
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                  isDropdownOpen 
                    ? "border-primary bg-primary text-white shadow-lg" 
                    : "border-foreground/20 bg-card text-foreground/60 hover:bg-foreground/10"
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                {path ? `Category: ${path.split('/').pop()}` : "Browse Categories"}
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* DROPDOWN BOX - Sử dụng fixed + vị trí động */}
              {isDropdownOpen && (
                <>
                  {/* Overlay click-out để đóng khi click ngoài */}
                  <div 
                    className="fixed inset-0 z-[999]" 
                    onClick={() => setIsDropdownOpen(false)} 
                  />

                  {/* Dropdown chính */}
                  <div 
                    className={`
                      fixed z-[1000] bg-card border border-border rounded-[1.5rem] p-6 
                      shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] 
                      animate-in fade-in slide-in-from-top-2 duration-300
                      w-[300px] md:w-[550px]
                    `}
                    style={{
                      top: `${dropdownPosition.top}px`,
                      left: `${dropdownPosition.left}px`,
                    }}
                  >
                    <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Danh mục sản phẩm</p>
                      <Link 
                        href={getCategoryHref("")}
                        onClick={() => setIsDropdownOpen(false)}
                        className="text-[9px] font-bold uppercase text-foreground/30 hover:text-red-500 transition-colors"
                      >
                        Reset
                      </Link>
                    </div>
                    
                    {/* Vùng Scroll nội bộ nếu danh mục quá dài */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                      {categoryTree.map((parent: any) => (
                        <div key={parent.id} className="flex flex-col gap-3">
                          <Link
                            href={getCategoryHref(parent.category_path)}
                            onClick={() => setIsDropdownOpen(false)}
                            className={`text-[12px] font-black uppercase tracking-tight hover:text-primary transition-colors ${
                              path === parent.category_path ? "text-primary underline underline-offset-4" : "text-foreground"
                            }`}
                          >
                            {parent.name}
                          </Link>

                          {parent.children && parent.children.length > 0 && (
                            <div className="flex flex-col gap-2.5 pl-3 border-l-2 border-primary/10">
                              {parent.children.map((child: any) => (
                                <Link
                                  key={child.id}
                                  href={getCategoryHref(child.category_path)}
                                  onClick={() => setIsDropdownOpen(false)}
                                  className={`text-[11px] font-medium text-foreground/50 hover:text-primary hover:pl-1 transition-all flex items-center justify-between group ${
                                    path === child.category_path ? "text-primary font-bold italic" : ""
                                  }`}
                                >
                                  {child.name}
                                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
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
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-foreground/30 italic">
              <LayoutGrid className="w-3.5 h-3.5" />
              {isPending ? "Updating..." : `${productsLength} Items Found`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}