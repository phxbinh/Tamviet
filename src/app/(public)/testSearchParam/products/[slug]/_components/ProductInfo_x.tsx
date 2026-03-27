"use client";
import { ArrowRight, Truck, ShieldCheck } from "lucide-react";
import { Product, Attribute, Variant } from "../types";
import { useMemo, useEffect } from "react";

interface InfoProps {
  product: Product;
  attributes: Attribute[];
  selected: Record<string, string>;
  setSelected: (val: any) => void;
  selectedVariant: Variant | null;
  variants: Variant[];
  isAdding: boolean;
  onAdd: () => void;
}

export function ProductInfo({ 
  product, 
  attributes, 
  selected, 
  setSelected, 
  selectedVariant, 
  variants, 
  isAdding, 
  onAdd 
}: InfoProps) {

  const minPrice = useMemo(() => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map(v => v.price));
  }, [variants]);

  useEffect(() => {
    if (Object.keys(selected).length === 0 && attributes.length > 0) {
      const initialSelected: Record<string, string> = {};
      attributes.forEach(attr => {
        if (attr.values.length > 0) {
          initialSelected[attr.name] = attr.values[0].value;
        }
      });
      setSelected(initialSelected);
    }
  }, [attributes, setSelected, selected]);

  return (
    <div className="lg:col-span-5 space-y-4 animate-in fade-in transition-colors duration-300">
      {/* Header: Typography tối giản */}
      <div className="space-y-1">
        <h1 className="text-2xl xl:text-3xl font-bold tracking-tighter leading-tight uppercase italic text-foreground">
          {product.name}
        </h1>
        {product.short_description && (
          <p className="text-foreground/60 text-[11px] leading-snug font-medium">
            {product.short_description}
          </p>
        )}
      </div>

      {/* Price Box: Sử dụng --border và --background */}
      <div className="flex items-center justify-between py-3 border-y border-border">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black tracking-tighter text-foreground">
            {new Intl.NumberFormat('vi-VN').format(selectedVariant ? selectedVariant.price : minPrice)}
          </span>
          <span className="text-[9px] font-bold text-foreground/40 uppercase">VND</span>
        </div>
        
        {selectedVariant ? (
          <div className={`text-[8px] font-bold uppercase tracking-tighter px-2 py-0.5 border animate-in fade-in ${
            selectedVariant.stock > 0 
              ? 'text-primary border-primary/20 bg-primary/5' 
              : 'text-red-500 border-red-500/20 bg-red-500/5 animate-shake'
          }`}>
            {selectedVariant.stock > 0 ? `Stock: ${selectedVariant.stock}` : 'Sold Out'}
          </div>
        ) : (
          <span className="text-[8px] font-bold text-foreground/30 uppercase tracking-widest">Starting At</span>
        )}
      </div>

      {/* Attributes: Grid sát viền với biến CSS --border */}
      <div className="space-y-3">
        {attributes.map((attr) => (
          <div key={attr.id} className="space-y-1.5">
            <div className="flex justify-between items-center px-0.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/40">
                {attr.name}
              </span>
              <span className="text-[9px] font-black text-primary uppercase italic tracking-wider">
                {selected[attr.name] || "---"}
              </span>
            </div>
            
            {/* Grid khối sát nhau sử dụng màu border từ CSS variables */}
            <div className="grid grid-cols-4 gap-px bg-border border border-border overflow-hidden rounded-sm shadow-sm">
              {attr.values.map((v) => {
                const isActive = selected[attr.name] === v.value;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelected((prev: any) => ({ ...prev, [attr.name]: v.value }))}
                    className={`py-2 text-[10px] font-bold transition-all outline-none
                      ${isActive 
                        ? "bg-primary text-white" 
                        : "bg-background text-foreground/70 hover:bg-foreground/[0.03]"}`}
                  >
                    {v.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions: Nút bấm & Thông tin vận chuyển */}
      <div className="space-y-2 pt-2">
        <button
          disabled={!selectedVariant || isAdding || (selectedVariant && selectedVariant.stock <= 0)}
          onClick={onAdd}
          className={`w-full py-3.5 rounded-sm font-bold text-[10px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 shadow-sm
            ${(selectedVariant && selectedVariant.stock > 0) 
              ? "bg-primary text-white hover:brightness-110 active:scale-[0.98]" 
              : "bg-foreground/5 text-foreground/30 cursor-not-allowed"}`}
        >
          {isAdding ? (
            <span className="animate-breathe-slow">Processing...</span>
          ) : (
            <>
              {selectedVariant?.stock > 0 ? "Add to Bag" : (selectedVariant ? "Sold Out" : "Select Options")}
              <ArrowRight className="w-3 h-3" />
            </>
          )}
        </button>
        
        {/* Info Grid: Màu sắc đồng bộ với theme */}
        <div className="grid grid-cols-2 gap-2 text-[8px] font-bold uppercase tracking-tight">
          <div className="flex items-center gap-2 p-2 border border-border bg-background text-foreground/50 shadow-sm">
            <Truck className="w-3.5 h-3.5 text-primary" /> Express Delivery
          </div>
          <div className="flex items-center gap-2 p-2 border border-border bg-background text-foreground/50 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified Quality
          </div>
        </div>
      </div>
    </div>
  );
}
