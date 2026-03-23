// src/app/(public)/testSearchParam/products/[slug]/page.tsx




///==========✳️✳️🔸🔸🔸
// src/app/(public)/testSearchParam/products/[slug]/page.tsx
// src/app/(public)/testSearchParam/products/[slug]/page.tsx

import type { Metadata } from "next";
import ProductDetailClient from "@/features/products/components/ProductDetailClient";
import { getProductDetail_slug } from "@/lib/server/products/getProductDetail_slug";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { sql } from "@/lib/neon/sql";
import RelatedProductsSection from "../_relateproducts/RelateProductSectionO";
import { getRelatedProducts } from "../_relateproducts/getSqlRelateProduct";

// ================= TYPE FIX CHUẨN =================
type ProductSafe = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail_url?: string;
  price_min?: number;
  category_id: string;
};

type ProductDetailSafe = {
  product: ProductSafe;
};

// ================= SEO METADATA =================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const data = (await getProductDetail_slug(slug)) as ProductDetailSafe | null;

  if (!data) {
    return {
      title: "Sản phẩm không tồn tại",
    };
  }

  const product = data.product;

  const url = `https://tamviet.vercel.app/testSearchParam/products/${product.slug}`;

  return {
    title: `${product.name} | TamViet`,
    description:
      product.description?.slice(0, 160) ||
      `Mua ${product.name} chính hãng, giá tốt tại TamViet`,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: product.name,
      description: product.description || "",
      url,
      siteName: "TamViet",
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: product.thumbnail_url || "/fallback.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || "",
      images: [product.thumbnail_url || "/fallback.jpg"],
    },
  };
}

// ================= BREADCRUMB =================
interface BreadcrumbItem {
  label: string;
  href?: string;
}

async function getCategoryPath(categoryId: string) {
  const rows = await sql`
    WITH RECURSIVE category_path AS (
      SELECT id, name, slug, parent_id, 1 as level
      FROM categories
      
      WHERE id = ${categoryId}
      
      UNION ALL
      
      SELECT c.id, c.name, c.slug, c.parent_id, cp.level + 1
      FROM categories c
      JOIN category_path cp ON c.id = cp.parent_id
    )
    SELECT name, slug FROM category_path ORDER BY level DESC;
  `;
  return rows;
}

// ================= PAGE =================
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = (await getProductDetail_slug(slug)) as ProductDetailSafe | null;

  if (!data) {
    notFound();
  }

  const product = data.product;

  // ================= BREADCRUMB =================
  const categoryPath = await getCategoryPath(product.category_id);

  let currentPath = "";
  const breadcrumbs: BreadcrumbItem[] = categoryPath.map((cat: any) => {
    currentPath = currentPath
      ? `${currentPath}/${cat.slug}`
      : cat.slug;

    return {
      label: cat.name,
      href: `/testSearchParam?cat=${currentPath}`,
    };
  });

  breadcrumbs.push({ label: product.name });

  // ================= JSON-LD =================
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: "https://tamviet.vercel.app",
      },
      ...breadcrumbs
        .filter((item) => item.href)
        .map((item, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: item.label,
          item: `https://tamviet.vercel.app${item.href}`,
        })),
    ],
  };

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.thumbnail_url],
    description: product.description || "",
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "TamViet",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: product.price_min || 0,
      availability: "https://schema.org/InStock",
      url: `https://tamviet.vercel.app/testSearchParam/products/${product.slug}`,
    },
  };

  // ================= RELATED =================
  const relatedProducts = await getRelatedProducts(
    product.category_id,
    product.id
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />

      <Breadcrumb items={breadcrumbs} />

      <h1 className="text-xl font-bold">{product.name}</h1>

      <ProductDetailClient data={data} />

      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4">
          <RelatedProductsSection
            relatedProducts={relatedProducts as any[]}
          />
        </div>
      )}
    </>
  );
}