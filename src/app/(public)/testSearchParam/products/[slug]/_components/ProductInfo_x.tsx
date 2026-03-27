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
  variants: Variant[]; // Thêm variants vào props để tính toán
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

  // 1. Tìm giá thấp nhất khi chưa chọn variant nào (GIỮ NGUYÊN)
  const minPrice = useMemo(() => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map(v => v.price));
  }, [variants]);

  // 2. Logic: Tự động chọn thuộc tính đầu tiên nếu chưa chọn gì (GIỮ NGUYÊN)
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
    <div className="lg:col-span-5 space-y-2 animate-in fade-in transition-colors duration-300">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-2xl xl:text-3xl font-bold tracking-tighter leading-tight uppercase italic text-foreground">
          {product.name}
        </h1>
        {product.short_description && (
          <p className="text-foreground/60 text-[10px] leading-snug font-medium">
            {product.short_description}
          </p>
        )}
      </div>

      {/* Price Box: Sát viền, dùng biến --border từ globals.css */}
      <div className="flex items-center justify-between py-1 border-y border-border">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black tracking-tighter text-foreground">
            {/* Hiển thị giá Variant được chọn, nếu chưa chọn thì hiện giá thấp nhất */}
            {new Intl.NumberFormat('vi-VN').format(selectedVariant ? selectedVariant.price : minPrice)}
          </span>
          <span className="text-[11px] font-bold text-foreground/40 uppercase">VND</span>
        </div>
        
        {selectedVariant ? (
          <div className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 border transition-all ${
            selectedVariant.stock > 0 
              ? 'text-primary border-primary/20 bg-primary/5' 
              : 'text-red-500 border-red-500/20 bg-red-500/5 animate-shake'
          }`}>
            {selectedVariant.stock > 0 ? `Kho: ${selectedVariant.stock}` : 'Hết'}
          </div>
        ) : (
          <span className="text-[8px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-sm">
            Starting Price
          </span>
        )}
      </div>

      {/* Attributes Selection: Dạng Grid khối sát nhau */}
      <div className="space-y-3">
        {attributes.map((attr) => (
          <div key={attr.id} className="space-y-1.5">
            <div className="flex justify-between items-center px-0.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                {attr.name}
              </span>
              {selected[attr.name] && (
                <span className="text-[9px] font-black text-primary uppercase italic tracking-wider animate-in fade-in">
                  {selected[attr.name]}
                </span>
              )}
            </div>

            {/* Grid khối phân tách bằng gap-px, màu nền lấy từ --border */}
            <div className="grid grid-cols-4 gap-px bg-border border border-border overflow-hidden rounded-sm shadow-sm">
              {attr.values.map((v) => {
                const isActive = selected[attr.name] === v.value;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelected((prev: any) => ({ ...prev, [attr.name]: v.value }))}
                    className={`py-1 text-[10px] font-bold transition-all outline-none
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

      {/* Action Buttons & Badges */}
      <div className="space-y-2 pt-1">
        <button
          disabled={!selectedVariant || isAdding || (selectedVariant && selectedVariant.stock <= 0)}
          onClick={onAdd}
          className={`w-full py-3.5 rounded-sm font-bold text-[10px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 shadow-sm
            ${(selectedVariant && selectedVariant.stock > 0) 
              ? "bg-primary text-white hover:brightness-110 active:scale-[0.98]" 
              : "bg-foreground/5 text-foreground/30 cursor-not-allowed"}`}
        >
          {isAdding ? (
            <span className="animate-breathe-slow">Adding to Bag...</span>
          ) : (
            <>
              {selectedVariant 
                ? (selectedVariant.stock > 0 ? "Add to Shopping Bag" : "Out of Stock") 
                : "Select Options"} 
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
        
        {/* Shipping info: Tối giản, dùng font nhỏ nhất */}
        <div className="grid grid-cols-2 gap-2 text-[8px] font-bold uppercase tracking-tight">
          <div className="flex items-center gap-2 p-2 border border-border bg-background text-foreground/50 shadow-sm transition-colors hover:border-primary/30">
            <Truck className="w-3.5 h-3.5 text-primary" /> Express Shipping
          </div>
          <div className="flex items-center gap-2 p-2 border border-border bg-background text-foreground/50 shadow-sm transition-colors hover:border-primary/30">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified Quality
          </div>
        </div>
      </div>
    </div>
  );
}
