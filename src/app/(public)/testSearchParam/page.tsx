// src/app/(public)/testSearchParam/page.tsx
import Link from "next/link";
import { ProductCardSlug } from "@/components/shop/ProductCardSlugParam";
import { LayoutGrid, Filter, ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { getProductsByCategory, getProductTypes } from "./_server/getProductByCategory";
import { getCategoriesTree } from "@/lib/db/categories";

import { Filters } from "./_shop/Filters";
import { Pagination } from "./_shop/Pagination";
//import { ExpandableSearch } from "./_shop/ExpandableSearch";
//import { StickyFilterWrapper } from "./_scrollsticky/StickyFilterWrapper";
//import { ExpandableSearch } from "./_shop/ExpandableSearch_link_";
//import { ExpandableSearch } from "./_shop/ExpandableSearch_link__";
//import { ExpandableSearch } from "./_shop/ExpandableSearch_link__fade";

import { SearchUI } from "./_tachComponents/SearchUI";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Trước tiên, định nghĩa interface ngay trong page.tsx hoặc import từ Filters
interface ProductType {
  code: string;
  name: string;
}

export default async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sParams = await searchParams;
  
  const path = (sParams.cat as string) || ""; 

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
<>
        {/* 🔥 STICKY FILTER */} {/*
        <StickyFilterWrapper>
          <ExpandableSearch 
            productTypes={productTypes}
            categoryTree={categoryTree} 
            path={path}
            productsLength={products.length}
          />
        </StickyFilterWrapper> */}

<SearchUI
  productTypes={productTypes}
  categoryTree={categoryTree}
  path={path}
/>
      <div className="flex flex-col px-1 gap-4 mt-2">

{/*
         <ExpandableSearch 
            productTypes={productTypes}
            categoryTree={categoryTree} 
            path={path}
            productsLength={products.length}
          />
*/}

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
      </div> </>
  );
}

