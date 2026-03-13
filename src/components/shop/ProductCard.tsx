// src/components/shop/ProductCard.tsx
import Link from "next/link";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  thumbnail_url?: string;
  price_min?: number;
}

export function ProductCard_({ id, name, thumbnail_url, price_min }: ProductCardProps) {
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






/*
interface ProductCardProps {
  id: string;
  name: string;
  thumbnail_url?: string;
  price_min?: number;
}
*/

export function ProductCard__({ id, name, thumbnail_url, price_min }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className="group block w-full relative">
      {/* Container Ảnh: Tỉ lệ 4/5 chuẩn High-end Fashion */}
      <div className="relative aspect-[4/5] overflow-hidden bg-background rounded-[2rem] border border-border/40 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rounded-2xl group-hover:border-primary/20 shadow-[0_0_0_0_rgba(0,0,0,0)] group-hover:shadow-[0_20px_50px_rgba(var(--primary),0.08)]">
        
        {/* Nhãn "New" hoặc Trang trí nhỏ góc trái */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-background/60 backdrop-blur-md border border-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 group-hover:translate-x-0">
            <Sparkles className="w-3 h-3 text-primary" />
          </div>
        </div>

        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground/10">
            <ShoppingBag className="w-12 h-12 stroke-[0.5]" />
          </div>
        )}

        {/* Overlay mờ dần khi hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Nút View Detail - Hiệu ứng Glassmorphism */}
        <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 rounded-full translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
            Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="mt-5 space-y-2 px-2 transition-transform duration-500 group-hover:-translate-y-1">
        {/* Category giả định hoặc Subtitle nhỏ */}
        <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          Exclusive Collection
        </p>

        <h3 className="text-[12px] md:text-sm font-semibold text-foreground/70 line-clamp-1 tracking-tight group-hover:text-foreground transition-colors duration-300">
          {name}
        </h3>
        
        <div className="flex items-baseline gap-1.5 overflow-hidden">
          {price_min ? (
            <p className="text-base md:text-lg font-black tracking-tighter text-foreground tabular-nums flex items-baseline">
              {new Intl.NumberFormat('vi-VN').format(price_min)}
              <span className="ml-1 text-[10px] font-bold opacity-30">đ</span>
            </p>
          ) : (
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 italic">
              Contact for Price
            </p>
          )}
          
          {/* Thanh progress trang trí chạy ngang khi hover - Hào hứng hơn */}
          <div className="flex-1 h-[1px] bg-border/30 relative overflow-hidden hidden md:block">
            <div className="absolute inset-0 bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// src/components/shop/ProductCard.tsx
export function ProductCard___({ id, name, thumbnail_url, price_min }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className="group block w-full relative overflow-hidden rounded-[2.5rem] border border-border/40 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:border-primary/20 hover:shadow-[0_40px_80px_rgba(var(--primary),0.1)] hover:-translate-y-2 bg-background">
      
      {/* Container Ảnh: Tỉ lệ 4/5 chuẩn High-end Fashion */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.2,1,0.2,1)] group-hover:scale-110 group-hover:rotate-1"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground/10">
            <ShoppingBag className="w-12 h-12 stroke-[0.5]" />
          </div>
        )}

        {/* Overlay mờ dần khi hover: Đậm hơn ở dưới để tôn giá tiền */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Nút View Detail - Hiệu ứng bứt phá từ cạnh dưới */}
        <div className="hidden md:flex absolute bottom-0 left-0 right-0 items-center justify-center p-6">
          <div className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white py-4 text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl flex items-center justify-center gap-3 rounded-xl translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
            Explore Collection <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-500" />
          </div>
        </div>
      </div>

      {/* Thông tin sản phẩm: Giờ nó là một phần của khối rounded lớn */}
      <div className="p-6 pt-5 space-y-2.5 bg-card/60 backdrop-blur-lg border-t border-border/40">
        <h3 className="text-[12px] md:text-sm font-semibold text-foreground/80 line-clamp-1 tracking-tight group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>
        
        <div className="flex items-baseline gap-2 overflow-hidden">
          {price_min ? (
            <p className="text-xl md:text-2xl font-black tracking-tighter text-foreground tabular-nums flex items-baseline">
              {new Intl.NumberFormat('vi-VN').format(price_min)}
              <span className="ml-1 text-[11px] font-bold opacity-30">VND</span>
            </p>
          ) : (
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40 italic">
              Valuation Required
            </p>
          )}
          
          {/* Thanh progress trang trí: Chạy ngang khi hover - Hào hứng hơn */}
          <div className="flex-1 h-[1px] bg-border/20 relative overflow-hidden hidden md:block mt-2">
            <div className="absolute inset-0 bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
          </div>
        </div>
      </div>
    </Link>
  );
}







export function ProductCard({ id, name, thumbnail_url, price_min }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className="group block w-full relative overflow-hidden rounded-[2.5rem] border border-border/30 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:border-primary/20 hover:shadow-[0_40px_80px_rgba(var(--primary),0.1)] hover:-translate-y-2 bg-background">
      
      {/* Container Ảnh: Tỉ lệ 4/5 chuẩn High-end Fashion */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.2,1,0.2,1)] group-hover:scale-110 group-hover:rotate-1"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground/10">
            <ShoppingBag className="w-12 h-12 stroke-[0.5]" />
          </div>
        )}

        {/* Overlay mờ dần khi hover: Đậm hơn ở dưới để tôn giá tiền */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Nút View Detail - Hiệu ứng bứt phá từ cạnh dưới */}
        <div className="hidden md:flex absolute bottom-0 left-0 right-0 items-center justify-center p-6">
          <div className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white py-4 text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl flex items-center justify-center gap-3 rounded-xl translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
            Explore Collection <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-500" />
          </div>
        </div>
      </div>

      {/* Thông tin sản phẩm: Giờ nó là một phần của khối rounded lớn */}
      <div className="p-6 pt-5 space-y-2.5 bg-card/60 backdrop-blur-lg border-t border-border/40">
        <h3 className="text-[12px] md:text-sm font-semibold text-foreground/80 line-clamp-1 tracking-tight group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>
        
        <div className="flex items-baseline gap-2 overflow-hidden">
          {price_min ? (
            <p className="text-xl md:text-2xl font-black tracking-tighter text-foreground tabular-nums flex items-baseline">
              {new Intl.NumberFormat('vi-VN').format(price_min)}
              <span className="ml-1 text-[11px] font-bold opacity-30">VND</span>
            </p>
          ) : (
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40 italic">
              Valuation Required
            </p>
          )}
          
          {/* Thanh progress trang trí: Chạy ngang khi hover - Hào hứng hơn */}
          <div className="flex-1 h-[1px] bg-border/20 relative overflow-hidden hidden md:block mt-2">
            <div className="absolute inset-0 bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
          </div>
        </div>
      </div>
    </Link>
  );
}













