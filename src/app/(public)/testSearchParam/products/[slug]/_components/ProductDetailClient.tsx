"use client";
import { useState, useMemo } from "react";
import { ProductFull } from "../types";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { useCart } from "@/components/cart/CartProvider";
import { addToCartAction } from "@/lib/cart/cartActions";

export default function ProductDetailClient({ data }: { data: ProductFull }) {
  const { product, attributes, variants, images } = data;
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const { addItemOptimistic, fetchCart } = useCart();

  // Cập nhật ui cho cart (quantity)
  //const { addItemOptimistic, fetchCart } = useCart(); 


  const selectedVariant = useMemo(() => {
    if (Object.keys(selected).length < attributes.length) return null;
    
    // Thêm "|| null" ở cuối để biến undefined thành null
    return variants.find((v) =>
      Object.entries(selected).every(([key, value]) => v.attributes[key] === value)
    ) || null; 
  }, [selected, variants, attributes.length]);
  
  async function handleAddToCart() {
    if (!selectedVariant) return;
/*
    try {
      setIsAdding(true);
  
      await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          variantId: selectedVariant.id,
          quantity: 1,
        }),
      });
  
      await fetchCart();
  
    } catch (err) {
      console.error("Add to cart failed", err);
    } finally {
      setTimeout(() => setIsAdding(false), 800);
    }
*/
    // 1. Cập nhật UI ngay lập tức (Mất ~0ms)
    const optimisticItem = {
      variant_id: selectedVariant.id,
      name: product.name,
      price: selectedVariant.price,
      quantity: 1
      //image_item: selectedVariant.variant_image || data.images[0]?.image_url
    };
    
    addItemOptimistic(optimisticItem);
    setIsAdding(true); // Hiệu ứng loading trên nút vẫn giữ để tạo cảm giác chắc chắn

    // 2. Gọi Server Action chạy ngầm
    const result = await addToCartAction(selectedVariant.id, 1);

    if (!result.success) {
      // 3. Nếu lỗi thì fetch lại bản chuẩn từ DB để sửa sai cho UI
      await fetchCart();
      alert("Không thể thêm vào giỏ hàng, vui lòng thử lại!");
    }

    setTimeout(() => setIsAdding(false), 500);
  }
  
  
  
  
  return (
    <div className="max-w-7xl mx-auto px-2 py-4 md:px-3 lg:py-10 transition-colors duration-300">
      {/* Responsive Grid: 
          - grid-cols-1: Mobile mặc định 1 cột
          - lg:grid-cols-12: Desktop chia 12 phần
          - gap-8: Khoảng cách giữa Gallery và Info
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
        
        {/* CỘT TRÁI: GALLERY (Chiếm 7/12 cột trên Desktop) */}
        <div className="lg:col-span-7 w-full">
          <ProductGallery 
            images={images} 
            productName={product.name} 
            activeImgIndex={activeImgIndex}
            setActiveImgIndex={setActiveImgIndex}
            variantImage={selectedVariant?.variant_image}
          />
        </div>
  
        {/* CỘT PHẢI: PRODUCT INFO (Chiếm 5/12 cột trên Desktop)
            - lg:sticky: Ghim lại khi cuộn trang trên máy tính
            - lg:top-24: Khoảng cách từ đỉnh màn hình khi ghim
        */}
        <div className="lg:col-span-5 w-full lg:sticky lg:top-24">
          <ProductInfo 
            product={product}
            attributes={attributes}
            selected={selected}
            setSelected={setSelected}
            selectedVariant={selectedVariant}
            variants={variants}
            isAdding={isAdding}
            /*onAdd={() => { 
              //setIsAdding(true); 
              //setTimeout(() => setIsAdding(false), 1500);
              handleAddToCart();
            }}*/
            onAdd={handleAddToCart}
          />
        </div>
  
      </div>
    </div>
  );
}
