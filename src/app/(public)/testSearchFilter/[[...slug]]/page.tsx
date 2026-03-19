// src/app/(public)/testCategories/[[...slug]]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCardSlug } from "@/components/shop/ProductCardSlug";
import { LayoutGrid, ChevronRight, Sparkles } from "lucide-react";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { getProductsByCategory } from "./_server/getProductsByCategory";
import { getCategoriesTree } from "@/lib/db/categories";
import { CategoryToolbar } from "./_shop/CategoryToolbar";

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { slug } = await params;
  const slugArray = slug ?? [];
  const path = slugArray.join("/");

  // 🔥 QUERY PARAMS
  const {
    search,
    min,
    max,
    sort,
    page = "1",
    color,
    size
  } = searchParams;

  const filters = {
    color: typeof color === "string" ? color.split(",") : [],
    size: typeof size === "string" ? size.split(",") : []
  };

  // 🔥 FETCH
  const [productsRes, categories] = await Promise.all([
    getProductsByCategory({
      path,
      search: typeof search === "string" ? search : undefined,
      minPrice: typeof min === "string" ? Number(min) : undefined,
      maxPrice: typeof max === "string" ? Number(max) : undefined,
      attributes: filters,
      sort: typeof sort === "string" ? sort : undefined,
      page: Number(page),
      limit: 8
    }),
    getCategoriesTree()
  ]);

  if (!productsRes) notFound();

  const { data: products, total } = productsRes;

  const currentCategory = categories.find((c: any) => c.category_path === path);

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* HERO */}
      <div className="relative h-[30vh] flex items-center justify-center border-b">
        <h1 className="text-4xl font-black uppercase">
          {currentCategory?.name || "All Products"}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10">

        {/* CATEGORY NAV */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link href="/testCategories">All</Link>
          {categories.map((cat: any) => (
            <Link key={cat.id} href={`/testCategories/${cat.category_path}`}>
              {cat.name}
            </Link>
          ))}
        </div>

        {/* 🔥 TOOLBAR */}
        <CategoryToolbar />

        {/* RESULT COUNT */}
        <div className="flex items-center gap-2 text-xs mb-4">
          <LayoutGrid className="w-4 h-4" />
          Showing {total} results
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Sparkles />
              Empty
            </div>
          ) : (
            products.map((p: any) => (
              <ProductCardSlug
                key={p.id}
                id={p.id}
                slug={p.slug}
                name={p.name}
                thumbnail_url={
                  p.thumbnail_url
                    ? getPublicImageUrl(p.thumbnail_url)
                    : undefined
                }
                price_min={p.price_min}
              />
            ))
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: Math.ceil(total / 8) }).map((_, i) => (
            <Link
              key={i}
              href={`?page=${i + 1}`}
              className="px-3 py-1 border text-xs"
            >
              {i + 1}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}