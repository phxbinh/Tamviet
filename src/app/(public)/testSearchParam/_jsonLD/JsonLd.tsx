// app/(public)/testSearchParam/_components/JsonLd.tsx
'use client'; // Không bắt buộc, nhưng nếu muốn dùng Script của Next.js thì OK

import Script from 'next/script';

interface JsonLdProps {
  currentCategory?: any;
  products: any[];           // mảng products từ getProductsByCategory
  path: string;
  baseUrl: string;           // ví dụ: 'https://yourdomain.com'
}

export default function CategoryJsonLd({ currentCategory, products, path, baseUrl }: JsonLdProps) {
  const fullUrl = `${baseUrl}${path ? `/${path}` : ''}`;

  // 1. BreadcrumbList
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": baseUrl
      },
      ...(path ? [{
        "@type": "ListItem",
        "position": 2,
        "name": currentCategory?.name || "Danh mục",
        "item": fullUrl
      }] : [])
    ]
  };

  // 2. ItemList (danh sách sản phẩm)
  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": currentCategory?.name || "Danh mục sản phẩm",
    "description": `Danh sách sản phẩm thuộc danh mục ${currentCategory?.name || ''}`,
    "url": fullUrl,
    "numberOfItems": products.length,
    "itemListElement": products.slice(0, 12).map((product: any, index: number) => ({  // giới hạn 12-20 items
      "@type": "ListItem",
      "position": index + 1,
      "url": `${baseUrl}/san-pham/${product.slug}`,   // link chi tiết sản phẩm
      "name": product.name,
      "image": product.thumbnail_url ? product.thumbnail_url : undefined,
      "offers": {
        "@type": "Offer",
        "price": product.price_min,
        "priceCurrency": "VND",          // thay bằng VND nếu shop VN
        "availability": "https://schema.org/InStock"   // hoặc OutOfStock nếu cần
      }
    }))
  };

  return (
    <>
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJson)
        }}
      />
      <Script
        id="itemlist-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJson)
        }}
      />
    </>
  );
}

/* Cách dùng
import CategoryJsonLd from "./_components/JsonLd";   // điều chỉnh đường dẫn

// ... code hiện tại của bạn

return (
  <>
    <SearchUI ... />

    <div className="flex flex-col px-1 gap-4 mt-2">
      // grid sản phẩm
      ...
    </div>

    // === THÊM JSON-LD Ở ĐÂY ===
    <CategoryJsonLd 
      currentCategory={currentCategory}
      products={products}
      path={path}
      baseUrl="https://yourdomain.com"   // ← thay bằng domain thật của bạn
    />
  </>
);
*/