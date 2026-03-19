
// src/app/(public)/products/[slug]/page.tsx

import ProductDetailClient from "@/features/products/components/ProductDetailClient";
import { headers } from "next/headers";
import { getProductDetail_slug } from "@/lib/server/products/getProductDetail_slug";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { sql } from "@/lib/neon/sql";
import Link from "next/link";
import {ProductCardSlug} from "@/components/shop/ProductCard";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
//import RelatedProductsSection from "./_relateproducts/RelateProductSection";
import RelatedProductsSection from "../_relateproducts/RelateProductSectionO";
import { getRelatedProducts } from "../_relateproducts/getSqlRelatedProduct";

// ✳️ Làm breadcrumb
// 1. Định nghĩa interface (nếu chưa có)
interface BreadcrumbItem {
  label: string;
  href?: string; // Dấu ? nghĩa là không bắt buộc phải có href
}

async function getCategoryPath(categoryId: string) {
  const rows = await sql`
    WITH RECURSIVE category_path AS (
      -- Điểm bắt đầu: danh mục hiện tại của sản phẩm
      SELECT id, name, slug, parent_id, 1 as level
      FROM categories
      WHERE id = ${categoryId}
      
      UNION ALL
      
      -- Bước đệ quy: tìm cha của danh mục ở trên
      SELECT c.id, c.name, c.slug, c.parent_id, cp.level + 1
      FROM categories c
      JOIN category_path cp ON c.id = cp.parent_id
    )
    -- Sắp xếp theo level giảm dần để có thứ tự: Cha -> Con
    SELECT name, slug FROM category_path ORDER BY level DESC;
  `;
  return rows;
}

// ✳️ Lấy các sản phẩm liên quan
/*
async function getRelatedProducts(categoryId: string, currentProductId: string, limit = 4) {
  try {
    const rows = await sql`
      select
        p.id,
        p.name,
        p.slug,
        p.thumbnail_url, -- Cột thumbnail mặc định của bạn (nếu có)
        
        min(v.price) as price_min,
        sum(v.stock) as total_stock,
        
        img.image_url as thumbnail -- Ảnh đánh dấu là thumbnail trong bảng images

      from products p
      
      -- Join với bảng trung gian để lọc theo category
      inner join product_categories pc 
        on pc.product_id = p.id

      -- Join lấy giá và kho từ variants
      left join product_variants v
        on v.product_id = p.id
        and v.is_active = true

      -- Join lấy ảnh thumbnail
      left join product_images img
        on img.product_id = p.id
        and img.is_thumbnail = true

      where pc.category_id = ${categoryId} -- Lọc cùng danh mục
      and p.id != ${currentProductId}     -- Loại trừ sản phẩm đang xem
      and p.status = 'active'             -- Chỉ lấy sản phẩm đang bán

      group by
        p.id,
        p.name,
        p.slug,
        p.thumbnail_url,
        img.image_url

      order by p.created_at desc
      limit ${limit}
    `;
    
    return rows;
  } catch (err) {
    console.error("Related products error:", err);
    return [];
  }
}
*/



export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await getProductDetail_slug(slug);

if (!data) {
    notFound();
  }

  // ✳️ Làm Breadcrumb
  // --- BƯỚC 1: KHAI BÁO BIẾN breadcrumbs ---
  const categoryPath = await getCategoryPath(data.product.category_id);
  
  let currentPath = "";
  const breadcrumbs: BreadcrumbItem[] = categoryPath.map((cat) => {
    currentPath = currentPath ? `${currentPath}/${cat.slug}` : cat.slug;
    return {
      label: cat.name,
      href: `/testCategories/${currentPath}`
    };
  });

  // Thêm sản phẩm vào cuối mảng
  breadcrumbs.push({ label: data.product.name });

  // --- BƯỚC 2: SỬ DỤNG BIẾN breadcrumbs (Dòng 18 của bạn nằm ở đây) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": "https://tamviet.vercel.app"
      },
      ...breadcrumbs.filter(item => item.href).map((item, index) => ({ // Dùng biến đã khai báo ở trên
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": `https://tamviet.vercel.app${item.href}`,
      })),
    ],
  };

  // ✳️ Lấy sản phẩm liên quan
  // Lấy sản phẩm liên quan
  const relatedProducts = await getRelatedProducts(
    data.product.category_id, 
    data.product.id
  );

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <Breadcrumb items={breadcrumbs} />
    <h1>{data.product.name}</h1>
    <ProductDetailClient data={data} />

      {/* Phần sản phẩm liên quan */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4">
          <RelatedProductsSection relatedProducts={relatedProducts as any[]} />
        </div>
      )} 
  </>
);

}





