// src/app/(public)/page.tsx

// Thêm 2 dòng này lên trên cùng file
export const revalidate = 300; 

import { getHomeSections, getHomeSections_array } from "./_homepage/getHomeSections"; // Đường dẫn file chứa hàm SQL mới
import RelatedProductsSection from "./_homepage/RelatedProductsSectionO__";
import StoreMap from './_map/StoreMap';
import MapPreview from './_map/MapPreview';



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
      <MapPreview 
        shopName="Tâm Việt"
        lat={10.845694} 
        lng={106.656222} 
        address="319/22 Đ. Lê Văn Thọ, Phường 9, Thông Tây Hội, Hồ Chí Minh"
      />
  </div>
</>
);

}





