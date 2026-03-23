// src/app/(public)/testSearchParam/products/[slug]/page.tsx




///==========✳️✳️🔸🔸🔸
// src/app/(public)/testSearchParam/products/[slug]/page.tsx
// src/app/(public)/testSearchParam/products/[slug]/page.tsx

import type { Metadata } from "next";
import ProductDetailClient from "@/features/products/components/ProductDetailClient";
import { headers } from "next/headers";
import { getProductDetail_slug } from "@/lib/server/products/getProductDetail_slug";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { sql } from "@/lib/neon/sql";
import RelatedProductsSection from "../_relateproducts/RelateProductSectionO";
import { getRelatedProducts, getCategoryPath } from "../_relateproducts/getSqlRelateProduct";

// ================= ✅ METADATA =================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const data = await getProductDetail_slug(slug);

  if (!data) {
    return {
      title: "Sản phẩm không tồn tại",
    };
  }

  // 🔥 fix type tại chỗ, không đụng hệ thống
  const product = data.product as typeof data.product & { slug: string };

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

// ================= PAGE =================

// ✳️ Breadcrumb type
interface BreadcrumbItem {
  label: string;
  href?: string;
}

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

  // ================= BREADCRUMB =================
  const categoryPath = await getCategoryPath(data.product.category_id);
  
  let currentPath = "";
  const breadcrumbs: BreadcrumbItem[] = categoryPath.map((cat) => {
    currentPath = currentPath ? `${currentPath}/${cat.slug}` : cat.slug;
    
    return {
      label: cat.name,
      href: `/testSearchParam?cat=${currentPath}`,
    };
  });

  breadcrumbs.push({ label: data.product.name });

  // ================= JSON-LD =================
  const jsonLd = {
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

  // ================= RELATED =================
  const relatedProducts = await getRelatedProducts(
    data.product.category_id,
    data.product.id
  );

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb items={breadcrumbs} />

      <h1>{data.product.name}</h1>

      <ProductDetailClient data={data} />

      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4">
          <RelatedProductsSection relatedProducts={relatedProducts as any[]} />
        </div>
      )}
    </>
  );
}