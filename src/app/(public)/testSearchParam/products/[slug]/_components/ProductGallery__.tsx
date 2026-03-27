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

  // 👉 gesture tracking
  const startX = useRef(0);
  const currentX = useRef(0);
  const startTime = useRef(0);

  // 👉 scroll tới index
  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;

    const clamped = Math.max(0, Math.min(index, images.length - 1));

    scrollRef.current.scrollTo({
      left: clamped * scrollRef.current.clientWidth,
      behavior: "smooth"
    });

    setActiveImgIndex(clamped);
  };

  // 👉 variant change
  useEffect(() => {
    if (!variantImage) return;

    const index = images.findIndex(img => img.url === variantImage);
    if (index !== -1) scrollToIndex(index);
  }, [variantImage, images]);

  // 👉 touch start
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
    startTime.current = Date.now();
  };

  // 👉 touch move (scroll theo tay)
  const onTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;

    const x = e.touches[0].clientX;
    const dx = startX.current - x;

    scrollRef.current.scrollLeft += dx;
    startX.current = x;
    currentX.current = x;
  };

  // 👉 touch end (QUAN TRỌNG)
  const onTouchEnd = () => {
    if (!scrollRef.current) return;

    const dx = startX.current - currentX.current;
    const dt = Date.now() - startTime.current;

    const velocity = Math.abs(dx) / dt; // px/ms

    const threshold = scrollRef.current.clientWidth * 0.15;

    let nextIndex = activeImgIndex;

    if (Math.abs(dx) > threshold || velocity > 0.5) {
      nextIndex = dx > 0 ? activeImgIndex + 1 : activeImgIndex - 1;
    }

    scrollToIndex(nextIndex);
  };

  return (
    <div className="lg:col-span-7 space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-secondary/30">

        <div
          ref={scrollRef}
          className="flex h-full w-full overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {images.length > 0 ? (
            images.map((img) => (
              <div key={img.id} className="w-full h-full flex-none">
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

        {/* dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                activeImgIndex === i
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}