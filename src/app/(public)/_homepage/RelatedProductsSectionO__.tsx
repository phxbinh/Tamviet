// _relateproducts/RelateProductSectionO.tsx
'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode, Autoplay } from 'swiper/modules';
import { ProductCardSlug } from "./ProductCardSlug";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

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
  code?: string;
}


export default function RelatedProductsSection({ 
  relatedProducts, 
  title = "Sản phẩm tương tự",
  code
}: RelatedProductsProps) {
  
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
  <section className="mt-1 w-full max-w-full overflow-hidden">
    <div className="flex justify-between items-end mb-2 px-4">
      {/* Cụm tiêu đề bên trái */}

      <div>
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-[hsl(var(--foreground))]">
            {title}
          </h2>
          <Link
            href={`/testSearchParam?page=1&type=${code}`}
            aria-label={`Xem thêm các sản phẩm ${title}`}
            className="text-xs md:text-sm font-medium text-[hsl(var(--primary))] hover:underline transition-all"
          >
            Xem thêm...
          </Link>
        </div>
        <div className="h-1 w-12 bg-[hsl(var(--primary))] mt-1"></div>
      </div>

      {/* Nút điều hướng Swiper bên phải */}
      <div className="hidden md:flex gap-2">
        <button className="swiper-prev-button p-2 rounded-full border border-[hsl(var(--border))] hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))] transition-all disabled:opacity-20 active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <button className="swiper-next-button p-2 rounded-full border border-[hsl(var(--border))] hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))] transition-all disabled:opacity-20 active:scale-95">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>

    <div className="relative pb-1 px-0 md:px-0 w-full overflow-hidden">
{/*
      <Swiper
        modules={[Navigation, Pagination, FreeMode, Autoplay]}
        spaceBetween={10}
        slidesPerView={2.1}
        freeMode={true}
        grabCursor={true}
        loop={relatedProducts.length > 4}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          nextEl: ".swiper-next-button",
          prevEl: ".swiper-prev-button",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        breakpoints={{
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="related-swiper !pb-4"
      > */}

<Swiper
  // 1. Xóa Pagination khỏi modules
  modules={[Navigation, FreeMode, Autoplay]} 
  spaceBetween={10}
  slidesPerView={2.1}
  freeMode={true}
  grabCursor={true}
  loop={relatedProducts.length > 4}
  autoplay={{
    delay: 4000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }}
  navigation={{
    nextEl: ".swiper-next-button",
    prevEl: ".swiper-prev-button",
  }}
  // 2. XÓA HOẶC COMMENT ĐOẠN NÀY
  /* pagination={{
    clickable: true,
    dynamicBullets: true,
  }} 
  */
  breakpoints={{
    768: { slidesPerView: 3, spaceBetween: 20 },
    1024: { slidesPerView: 4, spaceBetween: 24 },
  }}
  // 3. Chỉnh lại padding bottom (vì không còn bullet nên không cần khoảng trống bên dưới)
  className="related-swiper !pb-1" 
>

        {relatedProducts.map((item) => (
          <SwiperSlide key={item.id} className="h-auto">
            <div className="border border-[hsl(var(--border))] rounded-xl p-0 md:p-0 bg-[hsl(var(--card))] hover:border-[hsl(var(--primary))] hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col group overflow-hidden">
              <ProductCardSlug
                id={item.id}
                slug={item.slug}
                name={item.name}
                thumbnail_url={
                  item.thumbnail_url
                    ? getPublicImageUrl(item.thumbnail_url)
                    : undefined
                }
                price_min={item.price_min}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
{/*
      <style jsx global>{`
        .swiper-pagination-lock { display: block; }
        .swiper-pagination-bullets.swiper-pagination-horizontal { bottom: 0 !important; display: flex; align-items: center; justify-content: center; transition: all 0.4s ease-in-out; }
        .swiper-pagination-bullet { background: #e5e7eb !important; opacity: 1 !important; height: 8px !important; width: 8px !important; margin: 0 6px !important; border-radius: 99px !important; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1), left 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important; will-change: width, transform; }
        .swiper-pagination-bullet-active { background: #000000 !important; width: 28px !important; transform: translateZ(0); }
        .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-main { transform: scale(1) translateZ(0); }
        .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev, .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next { transform: scale(0.66) translateZ(0); }
      `}</style> */}
    </div>
  </section>
);

}
