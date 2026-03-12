// src/components/shop/ProductCard.tsx
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  thumbnail_url?: string;
  price_min?: number;
}

export function ProductCard({ id, name, thumbnail_url, price_min }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className="group block w-full">
      {/* Container Ảnh: Tỉ lệ 4/5 chuẩn High-end */}
      <div className="relative aspect-[4/5] overflow-hidden bg-card rounded-2xl border border-border/50 shadow-sm transition-all duration-500 group-hover:shadow-md">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/30 text-muted-foreground/20">
            <ShoppingBag className="w-10 h-10 stroke-[1]" />
          </div>
        )}

        {/* Overlay nút: Chỉ hiện trên Desktop (hidden trên mobile để tránh rác mắt) */}
        <div className="hidden md:flex absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
             <span className="bg-background text-foreground px-5 py-2.5 text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 rounded-full border border-border">
               View <ArrowRight className="w-3 h-3" />
             </span>
          </div>
        </div>
      </div>

      {/* Info: Căn lề trái trên Mobile nhìn sẽ chắc chắn hơn căn giữa */}
      <div className="mt-4 space-y-1.5 px-1 text-left md:text-center">
        <h3 className="text-[11px] md:text-sm font-bold text-foreground/80 line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <div className="flex flex-col md:items-center">
          {price_min ? (
            <p className="text-sm md:text-base font-black tracking-tighter text-foreground tabular-nums">
              {new Intl.NumberFormat('vi-VN').format(price_min)}
              <span className="ml-1 text-[9px] font-normal opacity-50 uppercase italic">VND</span>
            </p>
          ) : (
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
              Valuation Required
            </p>
          )}
          {/* Thanh trang trí: Ẩn trên mobile cho sạch */}
          <div className="hidden md:block w-0 group-hover:w-8 h-[1.5px] bg-primary/40 transition-all duration-500 mt-1" />
        </div>
      </div>
    </Link>
  );
}
