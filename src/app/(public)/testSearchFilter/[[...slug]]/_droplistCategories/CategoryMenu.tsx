'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, FolderTree, ChevronRight } from 'lucide-react';

export function CategoryMegaMenu({ categoryTree, path }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* NÚT KÍCH HOẠT CHÍNH */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
          isOpen 
          ? "border-primary bg-primary text-white shadow-lg" 
          : "border-transparent text-foreground/60 hover:bg-foreground/5"
        }`}
      >
        <FolderTree className="w-3 h-3" />
        {path ? "Changing Category" : "Browse Categories"}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* NỘI DUNG DROPDOWN KHI USER CẦN */}
      {isOpen && (
        <>
          {/* Overlay để click ra ngoài thì đóng */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute top-full left-0 mt-4 w-[280px] md:w-[450px] bg-card/95 backdrop-blur-2xl border border-border rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-50 animate-in fade-in zoom-in-95 duration-200">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-4">Select a category</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {categoryTree.map((parent: any) => (
                <div key={parent.id} className="space-y-3">
                  {/* Category Cha */}
                  <Link
                    href={`/testSearchFilter/${parent.category_path}`}
                    onClick={() => setIsOpen(false)}
                    className={`block text-[11px] font-black uppercase tracking-wider hover:text-primary transition-colors ${
                      path.startsWith(parent.category_path) ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {parent.name}
                  </Link>

                  {/* Danh sách con hiển thị luôn bên dưới cha (Tree-style) */}
                  {parent.children && (
                    <div className="flex flex-col gap-2 pl-3 border-l border-border/60">
                      {parent.children.map((child: any) => (
                        <Link
                          key={child.id}
                          href={`/testSearchFilter/${child.category_path}`}
                          onClick={() => setIsOpen(false)}
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
  );
}




// Cách sử dụng
/* 2. CATEGORY TOOLBAR 
<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
  <div className="flex items-center gap-3 bg-card/40 backdrop-blur-3xl p-2 rounded-[2rem] border border-border/40 shadow-2xl shadow-black/5">
    
    //Nút lọc Loại sản phẩm (Type) 
    <Filters productTypes={productTypes} />

    <div className="h-6 w-[1px] bg-border/40 mx-1" /> //Vạch ngăn cách

    // NÚT DROPDOWN CHÍNH - GOM TẤT CẢ CATEGORIES VÀO ĐÂY
    <CategoryMegaMenu categoryTree={categoryTree} path={path} />

    //Nút Reset về All 
    <Link 
      href="/testSearchFilter" prefetch={true}
      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
        !path ? "bg-primary text-white" : "text-foreground/40 hover:text-primary"
      }`}
    >
      All
    </Link>
  </div>

  <div className="hidden md:flex items-center gap-4 px-6 text-[10px] font-black uppercase tracking-widest text-foreground/30 italic">
    <LayoutGrid className="w-3.5 h-3.5" />
    {products.length} Results
  </div>
</div>
*/



