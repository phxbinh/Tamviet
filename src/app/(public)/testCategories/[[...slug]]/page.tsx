// src/app/(public)/testCategories/[[...slug]]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductCardSlug } from "@/components/shop/ProductCardSlug";
import { LayoutGrid, Filter, ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { getProductsByCategory } from "@/lib/db/products";
import { getCategoriesTree } from "@/lib/db/categories";


async function getProducts(path?: string) {
  return await getProductsByCategory(path);
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const slugArray = slug ?? [];
  const path = slugArray.join("/");

  const [products, categories] = await Promise.all([
    getProductsByCategory(path),
    getCategoriesTree()
  ]);
  
  if (products === null) notFound();

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
    <div className="min-h-screen bg-background pb-20">
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

      <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-10 relative z-20">
        
        {/* 2. CATEGORY TOOLBAR: Thiết kế dạng Capsule scannable */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-card/40 backdrop-blur-3xl p-2 rounded-[2rem] border border-border/40 shadow-2xl shadow-black/5 overflow-x-auto no-scrollbar">
            
            <Link
              href="/testCategories" prefetch={true}
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
                href={`/testCategories/${cat.category_path}`} prefetch={true}
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
        </div>

        {/* 3. PRODUCT GRID: Sử dụng Component Số 1 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 md:gap-x-8 md:gap-y-8">
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
                /*thumbnail_url={p.thumbnail_url} */
                thumbnail_url={
                  p.thumbnail_url ? getPublicImageUrl(p.thumbnail_url) : undefined
                }
                price_min={p.price_min}
              />
            ))
          )}
        </div>
      </div>

      {/* Trang trí chân trang bằng hiệu ứng gradient loang */}
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent pointer-events-none z-0 opacity-50" />
    </div>
  );
}








