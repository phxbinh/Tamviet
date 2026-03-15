'use client'
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ProductCardSlug } from "@/components/shop/ProductCard";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';


// 1. Định nghĩa Interface cho sản phẩm (Bạn có thể điều chỉnh tùy theo Data thực tế)
interface Product {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  price_min: number;
}

// 2. Định nghĩa Type cho Props
interface RelatedProductsProps {
  relatedProducts: Product[];
}

export default function RelatedProductsSection({ relatedProducts }: RelatedProductsProps) {
  const [width, setWidth] = useState(0);
    // 3. Định nghĩa kiểu cho useRef là HTMLDivElement
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const timer = setTimeout(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, 100); // Đợi một chút để DOM render xong hoàn toàn
  return () => clearTimeout(timer);
}, [relatedProducts]);


  return (
    <section className="mt-16 border-t pt-10 overflow-hidden">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold">Sản phẩm tương tự</h2>
          <p className="text-sm text-gray-500">Vuốt sang trái để xem thêm</p>
        </div>
        {/* Dấu hiệu nhận biết: Navigation Dots (Optional) */}
        <div className="hidden md:flex gap-2 mb-2">
            <div className="w-8 h-1 bg-black rounded-full" />
            <div className="w-2 h-1 bg-gray-300 rounded-full" />
            <div className="w-2 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Container chính với Gradient Mask để tạo chiều sâu */}
      <motion.div 
        ref={carousel} 
        className="cursor-grab active:cursor-grabbing relative touch-none"
        whileTap={{ cursor: "grabbing" }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width-20 }}
          className="flex gap-6"
        >
          {relatedProducts.map((item) => (
            <motion.div 
              key={item.id} 
              className="min-w-[250px] md:min-w-[300px] select-none"
            >
              <ProductCardSlug
                id={item.id}
                slug={item.slug}
                name={item.name}
                thumbnail_url={
                  item.thumbnail_url ? getPublicImageUrl(item.thumbnail_url) : undefined
                }
                price_min={item.price_min}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Lớp phủ mờ ở cạnh phải để báo hiệu còn sản phẩm */}
        <div className="absolute top-0 right-0 h-full w-3 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </motion.div>
    </section>
  );
}

















