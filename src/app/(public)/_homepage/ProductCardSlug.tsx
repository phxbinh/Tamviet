'use client';

import { PrefetchLink } from "@/components/ui/PrefetchLink";
import { ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ProductCardPropsSlug {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  price_min?: number;
}

export function ProductCardSlug_({ id, slug, name, thumbnail_url, price_min }: ProductCardPropsSlug) {
  const href = `/testSearchParam/products/${slug}`;

  return (
    <PrefetchLink
      href={href}
      className="group block w-full relative overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform"
    >
      
      {/* Container Ảnh */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#fafafa]">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={name}
            className="w-full h-full object-cover will-change-transform transition-transform duration-[2.5s] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/10">
            <ShoppingBag className="w-16 h-16 stroke-[0.3]" />
          </div>
        )}

        {/* Hover CTA */}
        <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
          <div className="px-6 py-3 bg-white/95 text-black text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-sm">
            Discover
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" />
          </div>
        </div>

        {/* Border hover */}
        <div className="absolute inset-0 border border-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>

      {/* Info */}
      <div className="p-2 md:p-5 text-center space-y-1.5 md:space-y-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-x-1">
          <h3 className="text-[12px] md:text-sm font-medium text-foreground/90 line-clamp-1 transition-colors duration-500 group-hover:text-black">
            {name}
          </h3>

          <span className="hidden md:inline text-muted-foreground/30">•</span>

          {price_min ? (
            <span className="text-sm md:text-sm font-semibold tracking-tight text-foreground/80 md:text-foreground">
              {new Intl.NumberFormat('vi-VN').format(price_min)}
              <span className="ml-1 text-[10px] font-normal text-muted-foreground uppercase">
                vnd
              </span>
            </span>
          ) : (
            <span className="text-[10px] md:text-xs font-medium text-muted-foreground/50 italic tracking-wider">
              Price upon request
            </span>
          )}
        </div>
      </div>

    </PrefetchLink>
  );
}


/*
'use client';

import { ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import { PrefetchLink } from "@/components/ui/PrefetchLink";

interface ProductCardPropsSlug {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  price_min?: number;
}
*/



export function ProductCardSlug({ id, slug, name, thumbnail_url, price_min }: ProductCardPropsSlug) {
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const href = `/testSearchParam/products/${slug}`;

  // 1. Dùng TouchStart để icon hiện lên NGAY LẬP TỨC khi ngón tay vừa chạm xuống
  const handleTouchStart = () => {
    setIsActive(true);
  };

  // 2. Click ra ngoài để reset trạng thái
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsActive(false);
      }
    };
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to cart:", id);
  };

  return (
    <div 
      ref={cardRef} 
      className="relative w-full"
      onTouchStart={handleTouchStart} // Kích hoạt ngay khi chạm
    >
      <PrefetchLink
        href={href}
        className="group block w-full relative overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform"
      >
        {/* Container Ảnh */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#fafafa]">
          {thumbnail_url ? (
            <img
              src={thumbnail_url}
              alt={name}
              className="w-full h-full object-cover will-change-transform transition-transform duration-[2.5s] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/10">
              <ShoppingBag className="w-16 h-16 stroke-[0.3]" />
            </div>
          )}

          {/* Nút Giỏ hàng - Hiện theo Hover (Desktop) hoặc Active State (Mobile) */}
          <div className="absolute bottom-3 right-3 z-20">
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center bg-card/90 p-2.5 rounded-full shadow-md backdrop-blur-sm
                        text-foreground transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                        active:scale-75 hover:bg-primary hover:text-white
                        ${isActive 
                          ? "translate-y-0 opacity-100 scale-100" 
                          : "translate-y-4 opacity-0 scale-90 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-hover:scale-100"
                        }`}
            >
              <ShoppingCart className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          <div className={`absolute inset-0 border border-border/50 transition-opacity duration-700 pointer-events-none 
            ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} 
          />
        </div>

        {/* Info */}
        <div className="p-2 md:p-5 text-center space-y-1.5 md:space-y-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-x-1">
            <h3 className={`text-[12px] md:text-sm font-medium transition-colors duration-500 
              ${isActive ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"}`}>
              {name}
            </h3>
            {price_min ? (
              <span className="text-sm md:text-sm font-semibold tracking-tight text-foreground/80 md:text-foreground">
                {new Intl.NumberFormat('vi-VN').format(price_min)}
                <span className="ml-1 text-[10px] font-normal text-muted-foreground uppercase">
                  vnd
                </span>
              </span>
            ) : (
              <span className="text-[10px] md:text-xs font-medium text-muted-foreground/50 italic tracking-wider">
                Price upon request
              </span>
            )}
          </div>
        </div>
      </PrefetchLink>
    </div>
  );
}






export function ProductCardSlug__({ id, slug, name, thumbnail_url, price_min }: ProductCardPropsSlug) {
  const href = `/testSearchParam/products/${slug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to cart:", id);
  };

  return (
    <PrefetchLink
      href={href}
      // Thêm "active" vào className của cha để kích hoạt các con bên trong khi chạm
      className="group active block w-full relative overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform"
    >
      
      <div className="relative aspect-[4/5] overflow-hidden bg-[#fafafa]">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={name}
            className="w-full h-full object-cover will-change-transform transition-transform duration-[2.5s] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-foreground/10">
            <ShoppingBag className="w-16 h-16 stroke-[0.3]" />
          </div>
        )}

        {/* Nút Giỏ hàng - Fix lỗi không hiện trên mobile */}
        <div className="absolute bottom-3 right-3 z-20">
          <button
            onClick={handleAddToCart}
            // Giải pháp: Thêm group-active: để hiện ngay khi vừa chạm vào màn hình (Mobile)
            // group-hover: dùng cho chuột (Desktop)
            className="flex items-center justify-center bg-card/90 p-2.5 rounded-full shadow-md backdrop-blur-sm
                     text-foreground 
                     translate-y-4 opacity-0 scale-90
                     group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100
                     group-active:translate-y-0 group-active:opacity-100 group-active:scale-100
                     transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                     active:scale-75 hover:bg-primary hover:text-white"
          >
            <ShoppingCart className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        <div className="absolute inset-0 border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>

      <div className="p-2 md:p-5 text-center space-y-1.5 md:space-y-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-x-1">
          <h3 className="text-[12px] md:text-sm font-medium text-foreground/80 line-clamp-1">
            {name}
          </h3>
          {price_min && (
             <span className="text-sm md:text-sm font-semibold tracking-tight text-foreground/90">
                {new Intl.NumberFormat('vi-VN').format(price_min)}
                <span className="ml-1 text-[10px] font-normal opacity-60 uppercase">vnd</span>
             </span>
          )}
        </div>
      </div>
    </PrefetchLink>
  );
}









