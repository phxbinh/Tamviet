// _relateproducts/RelateProductSectionO.tsx
interface RelatedProductsProps {
  relatedProducts: Product[];
  title?: string; // Thêm dòng này để đổi tên tiêu đề linh hoạt
}

export default function RelatedProductsSection({ 
  relatedProducts, 
  title = "Sản phẩm tương tự" // Mặc định là sản phẩm tương tự
}: RelatedProductsProps) {
  
  // Nếu loại này không có sản phẩm nào thì không render gì cả
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <section className="mt-16 border-t pt-10">
      <div className="flex justify-between items-end mb-8 px-4">
        <div>
          {/* Dùng tiêu đề động từ props */}
          <h2 className="text-2xl font-bold uppercase tracking-tight">{title}</h2>
          <div className="h-1 w-12 bg-black mt-2"></div>
        </div>
        
        {/* ... giữ nguyên phần còn lại của bạn ... */}
      </div>
      
      {/* ... Swiper giữ nguyên ... */}
    </section>
  );
}
