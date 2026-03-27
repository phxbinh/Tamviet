"use client";
import { useEffect, useRef } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const scrollToImage = (index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: scrollRef.current.clientWidth * index,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    if (!variantImage) return;
    const index = images.findIndex(img => img.url === variantImage);
    if (index !== -1) scrollToImage(index);
  }, [variantImage, images]);

  const handleScroll = () => {
    if (!scrollRef.current || ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const el = scrollRef.current!;
      const index = Math.round(el.scrollLeft / el.clientWidth);
      if (index !== activeImgIndex) setActiveImgIndex(index);
      ticking.current = false;
    });
  };

  return (
    <div className="lg:col-span-7 flex flex-col gap-6">
      {/* MAIN VIEWPORT */}
      <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-100 shadow-inner">
        
        {/* Gallery Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
          style={{ touchAction: "pan-y pan-x" }}
        >
          {images.length > 0 ? (
            images.map((img) => (
              <div key={img.id} className="h-full w-full flex-none snap-center p-1">
                <img
                  src={getPublicImageUrl(img.url)}
                  alt={productName}
                  className="w-full h-full object-cover rounded-[1.8rem] transition-transform duration-700 group-hover:scale-105"
                  draggable={false}
                />
              </div>
            ))
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-stone-300">
              <ShoppingBag className="w-16 h-16 stroke-[1px]" />
              <p className="text-sm font-light uppercase tracking-widest">No images available</p>
            </div>
          )}
        </div>

        {/* Floating Navigation Controls (Chỉ hiện khi hover) */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button 
              onClick={() => scrollToImage(activeImgIndex - 1)}
              disabled={activeImgIndex === 0}
              className="p-3 rounded-full bg-white/80 backdrop-blur-md shadow-lg pointer-events-auto disabled:hidden hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scrollToImage(activeImgIndex + 1)}
              disabled={activeImgIndex === images.length - 1}
              className="p-3 rounded-full bg-white/80 backdrop-blur-md shadow-lg pointer-events-auto disabled:hidden hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Indicator Dots (Elegant Style) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/10 backdrop-blur-sm">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToImage(i)}
              className="relative h-1.5 transition-all duration-300"
              style={{ width: activeImgIndex === i ? '24px' : '6px' }}
            >
              <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${activeImgIndex === i ? "bg-white" : "bg-white/40"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* THUMBNAILS BAR */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-1">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => scrollToImage(i)}
            className={`relative flex-none w-24 aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-500 ease-out ${
              activeImgIndex === i
                ? "ring-2 ring-black ring-offset-2 scale-95"
                : "opacity-60 hover:opacity-100 hover:scale-105"
            }`}
          >
            <img
              src={getPublicImageUrl(img.url)}
              className="w-full h-full object-cover"
              alt={`thumbnail-${i}`}
            />
            {/* Overlay for active state */}
            {activeImgIndex === i && (
              <motion.div 
                layoutId="active-thumb"
                className="absolute inset-0 bg-black/5"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
