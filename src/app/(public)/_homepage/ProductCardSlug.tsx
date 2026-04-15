'use client';

import { PrefetchLink } from "@/components/ui/PrefetchLink";
import { ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useToastStore } from "@/store/useToastStore";
import Image from "next/image";

interface ProductCardPropsSlug {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  price_min?: number;
}

export function ProductCardSlug({ id, slug, name, thumbnail_url, price_min }: ProductCardPropsSlug) {
  const href = `/testSearchParam/products/${slug}`;
  const { showToast } = useToastStore();

  const priceFormatted = useMemo(() => {
    if (!price_min) return null;
    return new Intl.NumberFormat("vi-VN").format(price_min);
  }, [price_min]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }

    //alert("Added to cart: " + id);
    try {
      // Giả lập logic thành công
      showToast(`Đã thêm sản phẩm thành công!`, "success");
    } catch (error) {
      // Giả lập logic thất bại
      showToast("Có lỗi xảy ra, vui lòng thử lại.", "error");
    }
  };

  return (
    <div className="relative w-full">
      <PrefetchLink
        href={href}
        className="group block w-full relative overflow-hidden"
      >
        {/* IMAGE */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#fafafa]">
          {thumbnail_url ? (
            <div className="relative w-full aspect-[3/4] bg-[#fafafa] overflow-hidden">
              <Image
                src={thumbnail_url}
                alt={name}
                fill
                priority
                placeholder="blur"
                className="object-contain p-2"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/10">
              <ShoppingBag className="w-16 h-16 stroke-[0.3]" />
            </div>
          )}

          {/* ADD TO CART */}
{/* Tạm đóng do sản phẩm có nhiều variants nên cần đi tới detail */}
{/*
          <div className="
            absolute bottom-3 right-3 z-20
            opacity-100 translate-y-0
            md:opacity-0 md:translate-y-4
            md:group-hover:opacity-100 md:group-hover:translate-y-0
            transition-all duration-300
          ">
            <button
              onClick={handleAddToCart}
              aria-label="Thêm sản phẩm vào giỏ hàng"
              className="
                flex items-center justify-center
                bg-card/90 p-2.5 rounded-full shadow-md backdrop-blur-sm
                text-foreground
                hover:bg-primary hover:text-white
                active:scale-75
                transition-all
              "
            >
              <ShoppingCart className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
*/}
          {/* BORDER HOVER */}
          <div className="
            absolute inset-0 border border-border/50 pointer-events-none
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
          " />
        </div>

        {/* INFO */}
        <div className="p-2 md:p-5 text-center space-y-1.5 md:space-y-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-x-1">
            <h3 className="text-[12px] md:text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
              {name}
            </h3>

            {price_min ? (
              <span className="text-sm font-semibold text-foreground/80 md:text-foreground">
                {/*new Intl.NumberFormat('vi-VN').format(price_min)*/ priceFormatted}
                <span className="ml-1 text-[10px] text-muted-foreground uppercase">
                  vnd
                </span>
              </span>
            ) : (
              <span className="text-[10px] italic text-muted-foreground/50">
                Price upon request
              </span>
            )}
          </div>
        </div>
      </PrefetchLink>
    </div>
  );
}


