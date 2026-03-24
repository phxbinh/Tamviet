// _relateproducts/RelateProductSectionO.tsx
'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode, Autoplay } from 'swiper/modules';
import { ProductCardSlug } from "./ProductCardSlug";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { ChevronLeft, ChevronRight } from "lucide-react";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

// ... (Interface giữ nguyên)

export default function RelatedProductsSection({ 
  relatedProducts, 
  title = "Sản phẩm tương tự"
}: RelatedProductsProps) {
  
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex justify-between items-end mb-8 px-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-[hsl(var(--foreground))]">
            {title}
          </h2>
          <div className="h-1 w-12 bg-[hsl(var(--primary))] mt-2"></div>
        </div>
        
        <div className="hidden md:flex gap-2">
          <button className="swiper-prev-button p-2 rounded-full border border-[hsl(var(--border))] hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))] transition-all disabled:opacity-20 active:scale-95">
            <ChevronLeft size={20} />
          </button>
          <button className="swiper-next-button p-2 rounded-full border border-[hsl(var(--border))] hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))] transition-all disabled:opacity-20 active:scale-95">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative px-2 md:px-4 overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, FreeMode, Autoplay]}
          spaceBetween={10} // Giảm khoảng cách giữa các card trên mobile (từ 20 xuống 10)
          slidesPerView={2.1} // HIỂN THỊ 2 CARD TRÊN MOBILE
          freeMode={true} // Cho phép vuốt tự do mượt hơn
          grabCursor={true}
          loop={relatedProducts.length > 4}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            nextEl: '.swiper-next-button',
            prevEl: '.swiper-prev-button',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            // Khi màn hình >= 768px (Tablet)
            768: { 
              slidesPerView: 3,
              spaceBetween: 20 
            },
            // Khi màn hình >= 1024px (Desktop)
            1024: { 
              slidesPerView: 4,
              spaceBetween: 24
            },
          }}
          className="related-swiper !pb-14"
        >
          {relatedProducts.map((item) => (
            <SwiperSlide key={item.id} className="h-auto"> 
              {/* Tùy chỉnh p-2 cho mobile và p-4 cho desktop, thêm overflow-hidden */}
              <div className="border border-[hsl(var(--border))] rounded-xl p-2 md:p-4 bg-[hsl(var(--card))] hover:border-[hsl(var(--primary))] hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col group overflow-hidden">
                <ProductCardSlug
                  id={item.id}
                  slug={item.slug}
                  name={item.name}
                  thumbnail_url={item.thumbnail_url ? getPublicImageUrl(item.thumbnail_url) : undefined}
                  price_min={item.price_min}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .swiper-pagination-bullet {
            background: hsl(var(--border)) !important;
            height: 4px !important; /* Thu nhỏ bullet một chút cho cân đối mobile */
            width: 4px !important;
          }
          .swiper-pagination-bullet-active {
            background: hsl(var(--primary)) !important;
            width: 16px !important;
          }
          /* Đảm bảo Swiper không bị cắt shadow khi hover */
          .related-swiper {
            padding-top: 10px !important;
            margin-top: -10px !important;
          }
        `}</style>
      </div>
    </section>
  );
}
