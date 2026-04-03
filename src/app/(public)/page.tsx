// src/app/(public)/page.tsx

// Thêm 2 dòng này lên trên cùng file
export const revalidate = 300; 

import { getHomeSections, getHomeSections_array } from "./_homepage/getHomeSections"; // Đường dẫn file chứa hàm SQL mới
import RelatedProductsSection from "./_homepage/RelatedProductsSectionO__";
import StoreMap from './_map/StoreMap';

import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';

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
  <div className="max-w-3xl mx-auto p-1">
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







interface Props {
  lat: number;
  lng: number;
  shopName: string;
  address: string;
}

function MapPreview({
  lat,
  lng,
  shopName,
  address,
}: Props) {
  const router = useRouter();
  return (
    <div
      onClick={() =>
        router.push(
          `/maps?lat=${lat}&lng=${lng}&name=${encodeURIComponent(
            shopName
          )}&address=${encodeURIComponent(address)}`
        )
      }
      className="relative cursor-pointer rounded-2xl overflow-hidden border border-white/10 group"
    >

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-2 text-white font-semibold truncate">
          <MapPin size={16} className="text-emerald-400" />
          <span className="truncate">{shopName}</span>
        </div>
        <p className="text-xs text-gray-300 truncate italic">
          {address}
        </p>
      </div>

      {/* CTA */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <div className="px-4 py-2 bg-emerald-500 text-black rounded-full font-bold shadow-lg">
          Xem bản đồ
        </div>
      </div>
    </div>
  );
}








