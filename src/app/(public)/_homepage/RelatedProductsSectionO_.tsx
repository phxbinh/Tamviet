// _relateproducts/RelateProductSectionO.tsx
'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode, Autoplay } from 'swiper/modules';
import { ProductCardSlug } from "./ProductCardSlug";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

interface Product {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  price_min: number;
}

interface RelatedProductsProps {
  relatedProducts: Product[];
  title?: string;
}

export default function RelatedProductsSection({ 
  relatedProducts, 
  title = "Sản phẩm tương tự"
}: RelatedProductsProps) {
  
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    // THAY ĐỔI 1: Bỏ border-t pt-10, giữ nguyên mt-16
    <section className="mt-16">
      <div className="flex justify-between items-end mb-8 px-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">{title}</h2>
          <div className="h-1 w-12 bg-black mt-2"></div>
        </div>
        
        <div className="hidden md:flex gap-2">
          <button className="swiper-prev-button p-2 rounded-full border border-gray-200 hover:bg-black hover:text-white transition-all disabled:opacity-20">
            <ChevronLeft size={20} />
          </button>
          <button className="swiper-next-button p-2 rounded-full border border-gray-200 hover:bg-black hover:text-white transition-all disabled:opacity-20">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative px-4 overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, FreeMode, Autoplay]}
          spaceBetween={20}
          slidesPerView={1.3}
          freeMode={false}
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
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 4 },
          }}
          className="related-swiper !pb-14"
        >
          {relatedProducts.map((item) => (
            <SwiperSlide key={item.id} className="h-auto"> 
              {/* THAY ĐỔI 2: Thêm class bọc ngoài để tạo viền */}
              <div className="border border-gray-200 rounded-xl p-4 bg-white hover:border-black hover:shadow-lg transition-all duration-300 h-full flex flex-col">
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
  .swiper-pagination-lock {
    display: block;
  }

  .swiper-pagination-bullets.swiper-pagination-horizontal {
    bottom: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s ease-in-out;
  }

  .swiper-pagination-bullet {
    background: #e5e7eb !important;
    opacity: 1 !important;
    height: 8px !important;
    width: 8px !important;
    margin: 0 6px !important;
    border-radius: 99px !important;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                left 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                background-color 0.5s ease,
                transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
    will-change: width, transform;
  }

  .swiper-pagination-bullet-active {
    background: #000000 !important;
    width: 28px !important;
    transform: translateZ(0);
  }

  .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-main {
    transform: scale(1) translateZ(0);
  }
  
  .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev,
  .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next {
    transform: scale(0.66) translateZ(0);
  }
`}</style>

      </div>
    </section>
  );
}
