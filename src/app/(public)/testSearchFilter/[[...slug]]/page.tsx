// src/app/(public)/testCategories/[[...slug]]/page.tsx
'use client'

import Link from "next/link";
import { ProductCardSlug } from "@/components/shop/ProductCardSlugSearchFilter";
import { LayoutGrid, Filter, ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { getProductsByCategory, getProductTypes } from "./_server/getProductsByCategory__";
import { getCategoriesTree } from "@/lib/db/categories";
import { CategoryToolbar } from "./_shop/CategoryToolbar";
import { Filters } from "./_shop/Filters__a__";
import { Pagination } from "./_shop/Pagination";
//import { CategoryMegaMenu } from "./_droplistCategories/CategoryMenu";
import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronUp } from 'lucide-react';



export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Trước tiên, định nghĩa interface ngay trong page.tsx hoặc import từ Filters
interface ProductType {
  code: string;
  name: string;
}


export default async function Page({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug?: string[] }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

const [isExpanded, setIsExpanded] = useState(false);

  const { slug } = await params;
  const sParams = await searchParams;
  
  const path = slug?.join("/") || "";
  const page = Number(sParams.page) || 1;
  const search = sParams.search as string;
  const minPrice = sParams.min ? Number(sParams.min) : undefined;
  const maxPrice = sParams.max ? Number(sParams.max) : undefined;

  const allowedSort = ["price_asc", "price_desc", "newest", "oldest"] as const;
  type SortType = typeof allowedSort[number];
  const rawSort = sParams.sort;
  const sort: SortType = allowedSort.includes(rawSort as SortType)
    ? (rawSort as SortType)
    : "newest";

  const limit = 8;

  const [products, categories, productTypesData] = await Promise.all([
    getProductsByCategory({ 
      slug: path, 
      search, 
      minPrice, 
      maxPrice, 
      sort,
      productTypeCode: sParams.type as string, // Lọc theo code từ URL
      page, 
      limit 
    }),
    getCategoriesTree(),
    getProductTypes() // Lấy list cho droplist
  ]);

  // Ép kiểu (cast) dữ liệu trả về từ Database
  const productTypes = (productTypesData as unknown) as ProductType[];

  const totalCount = products[0]?.total_count || 0;

  // Tìm tên category hiện tại để làm Title cho "Hào hứng"
  const currentCategory = categories.find((c: any) => c.category_path === path);

  // Hàm phụ để nhóm các con vào cha (chỉ lấy đến level 1 để tránh quá sâu)
  const categoryTree = categories
    .filter((c: any) => c.category_depth === 0)
    .map((parent: any) => ({
      ...parent,
      children: categories.filter((child: any) => child.parent_id === parent.id)
    }));
  
  return (
    <div className="p-0"> {/*<div className="min-h-screen bg-background pb-20">*/}
      {/* 1. HERO HEADER: Tăng sự lôi kéo ngay từ đầu */}
      <div className="relative h-[30vh] md:h-[40vh] flex flex-col items-center justify-center overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05)_0%,transparent_70%)]" />
        
        <div className="relative z-10 text-center space-y-4 px-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-primary/30" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">
              Exclusive Collection
            </span>
            <div className="h-[1px] w-8 bg-primary/30" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase italic leading-none">
            {currentCategory?.name || "All Products"} <span className="text-primary">.</span>
          </h1>
          
          <p className="max-w-md mx-auto text-[11px] md:text-xs font-medium text-foreground/40 uppercase tracking-widest leading-relaxed">
            Khám phá những thiết kế tinh xảo được chọn lọc riêng cho phong cách của bạn.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-1 md:px-10 -mt-10 relative z-20">
        
        {/* 2. CATEGORY TOOLBAR: Thiết kế dạng Capsule scannable */} {/*
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-card/40 backdrop-blur-3xl p-2 rounded-[2rem] border border-border/40 shadow-2xl shadow-black/5 overflow-x-auto no-scrollbar">
            <Filters productTypes={productTypes} />
            <Link 
              href="/testSearchFilter" prefetch={true}
              className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${
                !path 
                ? "bg-foreground text-background border-foreground shadow-lg" 
                : "border-transparent text-foreground/40 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              All Series
            </Link>

            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/testSearchFilter/${cat.category_path}`} prefetch={true}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border whitespace-nowrap ${
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
            Showing {products.length} Results
          </div>
        </div> */}


  <div className="flex flex-col gap-4 mb-12">
    {/* SEARCH BAR CHÍNH & TOGGLE BUTTON */}
    <div className="flex items-center gap-3 bg-card/40 backdrop-blur-3xl p-2 rounded-full border border-border/40 shadow-xl">
      <div className="flex-1 flex items-center gap-3 px-4">
        <Search className="w-4 h-4 text-foreground/40" />
        <input 
          type="text" 
          placeholder="Search something..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-foreground/20 uppercase font-black tracking-widest"
        />
      </div>
      
      {/* Nút Mở rộng Search Nâng cao */}
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
          Showing {products.length} Results
        </div>
      </div>
    </div>
  </div>




        {/* 3. PRODUCT GRID: Sử dụng Component Số 1 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-1 md:gap-x-4 md:gap-y-4">
          {products.length === 0 ? (
            <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-6 bg-card/20 rounded-[3rem] border border-dashed border-border/50">
              <Sparkles className="w-12 h-12 text-foreground/10" />
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-foreground/20">
                  Empty Collection
                </p>
                <p className="text-[10px] font-medium text-foreground/10 mt-2 italic">
                  Danh mục này hiện chưa có sản phẩm. Vui lòng quay lại sau.
                </p>
              </div>
            </div>
          ) : (
            products.map((p: any) => (
              /* GỌI COMPONENT SỐ 1 TẠI ĐÂY */
              <ProductCardSlug 
                id={p.id}
                key={p.id}
                slug={p.slug}
                name={p.name}
                thumbnail_url={
                  p.thumbnail_url ? getPublicImageUrl(p.thumbnail_url) : undefined
                }
                price_min={p.price_min}
              />
            ))
          )}
        </div>

        {/* 4. Phân trang */}
        <Pagination totalCount={totalCount} limit={limit} />

      </div>

      {/* Trang trí chân trang bằng hiệu ứng gradient loang */}
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent pointer-events-none z-0 opacity-50" />
    </div>
  );
}





