"use client";
import { useEffect, useRef } from "react";
import { ShoppingBag } from "lucide-react";
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
  const ticking = useRef(false);

  // 👉 Scroll tới ảnh (KHÔNG cần lock)
  const scrollToImage = (index: number) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTo({
      left: scrollRef.current.clientWidth * index,
      behavior: "smooth"
    });
  };

  // 👉 Khi chọn variant → scroll
  useEffect(() => {
    if (!variantImage) return;

    const index = images.findIndex(img => img.url === variantImage);
    if (index !== -1) scrollToImage(index);
  }, [variantImage, images]);

  // 👉 Handle scroll mượt (không lag)
  const handleScroll = () => {
    if (!scrollRef.current) return;

    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const el = scrollRef.current!;
      const index = Math.round(el.scrollLeft / el.clientWidth);

      if (index !== activeImgIndex) {
        setActiveImgIndex(index);
      }

      ticking.current = false;
    });
  };

  return (
    <div className="lg:col-span-7 space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-secondary/30">

        {/* ✅ Gallery */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full w-full overflow-x-auto snap-x snap-proximity no-scrollbar scroll-smooth"
          style={{ touchAction: "pan-y" }}
        >
          {images.length > 0 ? (
            images.map((img) => (
              <div key={img.id} className="h-full w-full flex-none snap-center">
                <img
                  src={getPublicImageUrl(img.url)}
                  alt={productName}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-20 h-20 opacity-10" />
            </div>
          )}
        </div>

        {/* ✅ Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToImage(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeImgIndex === i
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ✅ Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => scrollToImage(i)}
            className={`relative flex-none w-20 aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
              activeImgIndex === i
                ? "border-primary ring-4 ring-primary/10 scale-95"
                : "border-transparent opacity-40 hover:opacity-100"
            }`}
          >
            <img
              src={getPublicImageUrl(img.url)}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}