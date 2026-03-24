"use client";

import { useState, useMemo } from "react";
import { 
  ShoppingBag, Check, Zap, ShieldCheck, 
  Truck, ArrowRight, Heart, Star, Info 
} from "lucide-react";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';

// --- INTERFACES (Định nghĩa trực tiếp để đảm bảo tính độc lập) ---

interface AttributeValue {
  id: string;
  value: string;
}

interface Attribute {
  id: string;
  name: string;
  values: AttributeValue[];
}

interface Variant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

interface ProductImage {
  id: string;
  url: string;
  is_thumbnail: boolean;
}

interface Product {
  id: string;
  name: string;
  description?: string;
}

interface ProductFull {
  product: Product;
  attributes: Attribute[];
  variants: Variant[];
  images: ProductImage[];
}

export default function ProductDetailClient({ data }: { data: ProductFull }) {
  const { product, attributes, variants, images } = data;
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant = useMemo(() => {
    if (Object.keys(selected).length < attributes.length) return null;
    return variants.find((variant) =>
      Object.entries(selected).every(([key, value]) => variant.attributes[key] === value)
    );
  }, [selected, variants, attributes.length]);

  const mainImage = useMemo(() => {
    return images.find(img => img.is_thumbnail)?.url || images[0]?.url;
  }, [images]);

  return (
    <div className="max-w-7xl mx-auto px-2 py-6 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-24 items-start">
        
        {/* LEFT: IMAGE GALLERY */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 group relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary/30">
            <div className="absolute top-6 left-6 z-10">
              <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-sm">
                <Zap className="w-3 h-3 fill-primary text-primary" /> New Arrival
              </span>
            </div>
            
            <button className="absolute right-6 top-6 z-10 p-3 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-primary hover:text-white text-muted-foreground transition-all">
              <Heart className="w-5 h-5" />
            </button>

            {mainImage ? (
              <img 
                src={getPublicImageUrl(mainImage)} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ShoppingBag className="w-16 h-16 stroke-[1]" />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: CONTENT */}
        <div className="lg:col-span-5 space-y-2 md:space-y-8">
          {/* 1. Header & Price */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-widest">
              <Star className="w-3 h-3 fill-current" /> Premium Quality
            </div>
            <h1 className="text-4xl xl:text-5xl font-medium tracking-tight text-foreground leading-[1.1]">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-3 pt-2">
              {selectedVariant ? (
                <div className="flex items-baseline gap-1.5 animate-in fade-in slide-in-from-bottom-2">
                  <span className="text-3xl font-semibold tracking-tight">
                    {new Intl.NumberFormat('vi-VN').format(selectedVariant.price)}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground uppercase">VND</span>
                </div>
              ) : (
                <span className="text-2xl font-light text-muted-foreground/60">
                  Select options for price
                </span>
              )}
            </div>
          </div>
          {/* 3. Status & SKU Info (Chỉ hiện khi đã chọn đủ) */}
          <div className="min-h-[60px]">
            {selectedVariant && (
              <div className="flex items-center justify-between p-2 rounded-2xl bg-secondary/40 border border-border/50 animate-in">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${selectedVariant.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-xs font-medium uppercase tracking-tight">
                    {selectedVariant.stock > 0 ? `In Stock (${selectedVariant.stock} available)` : 'Out of Stock'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">SKU: {selectedVariant.sku}</span>
              </div>
            )}
          </div>
          <hr className="border-border/50" />

{/* 2. Attributes Selection (Ultra Compact Version) */}
<div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(160px,1fr))]"> {/* Giảm khoảng cách giữa các nhóm thuộc tính */}
  {attributes.map((attr) => (
    <div key={attr.id} className="space-y-2.5">
      {/* Label & Selected Value trên cùng 1 hàng, font nhỏ hơn */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
          {attr.name}
        </span>
        {selected[attr.name] && (
          <span className="text-[10px] font-bold text-primary uppercase animate-in fade-in slide-in-from-left-1">
            — {selected[attr.name]}
          </span>
        )}
      </div>
      
      {/* Nút bấm nhỏ gọn, gap khít */}
      <div className="flex flex-wrap gap-1.5">
        {attr.values.map((v) => {
          const isActive = selected[attr.name] === v.value;
          return (
            <button
              key={v.id}
              onClick={() => setSelected(prev => ({ ...prev, [attr.name]: v.value }))}
              className={`
                px-2 py-1.5 text-[11px] font-semibold transition-all rounded-md border
                ${isActive 
                  ? "bg-foreground text-background border-foreground shadow-sm" 
                  : "bg-secondary/30 border-transparent hover:border-border text-foreground/60"
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




          {/* 4. Action Buttons */}
          <div className="space-y-4">
            <button
              disabled={!selectedVariant || isAdding}
              onClick={() => { setIsAdding(true); setTimeout(() => setIsAdding(false), 2000); }}
              className={`
                w-full py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3
                ${selectedVariant 
                  ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:-translate-y-0.5" 
                  : "bg-secondary text-muted-foreground cursor-not-allowed"}
              `}
            >
              {isAdding ? "Processing..." : (
                <>Add to Shopping Bag <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
            
            <div className="grid grid-cols-2 gap-3">
               <div className="flex items-center gap-3 p-4 rounded-2xl border border-border/60 hover:bg-secondary/20 transition-colors">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Fast Delivery</span>
               </div>
               <div className="flex items-center gap-3 p-4 rounded-2xl border border-border/60 hover:bg-secondary/20 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Secure Registry</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

