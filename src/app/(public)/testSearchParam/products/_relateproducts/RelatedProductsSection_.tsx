// _relateproducts/RelatedProductsSection_.tsx
'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode, Autoplay } from 'swiper/modules';
import { ProductCardSlug } from "../../_tachComponents/ProductCardSlug";
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
}

export default function RelatedProductsSection({ 
  relatedProducts, 
  title = "Sản phẩm tương tự"
}: RelatedProductsProps) {
  
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
  <section className="mt-1">
    <div className="flex justify-between items-end mb-2 px-4">
      {/* Cụm tiêu đề bên trái */}
      <div>
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-[hsl(var(--foreground))]">
            {title}
          </h2>
        </div>
        <div className="h-1 w-12 bg-[hsl(var(--primary))] mt-2"></div>
      </div>
    </div>

    <div className="relative px-0 md:px-0 overflow-hidden">


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

  breakpoints={{
    768: { slidesPerView: 3, spaceBetween: 20 },
    1024: { slidesPerView: 4, spaceBetween: 24 },
  }}
  // 3. Chỉnh lại padding bottom (vì không còn bullet nên không cần khoảng trống bên dưới)
  className="related-swiper !pb-2" 
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

    </div>
  </section>
);

}
