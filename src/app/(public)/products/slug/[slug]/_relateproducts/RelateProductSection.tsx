'use client'
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ProductCardSlug } from "@/components/shop/ProductCard";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';

interface Product {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  price_min: number;
}

interface RelatedProductsProps {
  relatedProducts: Product[];
}

export default function RelatedProductsSection({ relatedProducts }: RelatedProductsProps) {
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (carousel.current) {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [relatedProducts]);

  return (
    <section className="mt-16 border-t pt-10 overflow-hidden">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold">Sản phẩm tương tự</h2>
          <p className="text-sm text-gray-500">Vuốt sang trái để xem thêm</p>
        </div>
        <div className="hidden md:flex gap-2 mb-2">
            <div className="w-8 h-1 bg-black rounded-full" />
            <div className="w-2 h-1 bg-gray-300 rounded-full" />
            <div className="w-2 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>

      <motion.div 
        ref={carousel} 
        // 1. Thêm touch-none ở container ngoài cùng để tránh trình duyệt can thiệp bậy
        className="cursor-grab active:cursor-grabbing relative touch-none"
        whileTap={{ cursor: "grabbing" }}
      >
        <motion.div
          drag="x"
          // 2. dragDirectionLock giúp cố định hướng gạt khi đã bắt đầu di chuyển
          dragDirectionLock 
          dragConstraints={{ right: 0, left: -width }}
          // 3. touch-pan-y: Đây là "vị cứu tinh". 
          // Cho phép cuộn trang dọc khi chạm vào đây, nhưng chặn cuộn trang khi gạt ngang.
          className="flex gap-6 touch-pan-y" 
        >
          {relatedProducts.map((item) => (
            <motion.div 
              key={item.id} 
              // 4. select-none ngăn việc bôi đen text khi đang kéo
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

        {/* Lớp phủ mờ ở cạnh phải */}
        <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </motion.div>
    </section>
  );
}
