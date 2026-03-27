"use client";
import { ArrowRight, Truck, ShieldCheck } from "lucide-react";
import { Product, Attribute, Variant } from "../types";
import { useMemo, useEffect } from "react";

interface InfoProps_ {
  product: Product;
  attributes: Attribute[];
  selected: Record<string, string>;
  setSelected: (val: any) => void;
  selectedVariant: Variant | null;
  isAdding: boolean;
  onAdd: () => void;
}

/*
"use client";
import { ArrowRight, Truck, ShieldCheck } from "lucide-react";
import { Product, Attribute, Variant } from "../types";
import { useMemo, useEffect } from "react";
*/

interface InfoProps {
  product: Product;
  attributes: Attribute[];
  selected: Record<string, string>;
  setSelected: (val: any) => void;
  selectedVariant: Variant | null;
  variants: Variant[]; // Thêm variants vào props để tính toán
  isAdding: boolean;
  onAdd: () => void;
}





export function ProductInfo_({ product, attributes, selected, setSelected, selectedVariant, isAdding, onAdd }: InfoProps_) {
  return (
    <div className="lg:col-span-5 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl xl:text-5xl font-medium tracking-tight leading-[1.1]">{product.name}</h1>
        {product.short_description && <p className="text-muted-foreground text-lg leading-relaxed">{product.short_description}</p>}
      </div>

      {/* Price Box */}
      <div className="min-h-[100px] flex flex-col justify-center p-6 rounded-[2rem] bg-secondary/40 border border-border/50">
        {selectedVariant ? (
          <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold tracking-tighter">{new Intl.NumberFormat('vi-VN').format(selectedVariant.price)}</span>
              <span className="text-sm font-bold text-muted-foreground uppercase">VND</span>
            </div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {selectedVariant.stock > 0 ? `In Stock (${selectedVariant.stock})` : 'Sold Out'}
            </p>
          </div>
        ) : <p className="text-muted-foreground/60 italic font-light">Please select your preferences</p>}
      </div>

      {/* Attributes */}
      <div className="grid gap-6 p-6 rounded-[2rem] bg-secondary/20 border border-border/40">
        {attributes.map((attr) => (
          <div key={attr.id} className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">{attr.name}</span>
              {selected[attr.name] && <span className="text-[11px] font-bold text-primary uppercase">{selected[attr.name]}</span>}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {attr.values.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelected((prev: any) => ({ ...prev, [attr.name]: v.value }))}
                  className={`px-5 py-2.5 text-xs font-bold transition-all rounded-full border-2 ${selected[attr.name] === v.value ? "bg-foreground text-background border-foreground shadow-lg scale-105" : "bg-white/50 border-transparent text-foreground/70"}`}
                >
                  {v.value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <button
          disabled={!selectedVariant || isAdding}
          onClick={onAdd}
          className={`w-full py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${selectedVariant ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:-translate-y-1" : "bg-secondary text-muted-foreground/50"}`}
        >
          {isAdding ? "Adding to Bag..." : <>{selectedVariant ? "Add to Shopping Bag" : "Select Options"} <ArrowRight className="w-5 h-5" /></>}
        </button>
        <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-tight">
          <div className="flex items-center gap-4 p-5 rounded-3xl border border-border/50 bg-white/40"><Truck className="w-5 h-5 text-primary" /> Express Shipping</div>
          <div className="flex items-center gap-4 p-5 rounded-3xl border border-border/50 bg-white/40"><ShieldCheck className="w-5 h-5 text-primary" /> Verified Quality</div>
        </div>
      </div>
    </div>
  );
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

  // 1. Tìm giá thấp nhất khi chưa chọn variant nào
  const minPrice = useMemo(() => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map(v => v.price));
  }, [variants]);

  // 2. Logic: Tự động chọn thuộc tính đầu tiên nếu chưa chọn gì (Active nút)
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
    <div className="lg:col-span-5 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl xl:text-5xl font-medium tracking-tight leading-[1.1]">{product.name}</h1>
        {product.short_description && <p className="text-muted-foreground text-lg leading-relaxed">{product.short_description}</p>}
      </div>

      {/* Price Box */}
      <div className="min-h-[100px] flex flex-col justify-center p-6 rounded-[2rem] bg-secondary/40 border border-border/50 transition-all duration-500">
        <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tighter">
              {/* Hiển thị giá Variant được chọn, nếu chưa chọn thì hiện giá thấp nhất */}
              {new Intl.NumberFormat('vi-VN').format(selectedVariant ? selectedVariant.price : minPrice)}
            </span>
            <span className="text-sm font-bold text-muted-foreground uppercase">VND</span>
          </div>
          
          {selectedVariant ? (
            <p className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${selectedVariant.stock > 0 ? 'text-green-600 border-green-200 bg-green-50' : 'text-red-500 border-red-200 bg-red-50'}`}>
              {selectedVariant.stock > 0 ? `In Stock (${selectedVariant.stock})` : 'Sold Out'}
            </p>
          ) : (
             <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
               Starting Price
             </span>
          )}
        </div>
      </div>

      {/* Attributes Selection */}
      <div className="grid gap-6 p-6 rounded-[2rem] bg-secondary/20 border border-border/40">
        {attributes.map((attr) => (
          <div key={attr.id} className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">{attr.name}</span>
              {selected[attr.name] && <span className="text-[11px] font-bold text-primary uppercase">{selected[attr.name]}</span>}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {attr.values.map((v) => {
                const isActive = selected[attr.name] === v.value;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelected((prev: any) => ({ ...prev, [attr.name]: v.value }))}
                    className={`px-5 py-2.5 text-xs font-bold transition-all duration-300 rounded-full border-2 
                      ${isActive 
                        ? "bg-foreground text-background border-foreground shadow-lg scale-105" 
                        : "bg-white/50 border-white/80 text-foreground/70 hover:border-primary/30"}`}
                  >
                    {v.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <button
          disabled={!selectedVariant || isAdding || (selectedVariant && selectedVariant.stock <= 0)}
          onClick={onAdd}
          className={`w-full py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 
            ${(selectedVariant && selectedVariant.stock > 0) 
              ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95" 
              : "bg-secondary text-muted-foreground/50 cursor-not-allowed"}`}
        >
          {isAdding ? "Adding to Bag..." : (
            <>
              {selectedVariant 
                ? (selectedVariant.stock > 0 ? "Add to Shopping Bag" : "Out of Stock") 
                : "Select Options"} 
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        
        <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-tight">
          <div className="flex items-center gap-4 p-5 rounded-3xl border border-border/50 bg-white/40"><Truck className="w-5 h-5 text-primary" /> Express Shipping</div>
          <div className="flex items-center gap-4 p-5 rounded-3xl border border-border/50 bg-white/40"><ShieldCheck className="w-5 h-5 text-primary" /> Verified Quality</div>
        </div>
      </div>
    </div>
  );
}






