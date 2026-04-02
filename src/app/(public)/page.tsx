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
/*
import RelatedProductsSection from "./_homepage/RelatedProductsSection";
import { getProductsByType } from "./_homepage/getProductsByType";
import { getProductTypes } from "./_homepage/getProductTypes";

export default async function HomePage() {

  const productTypes = await getProductTypes();
const sections = [
  {
    products: await getProductsByType("pumps", 8)
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
*/
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











// app/page.tsx (Server Component)

// Thêm 2 dòng này lên trên cùng file
export const revalidate = 300; 

import { getHomeSections, getHomeSections_array } from "./_homepage/getHomeSections"; // Đường dẫn file chứa hàm SQL mới
import RelatedProductsSection from "./_homepage/RelatedProductsSectionO__";
//import StoreMap from '@/components/map/StoreMap__';
import StoreMap from '@/components/map/StoreMapO';



export default async function HomePage() {
  // Lấy toàn bộ data (gồm tên loại và danh sách sản phẩm của loại đó)
  const sections = await getHomeSections(8);

  // Lấy theo thứ tự mãng truyền vào
  //const sections = await getHomeSections_array( ['coffee', 'clothes', 'pumps', 'beverage'], 8);

return (
<>
  <div className="space-y-6">
    {sections.map((section) => (
      // CẬP NHẬT DÒNG NÀY
      <div 
        key={section.type_code} 
        className="mb-2 mt-2 border border-[hsl(var(--border))] rounded-lg p-1 bg-[hsl(var(--card))]"
      >
        <RelatedProductsSection 
          title={section.type_name} 
          relatedProducts={section.products} 
          code={section.type_code}
        />
      </div>
    ))}
  </div>
  <div className="max-w-3xl mx-auto p-1">
      <StoreMap 
        shopName="Tâm Việt"
        lat={10.845694} 
        lng={106.656222} 
        address="319/22 Đ. Lê Văn Thọ, Phường 9, Thông Tây Hội, Hồ Chí Minh"
      />
  </div>
</>
);

}

/*
    <div className="max-w-3xl mx-auto p-10">
      <StoreMap 
        shopName="Tâm Việt Studio"
        address="123 Đường ABC, Quận 1, TP. Hồ Chí Minh"
        lat={10.845694} 
        lng={106.656222} 
      />
    </div>


10.845694, 106.656222


*/




