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
    <div className="lg:col-span-5 space-y-3">
      {/* Header: Tên sản phẩm nhỏ gọn hơn */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tighter leading-tight uppercase italic">{product.name}</h1>
        {product.short_description && (
          <p className="text-muted-foreground text-[11px] leading-tight max-w-[90%]">
            {product.short_description}
          </p>
        )}
      </div>

      {/* Price Box: Ép phẳng, ít padding */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black tracking-tighter">
            {new Intl.NumberFormat('vi-VN').format(selectedVariant ? selectedVariant.price : minPrice)}
          </span>
          <span className="text-[9px] font-bold text-muted-foreground">VND</span>
        </div>
        
        {selectedVariant ? (
          <div className={`text-[8px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded border ${selectedVariant.stock > 0 ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-red-500 border-red-100 bg-red-50'}`}>
            {selectedVariant.stock > 0 ? `Stock: ${selectedVariant.stock}` : 'Out'}
          </div>
        ) : (
           <span className="text-[8px] font-bold opacity-50 uppercase tracking-widest">Base Price</span>
        )}
      </div>

      {/* Attributes Selection: Dạng Grid khối phân tách */}
      <div className="space-y-3 p-3 rounded-xl border border-border/40 bg-stone-50/50">
        {attributes.map((attr) => (
          <div key={attr.id} className="space-y-2">
            <div className="flex justify-between items-baseline border-b border-stone-200 pb-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">{attr.name}</span>
              <span className="text-[9px] font-black text-primary uppercase">{selected[attr.name] || "--"}</span>
            </div>
            
            {/* Grid các khối phân tách nhẹ */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
              {attr.values.map((v) => {
                const isActive = selected[attr.name] === v.value;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelected((prev: any) => ({ ...prev, [attr.name]: v.value }))}
                    className={`py-2 text-[10px] font-bold transition-all border outline-none
                      ${isActive 
                        ? "bg-blue-600 text-white border-blue-600 z-10" 
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"}`}
                  >
                    {v.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons & Info */}
      <div className="space-y-2 pt-1">
        <button
          disabled={!selectedVariant || isAdding || (selectedVariant && selectedVariant.stock <= 0)}
          onClick={onAdd}
          className={`w-full py-3 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 
            ${(selectedVariant && selectedVariant.stock > 0) 
              ? "bg-black text-white hover:bg-stone-800" 
              : "bg-stone-200 text-stone-400 cursor-not-allowed"}`}
        >
          {isAdding ? "Processing..." : (selectedVariant?.stock > 0 ? "Add to Bag" : "Unavailable")}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        
        {/* Shipping info: Grid sát nhau */}
        <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-100/50 text-stone-500">
            <Truck className="w-3.5 h-3.5" /> Express
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-100/50 text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5" /> Authentic
          </div>
        </div>
      </div>
    </div>
  );
}
