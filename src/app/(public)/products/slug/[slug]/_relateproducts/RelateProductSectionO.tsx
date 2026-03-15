'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import { ProductCardSlug } from "@/components/shop/ProductCard";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

export default function RelatedProductsSection({ relatedProducts }: RelatedProductsProps) {
  return (
    <section className="mt-16 border-t pt-10">
      <div className="flex justify-between items-end mb-8 px-4">
        <div>
          <h2 className="text-2xl font-bold uppercase">Sản phẩm tương tự</h2>
          <div className="h-1 w-12 bg-black mt-2"></div>
        </div>
        
        {/* Custom Navigation Buttons */}
        <div className="hidden md:flex gap-2">
          <button className="swiper-prev-button p-2 rounded-full border border-gray-200 hover:bg-black hover:text-white transition-all disabled:opacity-30">
            <ChevronLeft size={20} />
          </button>
          <button className="swiper-next-button p-2 rounded-full border border-gray-200 hover:bg-black hover:text-white transition-all disabled:opacity-30">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative px-4 group">
        <Swiper
          modules={[Navigation, Pagination, FreeMode]}
          spaceBetween={20}
          slidesPerView={1.3} // Hiện một phần sản phẩm kế bên để tạo dấu hiệu
          freeMode={true}     // Vuốt tự do như app native
          grabCursor={true}
          navigation={{
            nextEl: '.swiper-next-button',
            prevEl: '.swiper-prev-button',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true, // Dấu chấm tự co giãn nhìn rất hiện đại
          }}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 4 },
          }}
          className="related-swiper !pb-12"
        >
          {relatedProducts.map((item) => (
            <SwiperSlide key={item.id}>
              <ProductCardSlug
                id={item.id}
                slug={item.slug}
                name={item.name}
                thumbnail_url={item.thumbnail_url ? getPublicImageUrl(item.thumbnail_url) : undefined}
                price_min={item.price_min}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CSS để tinh chỉnh giao diện Swiper */}
        <style jsx global>{`
          .swiper-pagination-bullet-active {
            background: #000 !important;
          }
          .related-swiper .swiper-slide {
            height: auto; /* Đảm bảo các card bằng chiều cao nhau */
          }
        `}</style>
      </div>
    </section>
  );
}
