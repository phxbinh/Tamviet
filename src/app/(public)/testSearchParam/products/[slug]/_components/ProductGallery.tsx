/*
"use client";
import { useEffect, useRef } from "react";
import { Zap, Heart, ShoppingBag } from "lucide-react";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { ProductImage } from "../types";

interface GalleryProps {
  images: ProductImage[];
  productName: string;
  activeImgIndex: number;
  setActiveImgIndex: (index: number) => void;
  variantImage?: string | null;
}

export function ProductGallery({ images, productName, activeImgIndex, setActiveImgIndex, variantImage }: GalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variantImage) {
      const index = images.findIndex(img => img.url === variantImage);
      if (index !== -1) scrollToImage(index);
    }
  }, [variantImage, images]);

  const scrollToImage = (index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: scrollRef.current.offsetWidth * index, behavior: "smooth" });
    setActiveImgIndex(index);
  };

  return (
    <div className="lg:col-span-7 space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-secondary/30 group">
        <div className="absolute top-6 left-6 z-10">
          <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
            <Zap className="w-3 h-3 fill-primary text-primary" /> New Edition
          </span>
        </div>
        
        <button className="absolute right-6 top-6 z-10 p-4 bg-white/95 backdrop-blur rounded-full shadow-sm hover:scale-110 transition-transform">
          <Heart className="w-5 h-5 text-foreground" />
        </button>

        <div 
          ref={scrollRef}
          onScroll={(e) => setActiveImgIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth))}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x"
        >
          {images.length > 0 ? images.map((img) => (
            <div key={img.id} className="h-full w-full flex-none snap-center">
              <img src={getPublicImageUrl(img.url)} alt={productName} className="w-full h-full object-cover select-none" />
            </div>
          )) : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-20 h-20 opacity-10" /></div>}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={() => scrollToImage(i)} className={`h-1.5 transition-all duration-500 rounded-full ${activeImgIndex === i ? "w-8 bg-white" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, i) => (
          <button key={img.id} onClick={() => scrollToImage(i)} className={`relative flex-none w-20 aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all ${activeImgIndex === i ? "border-primary ring-4 ring-primary/10" : "border-transparent opacity-40"}`}>
            <img src={getPublicImageUrl(img.url)} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

*/


"use client";
import { useEffect, useRef } from "react";
import { Zap, Heart, ShoppingBag } from "lucide-react";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { ProductImage } from "../types";

interface GalleryProps {
  images: ProductImage[];
  productName: string;
  activeImgIndex: number;
  setActiveImgIndex: (index: number) => void;
  variantImage?: string | null;
}

export function ProductGallery({ images, productName, activeImgIndex, setActiveImgIndex, variantImage }: GalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Khóa để chặn onScroll khi đang cuộn chủ động
  const isInternalScrolling = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (variantImage) {
      const index = images.findIndex(img => img.url === variantImage);
      if (index !== -1) scrollToImage(index);
    }
  }, [variantImage, images]);

  const scrollToImage = (index: number) => {
    if (!scrollRef.current) return;
    
    // Bật khóa
    isInternalScrolling.current = true;
    
    scrollRef.current.scrollTo({ 
      left: scrollRef.current.offsetWidth * index, 
      behavior: "smooth" 
    });
    
    setActiveImgIndex(index);

    // Xóa timeout cũ nếu có
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Mở khóa sau khi cuộn xong (khoảng 500ms cho smooth scroll)
    timeoutRef.current = setTimeout(() => {
      isInternalScrolling.current = false;
    }, 500);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Nếu đang cuộn bằng hàm scrollToImage thì không chạy logic này
    if (isInternalScrolling.current) return;

    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    
    if (newIndex !== activeImgIndex) {
      setActiveImgIndex(newIndex);
    }
  };

  return (
    <div className="lg:col-span-7 space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-secondary/30 group">
        {/* ... (Các phần Badge, Heart giữ nguyên) ... */}
{/*
        <div 
          ref={scrollRef}
          onScroll={handleScroll} // Dùng hàm handleScroll đã có khóa
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar touch-pan-x"
          //className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar touch-pan-y"
        >
          {images.length > 0 ? images.map((img) => (
            <div key={img.id} className="h-full w-full flex-none snap-center">
              <img src={getPublicImageUrl(img.url)} alt={productName} className="w-full h-full object-cover select-none" />
            </div>
          )) : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-20 h-20 opacity-10" /></div>}
        </div> 
*/}

<div 
  ref={scrollRef}
  onScroll={handleScroll}
  className="flex h-full w-full overflow-x-auto snap-x snap-proximity no-scrollbar scroll-smooth"
  style={{ touchAction: 'pan-y' }}
>
  {images.length > 0 ? images.map((img) => (
    <div key={img.id} className="h-full w-full flex-none snap-center">
      <img 
        src={getPublicImageUrl(img.url)} 
        alt={productName} 
        className="w-full h-full object-cover select-none" 
      />
    </div>
  )) : (
    <div className="w-full h-full flex items-center justify-center">
      <ShoppingBag className="w-20 h-20 opacity-10" />
    </div>
  )}
</div>



        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button 
              key={i} 
              type="button"
              onClick={() => scrollToImage(i)} 
              className={`h-1.5 transition-all duration-500 rounded-full ${activeImgIndex === i ? "w-8 bg-white" : "w-1.5 bg-white/40"}`} 
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
        {images.map((img, i) => (
          <button 
            key={img.id} 
            type="button"
            onClick={() => scrollToImage(i)} 
            className={`relative flex-none w-20 aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImgIndex === i ? "border-primary ring-4 ring-primary/10 scale-95" : "border-transparent opacity-40 hover:opacity-100"}`}
          >
            <img src={getPublicImageUrl(img.url)} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}




