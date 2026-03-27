"use client";
import { useEffect, useRef, useMemo } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { ProductImage } from "../types";

interface GalleryProps {
  images: ProductImage[];
  productName: string;
  activeImgIndex: number;
  setActiveImgIndex: (index: number) => void;
  variantImage?: string | null; // Ảnh đại diện của variant để nhận diện nhóm ảnh
}

export function ProductGallery({
  images,
  productName,
  activeImgIndex,
  setActiveImgIndex,
  variantImage
}: GalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 👉 1. LOGIC LỌC ẢNH: Lấy tất cả ảnh có cùng thuộc tính với variant được chọn
  // Giả sử các ảnh của cùng 1 variant sẽ có chung một đặc điểm (ở đây mình ví dụ là dựa trên logic URL hoặc bạn có thể đổi thành variant_id)
  const displayImages = useMemo(() => {
    if (!variantImage) return images;

    // Tìm những ảnh thuộc về variant này (Logic này tùy thuộc vào cấu trúc Data của bạn)
    // Ở đây mình ví dụ: lọc các ảnh có cùng 'color' hoặc cùng group với variantImage
    const filtered = images.filter(img => img.variant_id === images.find(i => i.url === variantImage)?.variant_id);
    
    return filtered.length > 0 ? filtered : images;
  }, [images, variantImage]);

  // 👉 2. SCROLL CONTROL
  const scrollToImage = (index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: scrollRef.current.clientWidth * index,
      behavior: "smooth"
    });
    setActiveImgIndex(index);
  };

  // Reset về ảnh đầu tiên khi đổi Variant
  useEffect(() => {
    scrollToImage(0);
  }, [variantImage]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== activeImgIndex) setActiveImgIndex(index);
  };

  return (
    <div className="lg:col-span-7 flex flex-col gap-6">
      {/* KHUNG ẢNH CHÍNH */}
      <div className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-stone-100 shadow-inner">
        
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {displayImages.map((img, i) => (
            <div key={img.id || i} className="h-full w-full flex-none snap-center p-1">
              <img
                src={getPublicImageUrl(img.url)}
                alt={`${productName} - ${i}`}
                className="w-full h-full object-cover rounded-[2.3rem]"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Nút điều hướng nhanh (Chỉ hiện khi có > 1 ảnh) */}
        {displayImages.length > 1 && (
          <>
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <button onClick={() => scrollToImage(activeImgIndex - 1)} className="p-3 rounded-full bg-white/90 backdrop-blur shadow-sm pointer-events-auto hover:scale-110 transition-transform disabled:opacity-30">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scrollToImage(activeImgIndex + 1)} className="p-3 rounded-full bg-white/90 backdrop-blur shadow-sm pointer-events-auto hover:scale-110 transition-transform disabled:opacity-30">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 rounded-full bg-black/5 backdrop-blur-md">
              {displayImages.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${activeImgIndex === i ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* THUMBNAILS: Chỉ hiện những ảnh thuộc Variant đang chọn */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {displayImages.map((img, i) => (
          <button
            key={img.id || i}
            onClick={() => scrollToImage(i)}
            className={`relative flex-none w-20 aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-300 ${
              activeImgIndex === i ? "ring-2 ring-black ring-offset-2" : "opacity-40 hover:opacity-100"
            }`}
          >
            <img src={getPublicImageUrl(img.url)} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
