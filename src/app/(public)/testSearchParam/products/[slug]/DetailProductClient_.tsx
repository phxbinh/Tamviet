"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { 
  ShoppingBag, Zap, Heart, ArrowRight, Truck, ShieldCheck 
} from "lucide-react";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { ProductFull, Variant } from "./types";

export default function ProductDetailClient({ data }: { data: ProductFull }) {
  const { product, attributes, variants, images } = data;
  
  // 1. Quản lý State
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 2. Logic tìm Variant khớp với các thuộc tính đã chọn
  const selectedVariant = useMemo(() => {
    if (Object.keys(selected).length < attributes.length) return null;
    return variants.find((v) =>
      Object.entries(selected).every(([key, value]) => v.attributes[key] === value)
    );
  }, [selected, variants, attributes.length]);

  // 3. Hiệu ứng tự động trượt ảnh khi Variant thay đổi
  useEffect(() => {
    if (selectedVariant?.variant_image) {
      const targetIndex = images.findIndex(img => img.url === selectedVariant.variant_image);
      if (targetIndex !== -1) {
        scrollToImage(targetIndex);
      }
    }
  }, [selectedVariant, images]);

  const scrollToImage = (index: number) => {
    if (!scrollRef.current) return;
    const containerWidth = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: containerWidth * index,
      behavior: "smooth"
    });
    setActiveImgIndex(index);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeImgIndex) setActiveImgIndex(newIndex);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-20 items-start">
        
        {/* LEFT: INTERACTIVE GALLERY */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-secondary/30 group">
            {/* Badge & Heart */}
            <div className="absolute top-6 left-6 z-10">
              <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                <Zap className="w-3 h-3 fill-primary text-primary" /> New Edition
              </span>
            </div>
            
            <button className="absolute right-6 top-6 z-10 p-4 bg-white/95 backdrop-blur rounded-full shadow-sm hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 text-foreground" />
            </button>

            {/* Main Image Slider */}
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x"
            >
              {images.length > 0 ? images.map((img) => (
                <div key={img.id} className="h-full w-full flex-none snap-center">
                  <img 
                    src={getPublicImageUrl(img.url)} 
                    alt={product.name} 
                    className="w-full h-full object-cover select-none"
                  />
                </div>
              )) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                  <ShoppingBag className="w-20 h-20 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToImage(i)}
                  className={`h-1.5 transition-all duration-500 rounded-full ${
                    activeImgIndex === i ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Strip (Dành cho Desktop & Tablet) */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => scrollToImage(i)}
                className={`relative flex-none w-20 aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all
                  ${activeImgIndex === i ? "border-primary ring-4 ring-primary/10" : "border-transparent opacity-40 hover:opacity-100"}`}
              >
                <img src={getPublicImageUrl(img.url)} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

{/* change here */}
        {/* RIGHT: PRODUCT INFO */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-medium tracking-tight leading-[1.1]">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.short_description}
              </p>
            )}
          </div>

          {/* Price & Availability */}
          <div className="min-h-[100px] flex flex-col justify-center p-6 rounded-[2rem] bg-secondary/40 border border-border/50">
            {selectedVariant ? (
              <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tighter">
                    {new Intl.NumberFormat('vi-VN').format(selectedVariant.price)}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground uppercase">VND</span>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {selectedVariant.stock > 0 ? `In Stock (${selectedVariant.stock})` : 'Sold Out'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground/60 italic font-light">
                Please select your preferences
              </p>
            )}
          </div>

          {/* Attributes Selection */}
          <div className="grid gap-6 p-6 rounded-[2rem] bg-secondary/20 border border-border/40">
            {attributes.map((attr) => (
              <div key={attr.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    {attr.name}
                  </span>
                  {selected[attr.name] && (
                    <span className="text-[11px] font-bold text-primary uppercase">
                      {selected[attr.name]}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {attr.values.map((v) => {
                    const isActive = selected[attr.name] === v.value;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelected(prev => ({ ...prev, [attr.name]: v.value }))}
                        className={`
                          px-5 py-2.5 text-xs font-bold transition-all rounded-full border-2
                          ${isActive 
                            ? "bg-foreground text-background border-foreground shadow-lg scale-105" 
                            : "bg-white/50 border-transparent hover:border-border text-foreground/70"
                          }
                        `}
                      >
                        {v.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>



          {/* Buttons */}
          <div className="space-y-4 pt-4">
            <button
              disabled={!selectedVariant || isAdding}
              onClick={() => { setIsAdding(true); setTimeout(() => setIsAdding(false), 1500); }}
              className={`
                w-full py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4
                ${selectedVariant 
                  ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95" 
                  : "bg-secondary text-muted-foreground/50 cursor-not-allowed"}
              `}
            >
              {isAdding ? "Adding to Bag..." : (
                <>Add to Shopping Bag <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="flex items-center gap-4 p-5 rounded-3xl border border-border/50 bg-white/40">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Express Shipping</span>
               </div>
               <div className="flex items-center gap-4 p-5 rounded-3xl border border-border/50 bg-white/40">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Verified Quality</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}





/*
        // RIGHT: PRODUCT INFO 
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-medium tracking-tight leading-[1.1]">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.short_description}
              </p>
            )}
          </div>

          // Price & Availability 
          <div className="min-h-[100px] flex flex-col justify-center p-6 rounded-[2rem] bg-secondary/40 border border-border/50">
            {selectedVariant ? (
              <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tighter">
                    {new Intl.NumberFormat('vi-VN').format(selectedVariant.price)}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground uppercase">VND</span>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {selectedVariant.stock > 0 ? `In Stock (${selectedVariant.stock})` : 'Sold Out'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground/60 italic font-light">
                Please select your preferences
              </p>
            )}
          </div>

          // Attributes Selection 
          <div className="grid gap-6 p-6 rounded-[2rem] bg-secondary/20 border border-border/40">
            {attributes.map((attr) => (
              <div key={attr.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    {attr.name}
                  </span>
                  {selected[attr.name] && (
                    <span className="text-[11px] font-bold text-primary uppercase">
                      {selected[attr.name]}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {attr.values.map((v) => {
                    const isActive = selected[attr.name] === v.value;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelected(prev => ({ ...prev, [attr.name]: v.value }))}
                        className={`
                          px-5 py-2.5 text-xs font-bold transition-all rounded-full border-2
                          ${isActive 
                            ? "bg-foreground text-background border-foreground shadow-lg scale-105" 
                            : "bg-white/50 border-transparent hover:border-border text-foreground/70"
                          }
                        `}
                      >
                        {v.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

*/



/*
        // RIGHT: PRODUCT INFO 
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-medium tracking-tight leading-[1.1]">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.short_description}
              </p>
            )}
          </div>

          // Price & Availability 
          <div className="min-h-[100px] flex flex-col justify-center p-6 rounded-[2rem] bg-secondary/40 border border-border/50">
            {selectedVariant ? (
              <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tighter">
                    {new Intl.NumberFormat('vi-VN').format(selectedVariant.price)}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground uppercase">VND</span>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {selectedVariant.stock > 0 ? `In Stock (${selectedVariant.stock})` : 'Sold Out'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground/60 italic font-light">
                Please select your preferences
              </p>
            )}
          </div>

          // Attributes Selection 
          <div className="grid gap-6 p-6 rounded-[2rem] bg-secondary/20 border border-border/40">
            {attributes.map((attr) => (
              <div key={attr.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    {attr.name}
                  </span>
                  {selected[attr.name] && (
                    <span className="text-[11px] font-bold text-primary uppercase">
                      {selected[attr.name]}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {attr.values.map((v) => {
                    const isActive = selected[attr.name] === v.value;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelected(prev => ({ ...prev, [attr.name]: v.value }))}
                        className={`
                          px-5 py-2.5 text-xs font-bold transition-all rounded-full border-2
                          ${isActive 
                            ? "bg-foreground text-background border-foreground shadow-lg scale-105" 
                            : "bg-white/50 border-transparent hover:border-border text-foreground/70"
                          }
                        `}
                      >
                        {v.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>


*/










