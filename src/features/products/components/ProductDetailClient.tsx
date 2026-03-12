"use client";

import { useState, useMemo } from "react";
import { 
  ShoppingBag, 
  Check, 
  Zap, 
  ShieldCheck, 
  Truck, 
  ArrowRight,
  Heart,
  Share2,
  AlertCircle,
  Box,
  Star
} from "lucide-react";




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

  const allSelected = Object.keys(selected).length === attributes.length;

  return (
    <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 py-12 px-6 animate-fade-in custom-scrollbar items-start">
      
      {/* LEFT: VISUAL (Fixed Aspect Ratio 4/5) */}
      <div className="lg:col-span-7 w-full">
        <div className="sticky top-12 space-y-6">
          <div className="relative aspect-[4/5] bg-card rounded-[2rem] overflow-hidden border border-border shadow-sm group">
             {/* Badge cố định góc - Không ảnh hưởng layout */}
            <div className="absolute top-6 left-6 z-10">
              <span className="bg-background/80 backdrop-blur-md text-foreground px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-border flex items-center gap-2">
                <Zap className="w-3 h-3 text-primary animate-pulse" /> Limited Edition
              </span>
            </div>

            {mainImage ? (
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-border"><ShoppingBag className="w-24 h-24 stroke-[0.5]" /></div>
            )}
            
            {/* Buttons tuyệt đối - Không gây nhảy UI */}
            <div className="absolute right-6 top-6 space-y-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              <button className="p-4 bg-background border border-border rounded-full hover:bg-primary hover:text-white transition-all shadow-xl"><Heart className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: CONFIGURATION (Fixed Structure) */}
      <div className="lg:col-span-5 flex flex-col h-full space-y-10">
        
        {/* 1. Identity & Fixed Price Area */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
            <Star className="w-3 h-3 fill-current" /> Authentic Registry
          </div>
          <h1 className="text-4xl xl:text-5xl font-black tracking-tighter uppercase italic text-foreground leading-tight min-h-[2.5em] flex items-center">
            {product.name}
          </h1>
          
          {/* Vùng giá cố định chiều cao để tránh nhảy UI khi chọn variant */}
          <div className="h-16 flex items-center border-t border-border mt-4">
            {selectedVariant ? (
              <div className="flex items-baseline gap-2 animate-fade-in">
                <span className="text-4xl font-black tracking-tighter text-foreground">
                  {new Intl.NumberFormat('vi-VN').format(selectedVariant.price)}
                </span>
                <span className="text-xs font-bold opacity-40 uppercase italic tracking-widest text-foreground">VND</span>
              </div>
            ) : (
              <p className="text-sm font-medium italic text-muted-foreground opacity-40">Lựa chọn thông số để hiển thị giá...</p>
            )}
          </div>
        </div>

        {/* 2. Attributes (Flex-wrap with consistent gap) */}
        <div className="space-y-8 ">
{attributes.map((attr) => (
  <div key={attr.id} className="space-y-3">
    <div className="flex justify-between items-center h-5">
      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">
        {attr.name}
      </span>
      {selected[attr.name] && (
        <span className="text-[10px] font-black text-primary uppercase italic tracking-widest animate-fade-in">
          <Check className="inline w-3 h-3 mr-1" /> {selected[attr.name]}
        </span>
      )}
    </div>

    <div className="flex gap-2 flex-wrap">
      {attr.values.map((v) => {
        const active = selected[attr.name] === v.value;
        return (
          <button
            key={v.id}
            type="button" // Luôn thêm type="button" để tránh submit form ngoài ý muốn
            onClick={() => setSelected(prev => ({ ...prev, [attr.name]: v.value }))}
            className={`
              min-w-[70px] px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl border
              ${active 
                ? "bg-foreground text-background border-foreground shadow-lg -translate-y-1" 
                : "bg-card border-border text-foreground/60 hover:border-primary"
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

        {/* 3. Conversion Hub (Fixed Heights for Status) */}
        <div className="space-y-3 pt-8 border-t border-border mt-auto">
          {/* Inventory Status - Chiều cao cố định 64px */}
          <div className="h-12">
            {selectedVariant ? (
              <div className="flex items-center justify-between px-6 py-1 bg-card rounded-xl border border-border animate-fade-in">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase opacity-40 tracking-widest">Serial Code</span>
                  <span className="text-[10px] font-mono font-bold">{selectedVariant.sku}</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black uppercase opacity-40 tracking-widest">Availability</span>
                  <p className={`text-[10px] font-black ${selectedVariant.stock < 10 ? 'text-red-500 animate-breathe-danger' : 'text-primary'}`}>
                    {selectedVariant.stock < 10 ? `ONLY ${selectedVariant.stock} LEFT` : `RESERVES: ${selectedVariant.stock}`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full border border-dashed border-border rounded-xl flex items-center justify-center">
                 <span className="text-[9px] font-black uppercase opacity-20 tracking-widest italic">Waiting for Configuration...</span>
              </div>
            )}
          </div>

          {/* Button CTA */}
          <div className="space-y-3 h-12">
            <button
              disabled={!selectedVariant || isAdding}
              onClick={() => { setIsAdding(true); setTimeout(() => setIsAdding(false), 2000); }}
              className={`
                w-full py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-500
                ${selectedVariant 
                  ? "bg-primary text-white hover:shadow-xl active:scale-95" 
                  : "bg-border text-foreground/10 cursor-not-allowed"
                }
              `}
            >
              {isAdding ? "PROCESSING DNA..." : "SECURE SELECTION"}
            </button>
            
            {/* Warning text với h-4 cố định */}
            <div className="h-4 mt-1 flex justify-center">
              {!allSelected && (
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary animate-breathe-slow italic">
                  Vui lòng hoàn tất cấu hình để mở khóa
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 4. Footer Trust (Fixed Grid) */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          {[
            { icon: Truck, title: "Swift Logistic" },
            { icon: ShieldCheck, title: "Pure Registry" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-2 p-5 rounded-2xl bg-card border border-border group hover:border-primary transition-all">
               <item.icon className="w-4 h-4 text-primary" />
               <p className="text-[9px] font-black uppercase tracking-widest text-foreground">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}







// --- INTERFACES (Giữ nguyên cấu trúc DNA dữ liệu) ---
/*
interface AttributeValue { id: string; value: string; }
interface Attribute { id: string; name: string; values: AttributeValue[]; }
interface Variant { id: string; sku: string; price: number; stock: number; attributes: Record<string, string>; }
interface ProductImage { id: string; url: string; is_thumbnail: boolean; }
interface Product { id: string; name: string; description?: string; }
interface ProductFull { product: Product; attributes: Attribute[]; variants: Variant[]; images: ProductImage[]; }
*/

//export default
function ProductDetailClient__({ data }: { data: ProductFull }) {
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

  const selectAttribute = (attrName: string, value: string) => {
    setSelected((prev) => ({ ...prev, [attrName]: value }));
  };

  const allSelected = Object.keys(selected).length === attributes.length;

  return (
    <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 py-12 px-6 animate-fade-in custom-scrollbar">
      
      {/* LEFT: VISUAL MASTERPIECE */}
      <div className="lg:col-span-7">
        <div className="sticky top-12 space-y-6">
          <div className="aspect-[4/5] bg-card rounded-[2.5rem] overflow-hidden relative group border border-border shadow-sm">
            <div className="absolute top-8 left-8 z-10">
              <span className="bg-background/80 backdrop-blur-md text-foreground px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-border shadow-sm flex items-center gap-2">
                <Zap className="w-3 h-3 text-primary animate-pulse" /> Premium Edition
              </span>
            </div>

            {mainImage ? (
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-border">
                <ShoppingBag className="w-32 h-32 stroke-[0.5]" />
              </div>
            )}

            <div className="absolute right-8 top-8 space-y-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
              <button className="p-4 bg-background text-foreground border border-border rounded-full shadow-2xl hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-4 bg-background text-foreground border border-border rounded-full shadow-2xl hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: CONFIGURATION & CONVERSION */}
      <div className="lg:col-span-5 space-y-10">
        
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
            <Star className="w-3 h-3 fill-current" /> Authentic Registry
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-foreground leading-[0.95]">
            {product.name}
          </h1>
          
          <div className="flex items-baseline gap-4 pt-4 border-t border-border">
            {selectedVariant ? (
              <div className="animate-fade-in">
                <span className="text-4xl font-black tracking-tighter text-foreground">
                  {new Intl.NumberFormat('vi-VN').format(selectedVariant.price)}
                </span>
                <span className="ml-2 text-sm font-bold opacity-40 italic tracking-widest text-foreground uppercase">VND</span>
              </div>
            ) : (
              <p className="text-lg font-medium italic text-muted-foreground opacity-60">
                Lựa chọn cấu hình để nhận báo giá...
              </p>
            )}
          </div>
        </div>

        {/* ATTRIBUTE SELECTORS */}
        <div className="space-y-8">
          {attributes.map((attr) => (
            <div key={attr.id} className="space-y-4">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/40">
                {attr.name}
              </span>

              <div className="flex gap-3 flex-wrap">
                {attr.values.map((v) => {
                  const active = selected[attr.name] === v.value;
                  return (
                    <button
                      key={v.id}
                      onClick={() => selectAttribute(attr.name, v.value)}
                      className={`
                        min-w-[70px] px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all duration-300 rounded-2xl border
                        ${active 
                          ? "bg-foreground text-background border-foreground shadow-xl -translate-y-1" 
                          : "bg-card border-border text-foreground/60 hover:border-primary hover:text-primary"
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

        {/* ACTION HUB */}
        <div className="space-y-6 pt-8 border-t border-border">
          {selectedVariant && (
            <div className="flex items-center justify-between px-6 py-4 bg-card rounded-2xl border border-border animate-fade-in">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Serial / SKU</span>
                <span className="text-xs font-mono font-bold text-foreground">{selectedVariant.sku}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Reserves</span>
                <p className={`text-xs font-bold ${selectedVariant.stock < 10 ? 'text-red-500 animate-breathe-danger' : 'text-primary'}`}>
                  {selectedVariant.stock < 10 ? `Critical: ${selectedVariant.stock}` : `Stock: ${selectedVariant.stock}`}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              disabled={!selectedVariant || isAdding}
              onClick={() => {
                setIsAdding(true);
                setTimeout(() => setIsAdding(false), 2000);
              }}
              className={`
                group relative w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-500
                ${selectedVariant 
                  ? "bg-primary text-white hover:shadow-[0_20px_40px_rgba(var(--primary),0.3)] active:scale-95" 
                  : "bg-border text-foreground/20 cursor-not-allowed"
                }
              `}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isAdding ? "Processing..." : "Secure Selection"}
                <ArrowRight className={`w-4 h-4 transition-transform duration-500 ${selectedVariant && 'group-hover:translate-x-2'}`} />
              </div>
            </button>
            
            {!allSelected && (
              <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-primary animate-breathe-slow italic">
                Chưa hoàn tất cấu hình DNA sản phẩm
              </p>
            )}
          </div>
        </div>

        {/* TRUST SIGNALS */}
        <div className="grid grid-cols-2 gap-4 pt-6">
          {[
            { icon: Truck, title: "Swift Logistic", desc: "Express Delivery" },
            { icon: ShieldCheck, title: "Global Warranty", desc: "Authentic Only" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-3 p-6 rounded-[2rem] bg-card border border-border group hover:border-primary transition-all duration-500">
               <item.icon className="w-5 h-5 text-primary" />
               <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-foreground">{item.title}</p>
                 <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">{item.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}









//export default
function ProductDetailClient_({ data }: { data: ProductFull }) {
  const { product, attributes, variants, images } = data;

  // 1. State quản lý cấu hình đã chọn
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);

  // 2. Logic tìm kiếm Variant dựa trên cấu hình hiện tại
  const selectedVariant = useMemo(() => {
    if (Object.keys(selected).length < attributes.length) return null;
    
    return variants.find((variant) =>
      Object.entries(selected).every(
        ([key, value]) => variant.attributes[key] === value
      )
    );
  }, [selected, variants, attributes.length]);

  // 3. Xử lý ảnh (Ưu tiên ảnh thumbnail hoặc ảnh đầu tiên)
  const mainImage = useMemo(() => {
    return images.find(img => img.is_thumbnail)?.url || images[0]?.url;
  }, [images]);

  const selectAttribute = (attrName: string, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [attrName]: value,
    }));
  };

  const allSelected = Object.keys(selected).length === attributes.length;

  return (
    <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 py-12 px-6 animate-fade-in">
      
      {/* LEFT: VISUAL MASTERPIECE */}
      <div className="lg:col-span-7 space-y-6">
        <div className="sticky top-12">
          <div className="aspect-[4/5] bg-[#F3F3F3] rounded-[2.5rem] overflow-hidden relative group shadow-inner">
            {/* Badges */}
            <div className="absolute top-8 left-8 z-10 flex flex-col gap-2">
              <span className="bg-white/90 backdrop-blur-lg px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-2 w-fit">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> 
                Premium Edition
              </span>
            </div>

            {/* Main Image */}
            {mainImage ? (
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-10">
                <ShoppingBag className="w-32 h-32 stroke-[0.5]" />
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute right-8 top-8 space-y-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
              <button className="p-4 bg-white rounded-full shadow-2xl hover:bg-black hover:text-white transition-all transform hover:scale-110">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-4 bg-white rounded-full shadow-2xl hover:bg-black hover:text-white transition-all transform hover:scale-110">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Thumbnails (nếu có nhiều ảnh) */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            {images.slice(0, 5).map((img, idx) => (
              <div key={img.id} className="aspect-square bg-muted rounded-2xl overflow-hidden border border-border/50 hover:border-primary transition-colors cursor-pointer opacity-60 hover:opacity-100">
                <img src={img.url} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: CONFIGURATION & CONVERSION */}
      <div className="lg:col-span-5 space-y-12">
        
        {/* Identity & Pricing */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
            <Star className="w-3 h-3 fill-current" /> Top Rated Registry
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-foreground leading-[0.95]">
            {product.name}
          </h1>
          
          <div className="flex items-baseline gap-4 pt-4 border-t border-border/50">
            {selectedVariant ? (
              <div className="animate-slide-up">
                <span className="text-4xl font-black tracking-tighter text-black">
                  {new Intl.NumberFormat('vi-VN').format(selectedVariant.price)}
                </span>
                <span className="ml-2 text-sm font-bold uppercase opacity-40 italic tracking-widest">VND</span>
              </div>
            ) : (
              <p className="text-lg font-medium italic text-muted-foreground animate-pulse">
                Hãy hoàn tất lựa chọn để hiển thị giá...
              </p>
            )}
          </div>
        </div>

        {/* Attribute Selectors */}
        <div className="space-y-10">
          {attributes.map((attr) => (
            <div key={attr.id} className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                  {attr.name}
                </span>
                {selected[attr.name] && (
                  <span className="text-[10px] font-black text-primary uppercase italic tracking-widest">
                    Selected: {selected[attr.name]}
                  </span>
                )}
              </div>

              <div className="flex gap-3 flex-wrap">
                {attr.values.map((v) => {
                  const active = selected[attr.name] === v.value;
                  return (
                    <button
                      key={v.id}
                      onClick={() => selectAttribute(attr.name, v.value)}
                      className={`
                        min-w-[70px] px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all duration-500 rounded-2xl border
                        ${active 
                          ? "bg-black text-white border-black shadow-[0_15px_30px_rgba(0,0,0,0.2)] -translate-y-1" 
                          : "bg-white border-border text-muted-foreground hover:border-black hover:text-black hover:bg-muted/30"
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

        {/* Action Hub */}
        <div className="space-y-6 pt-8">
          {selectedVariant && (
            <div className="flex items-center justify-between px-6 py-4 bg-muted/30 rounded-2xl border border-border/50 animate-fade-in">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Identity Code</span>
                <span className="text-xs font-mono font-bold tracking-tighter">{selectedVariant.sku}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Inventory</span>
                <p className={`text-xs font-bold ${selectedVariant.stock < 10 ? 'text-red-500 animate-pulse' : 'text-green-600'}`}>
                  {selectedVariant.stock < 10 ? `Only ${selectedVariant.stock} left` : `Available: ${selectedVariant.stock}`}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              disabled={!selectedVariant || isAdding}
              onClick={() => {
                setIsAdding(true);
                setTimeout(() => setIsAdding(false), 2000);
              }}
              className={`
                group relative w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-500 overflow-hidden
                ${selectedVariant 
                  ? "bg-black text-white hover:bg-primary shadow-2xl active:scale-95" 
                  : "bg-muted text-muted-foreground/40 cursor-not-allowed border border-border"
                }
              `}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isAdding ? "Synchronizing Order..." : "Add to Private Collection"}
                <ArrowRight className={`w-4 h-4 transition-transform duration-500 ${selectedVariant && 'group-hover:translate-x-2'}`} />
              </div>
              {selectedVariant && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </button>
            
            {!allSelected && (
              <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] opacity-40 animate-pulse italic">
                Cấu hình đầy đủ thông số để mở khóa giao dịch
              </p>
            )}
          </div>
        </div>

        {/* Benefits Registry */}
        <div className="grid grid-cols-2 gap-4 pt-10">
          {[
            { icon: Truck, title: "Global Logistic", desc: "48h Door-to-door" },
            { icon: ShieldCheck, title: "Registry Verified", desc: "100% Authentic DNA" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-3 p-6 rounded-[2rem] bg-muted/20 border border-border/50 group hover:bg-white hover:shadow-xl transition-all duration-500">
               <item.icon className="w-5 h-5 text-primary" />
               <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest">{item.title}</p>
                 <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-tighter">{item.desc}</p>
               </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
