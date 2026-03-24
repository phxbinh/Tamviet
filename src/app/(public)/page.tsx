// src/app/(public)/page.tsx
/*
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import Link  from "next/link";
export default function PublicPage() {
  return (
    <div className="relative flex flex-col gap-10 min-h-screen">
      <Hero />
      <Features />
    </div>
  );
}
*/


// app/page.tsx

import RelatedProductsSection from "./_homepage/RelatedProductsSection";
import { getProductsByType } from "./_homepage/getProductsByType";
import { getProductTypes } from "./_homepage/getProductTypes";

export default async function HomePage() {

  const productTypes = await getProductTypes();

  // 🔥 fetch song song
/* Không chạy được
  const sections = await Promise.all(
    productTypes.map(async (type: any) => {
      const products = await getProductsByType(type.code, 8);
      return {
        type,
        products
      };
    })
  );*/


const sections = [
  {
    products: await getProductsByType("clothes", 8)
  }
];

  return (
    <div className="space-y-16">
      {sections.map(({ products }) => (
        <RelatedProductsSection
          relatedProducts={products}
        />
      ))}
    </div>
  );
}


// app/page.tsx (Server Component)
/*
import { getHomeSections } from "./_homepage/getHomeSections"; // Đường dẫn file chứa hàm SQL mới
import RelatedProductsSection from "./_homepage/RelatedProductsSectionO";
*/
//export default
async function HomePage_() {
  // Lấy toàn bộ data (gồm tên loại và danh sách sản phẩm của loại đó)
  const sections = await getHomeSections(8);

  return (
     <div className="space-y-16">
      {/* Duyệt qua từng "Section" dữ liệu */}
      {sections.map((section) => (
        <div key={section.type_code} className="mb-20">
          {/* Tái sử dụng Component Swiper của bạn */}
          {/* Ở đây mình đổi title động theo tên loại sản phẩm */}
          <RelatedProductsSection 
            title={section.type_name} 
            relatedProducts={section.products} 
          />
        </div>
      ))}
    </div>
  );
}




