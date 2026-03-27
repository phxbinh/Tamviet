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
    <div className="lg:col-span-5 space-y-4">
      {/* Title & Description: Nhỏ gọn hơn */}
      <div className="space-y-1">
        <h1 className="text-2xl xl:text-3xl font-bold tracking-tighter leading-none uppercase italic">
          {product.name}
        </h1>
        {product.short_description && (
          <p className="text-muted-foreground text-[11px] leading-snug max-w-[90%]">
            {product.short_description}
          </p>
        )}
      </div>

      {/* Price Section: Giảm padding, thu nhỏ font */}
      <div className="flex items-center justify-between py-3 border-y border-stone-100">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black tracking-tighter">
            {new Intl.NumberFormat('vi-VN').format(selectedVariant ? selectedVariant.price : minPrice)}
          </span>
          <span className="text-[9px] font-bold text-stone-400">VND</span>
        </div>
        
        {selectedVariant ? (
          <div className={`text-[8px] font-bold uppercase tracking-tighter px-2 py-0.5 border ${
            selectedVariant.stock > 0 
              ? 'text-blue-600 border-blue-100 bg-blue-50/50' 
              : 'text-red-500 border-red-100 bg-red-50/50'
          }`}>
            {selectedVariant.stock > 0 ? `In Stock: ${selectedVariant.stock}` : 'Sold Out'}
          </div>
        ) : (
          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Base Price</span>
        )}
      </div>

      {/* Attributes: Dạng Grid khối phân tách nhẹ */}
      <div className="space-y-4">
        {attributes.map((attr) => (
          <div key={attr.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-stone-400">
                {attr.name}
              </span>
              <span className="text-[10px] font-bold text-blue-600 uppercase italic">
                {selected[attr.name] || "---"}
              </span>
            </div>
            
            {/* Grid các ô chọn sát nhau */}
            <div className="grid grid-cols-4 gap-px bg-stone-200 border border-stone-200 overflow-hidden rounded-sm">
              {attr.values.map((v) => {
                const isActive = selected[attr.name] === v.value;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelected((prev: any) => ({ ...prev, [attr.name]: v.value }))}
                    className={`py-2 text-[10px] font-bold transition-all outline-none
                      ${isActive 
                        ? "bg-blue-600 text-white" 
                        : "bg-white text-stone-600 hover:bg-stone-50"}`}
                  >
                    {v.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions & Shipping */}
      <div className="space-y-2 pt-2">
        <button
          disabled={!selectedVariant || isAdding || (selectedVariant && selectedVariant.stock <= 0)}
          onClick={onAdd}
          className={`w-full py-3.5 rounded-sm font-bold text-[10px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 
            ${(selectedVariant && selectedVariant.stock > 0) 
              ? "bg-black text-white hover:bg-stone-800 active:scale-[0.98]" 
              : "bg-stone-100 text-stone-400 cursor-not-allowed"}`}
        >
          {isAdding ? "Processing..." : (selectedVariant?.stock > 0 ? "Add to Bag" : "Unavailable")}
          <ArrowRight className="w-3 h-3" />
        </button>
        
        {/* Shipping info: Grid thu nhỏ */}
        <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase tracking-tighter">
          <div className="flex items-center gap-2 p-2 bg-stone-50 text-stone-500 border border-stone-100">
            <Truck className="w-3.5 h-3.5" /> Express Shipping
          </div>
          <div className="flex items-center gap-2 p-2 bg-stone-50 text-stone-500 border border-stone-100">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Quality
          </div>
        </div>
      </div>
    </div>
  );
}
