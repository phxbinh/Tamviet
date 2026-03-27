"use client";
import { useEffect, useRef, useMemo } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { ProductImage } from "../types";

interface GalleryProps {
  images: ProductImage[];
  productName: string;
  activeImgIndex: number;
  setActiveImgIndex: (index: number) => void;
  variantImage?: string | null;
}

export function ProductGallery({
  images,
  productName,
  activeImgIndex,
  setActiveImgIndex,
  variantImage
}: GalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayImages = useMemo(() => {
    if (!variantImage) return images;
    // Tìm những ảnh có cùng variant_id với ảnh variant đang chọn
    const selectedVariantId = images.find(i => i.url === variantImage)?.variant_id;
    const filtered = images.filter(img => img.variant_id === selectedVariantId);
    return filtered.length > 0 ? filtered : images;
  }, [images, variantImage]);

  const scrollToImage = (index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: scrollRef.current.clientWidth * index,
      behavior: "smooth"
    });
  };

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
    <div className="lg:col-span-7 flex flex-col gap-4">
      {/* KHUNG ẢNH CHÍNH: Tràn viền hoàn toàn 
          - Bỏ rounded-[2.5rem]
          - Bỏ shadow-inner và bg-stone-100 để ảnh "tan" vào nền nếu nền cùng màu
      */}
      <div className="group relative aspect-[4/5] overflow-hidden w-full bg-white">
        
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {displayImages.length > 0 ? (
            displayImages.map((img, i) => (
              <div key={img.id || i} className="h-full w-full flex-none snap-center">
                {/* ẢNH CHÍNH: Tràn tuyệt đối 
                    - Bỏ p-1 (padding)
                    - Bỏ rounded
                */}
                <img
                  src={getPublicImageUrl(img.url)}
                  alt={`${productName} - ${i}`}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
              </div>
            ))
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-200">
              <ShoppingBag className="w-12 h-12 stroke-[1px]" />
            </div>
          )}
        </div>

        {/* Nút điều hướng tinh tế hơn cho ảnh tràn viền */}
        {displayImages.length > 1 && (
          <>
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <button 
                onClick={() => scrollToImage(activeImgIndex - 1)} 
                className="p-2 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/90 pointer-events-auto transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => scrollToImage(activeImgIndex + 1)} 
                className="p-2 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/90 pointer-events-auto transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Dots tối giản lồng vào cạnh dưới */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/10 backdrop-blur-md">
              {displayImages.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 transition-all duration-300 rounded-full ${
                    activeImgIndex === i ? "w-5 bg-white" : "w-1 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* THUMBNAILS: Giữ lại bo góc nhẹ để phân biệt với ảnh chính */}
{/*
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-4 lg:px-0">
        {displayImages.map((img, i) => (
          <button
            key={img.id || i}
            onClick={() => scrollToImage(i)}
            className={`relative flex-none w-16 aspect-[3/4] rounded-lg overflow-hidden transition-all duration-300 ${
              activeImgIndex === i 
                ? "ring-1 ring-black ring-offset-2" 
                : "opacity-40 grayscale hover:grayscale-0 hover:opacity-100"
            }`}
          >
            <img src={getPublicImageUrl(img.url)} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
*/}
      {/* THUMBNAILS: Sát viền, tối giản */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-4 lg:px-0">
        {displayImages.map((img, i) => (
          <button
            key={img.id || i}
            type="button"
            onClick={() => scrollToImage(i)}
            className={`relative flex-none w-16 aspect-[3/4] overflow-hidden transition-all duration-300 border-2 ${
              activeImgIndex === i 
                ? "border-blue-500 opacity-100" 
                : "border-transparent opacity-50 hover:opacity-100"
            }`}
          >
            <img 
              src={getPublicImageUrl(img.url)} 
              className="w-full h-full object-cover"
              alt={`Thumbnail ${i}`}
            />
          </button>
        ))}
      </div>



    </div>
  );
}
