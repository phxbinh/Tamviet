// src/components/shop/ProductListClient.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CategoryToolbar } from "./CategoryToolbar";
import { ProductCardSlug } from "@/components/shop/ProductCardSlug";

export function ProductListClient({
  initialProducts,
  categories,
  initialPath,
}: any) {
  const router = useRouter();

  const [products, setProducts] = useState(initialProducts);
  const [currentPath, setCurrentPath] = useState(initialPath);

  // cache theo category
  const cache = useRef(new Map<string, any[]>());

  const handleCategoryClick = async (path: string) => {
    const url = path ? `/testCategories/${path}` : "/testCategories";

    setCurrentPath(path);

    // ⚡ nếu có cache → dùng ngay
    if (cache.current.has(path)) {
      setProducts(cache.current.get(path));
      router.push(url);
      return;
    }

    // 🐢 chưa có → fetch
    try {
      const res = await fetch(`/api/products?category=${path}`);
      const data = await res.json();

      cache.current.set(path, data);
      setProducts(data);

      router.push(url);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  return (
    <>
      <CategoryToolbar
        categories={categories}
        currentPath={currentPath}
        onCategoryClick={handleCategoryClick}
      />

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 md:gap-x-8 md:gap-y-8">
        {products.map((p: any) => (
          <ProductCardSlug
            key={p.id}
            id={p.id}
            slug={p.slug}
            name={p.name}
            thumbnail_url={p.thumbnail_url}
            price_min={p.price_min}
          />
        ))}
      </div>
    </>
  );
}