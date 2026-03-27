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

  // 1. Tìm giá thấp nhất khi chưa chọn variant nào (GIỮ NGUYÊN LOGIC)
  const minPrice = useMemo(() => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map(v => v.price));
  }, [variants]);

  // 2. Logic: Tự động chọn thuộc tính đầu tiên nếu chưa chọn gì (GIỮ NGUYÊN LOGIC)
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
      {/* Header: Chữ nhỏ lại, sát nhau hơn */}
      <div className="space-y-1">
        <h1 className="text-2xl xl:text-3xl font-bold tracking-tighter leading-tight uppercase italic">
          {product.name}
        </h1>
        {product.short_description && (
          <p className="text-muted-foreground text-[11px] leading-snug">
            {product.short_description}
          </p>
        )}
      </div>

      {/* Price Box: Giảm padding (p-3), bỏ rounded lớn, dùng border mảnh */}
      <div className="flex items-center justify-between p-3 border border-stone-100 bg-stone-50/50">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black tracking-tighter">
            {/* Hiển thị giá Variant được chọn, nếu chưa chọn thì hiện giá thấp nhất */}
            {new Intl.NumberFormat('vi-VN').format(selectedVariant ? selectedVariant.price : minPrice)}
          </span>
          <span className="text-[9px] font-bold text-stone-400 uppercase">VND</span>
        </div>
        
        {selectedVariant ? (
          <p className={`text-[8px] font-bold uppercase tracking-tighter px-2 py-0.5 border ${
            selectedVariant.stock > 0 
              ? 'text-blue-600 border-blue-100 bg-blue-50/30' 
              : 'text-red-500 border-red-100 bg-red-50/30'
          }`}>
            {selectedVariant.stock > 0 ? `Stock: ${selectedVariant.stock}` : 'Sold Out'}
          </p>
        ) : (
          <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5">
            From Price
          </span>
        )}
      </div>

      {/* Attributes Selection: Dạng Grid khối sát nhau */}
      <div className="space-y-3">
        {attributes.map((attr) => (
          <div key={attr.id} className="space-y-1.5">
            <div className="flex justify-between items-center px-0.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">
                {attr.name}
              </span>
              {selected[attr.name] && (
                <span className="text-[9px] font-black text-blue-600 uppercase italic">
                  {selected[attr.name]}
                </span>
              )}
            </div>

            {/* Grid phân tách nhẹ bằng gap-px và background */}
            <div className="grid grid-cols-4 gap-px bg-stone-200 border border-stone-200 overflow-hidden">
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

      {/* Actions: Giảm padding, thu nhỏ button */}
      <div className="space-y-2 pt-2">
        <button
          disabled={!selectedVariant || isAdding || (selectedVariant && selectedVariant.stock <= 0)}
          onClick={onAdd}
          className={`w-full py-3.5 rounded-sm font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 
            ${(selectedVariant && selectedVariant.stock > 0) 
              ? "bg-black text-white hover:bg-stone-800 active:scale-[0.98]" 
              : "bg-stone-100 text-stone-400 cursor-not-allowed"}`}
        >
          {isAdding ? "Processing..." : (
            <>
              {selectedVariant 
                ? (selectedVariant.stock > 0 ? "Add to Bag" : "Sold Out") 
                : "Select Options"} 
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
        
        {/* Info Grid: Thu gọn kích thước */}
        <div className="grid grid-cols-2 gap-2 text-[8px] font-bold uppercase tracking-tight">
          <div className="flex items-center gap-2 p-2 border border-stone-100 bg-stone-50/50 text-stone-500">
            <Truck className="w-3.5 h-3.5 text-blue-600" /> Express Delivery
          </div>
          <div className="flex items-center gap-2 p-2 border border-stone-100 bg-stone-50/50 text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Verified Quality
          </div>
        </div>
      </div>
    </div>
  );
}
