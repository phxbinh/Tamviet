// app/(public)/testSearchParam/_components/JsonLd.tsx
'use client'; // Không bắt buộc, nhưng nếu muốn dùng Script của Next.js thì OK

import Script from 'next/script';

interface CategoryJsonLdProps {
  currentCategory?: any;           // object category từ DB (có name, category_path...)
  products: any[];                 // mảng products trả về từ getProductsByCategory
  path: string;                    // giá trị cat từ searchParams
  baseUrl: string;                 // ví dụ: 'https://tamviet.vercel.app'
}

export default function CategoryJsonLd({
  currentCategory,
  products,
  path,
  baseUrl,
}: CategoryJsonLdProps) {
  const categoryName = currentCategory?.name || "Danh mục sản phẩm";
  const categoryUrl = `${baseUrl}${path ? `/testSearchParam?cat=${encodeURIComponent(path)}` : '/testSearchParam'}`;

  // 1. BreadcrumbList (rất quan trọng cho SEO)
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": baseUrl,
      },
      ...(path
        ? [
            {
              "@type": "ListItem",
              "position": 2,
              "name": categoryName,
              "item": categoryUrl,
            },
          ]
        : []),
    ],
  };

  // 2. CollectionPage + ItemList (khuyến nghị chính cho category page)
  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} - Tam Việt`,
    "description": `Danh sách sản phẩm thuộc danh mục ${categoryName} tại Tam Việt. Chất lượng cao, giá tốt, đa dạng lựa chọn.`,
    "url": categoryUrl,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 15).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${baseUrl}/san-pham/${product.slug}`,   // ← thay đổi nếu đường dẫn chi tiết sản phẩm khác
        "name": product.name,
        "image": product.thumbnail_url ? product.thumbnail_url : undefined,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "VND",
          "price": Number(product.price_min) || 0,
          "availability": "https://schema.org/InStock",   // hoặc logic kiểm tra stock nếu có
        },
      })),
    },
  };

  return (
    <>
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c'),
        }}
      />
      <Script
        id="collectionpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPage).replace(/</g, '\\u003c'),
        }}
      />
    </>
  );
}


/* Cấch sử dụng
// ... code hiện tại

import CategoryJsonLd from "./_components/CategoryJsonLd";   // điều chỉnh path nếu cần

return (
  <>
    <SearchUI ... />

    <div className="flex flex-col px-1 gap-4 mt-2">
      // grid sản phẩm và Pagination
      ...
    </div>

    // JSON-LD
    <CategoryJsonLd 
      currentCategory={currentCategory}
      products={products}
      path={path}
      baseUrl="https://tamviet.vercel.app"   // ← đổi thành process.env.NEXT_PUBLIC_BASE_URL nếu muốn động
    />
  </>
);

*/