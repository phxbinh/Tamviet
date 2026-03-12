// src/app/(app)/products/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  thumbnail_url?: string;
  price_min?: number;
}

async function getProducts(): Promise<Product[]> {
  const host = (await headers()).get("host");

  const res = await fetch(`http://${host}/api/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}


export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-16 space-y-10 md:space-y-16 animate-fade-in">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col items-center text-center space-y-3">
        <div className="flex items-center gap-2 text-primary tracking-[0.3em] text-[9px] md:text-[10px] font-black uppercase italic">
          <Sparkles className="w-3 h-3" />
          The Registry
        </div>
        <h1 className="text-3xl md:text-5xl font-light tracking-tighter text-foreground leading-none">
          The <span className="font-black italic">Signature</span> Series
        </h1>
        <div className="h-0.5 w-12 bg-primary/30 rounded-full" />
      </header>

      {/* PRODUCT GRID: 2 cột trên mobile, 3-4 cột trên desktop */}
      <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
        {products.map((p) => (
          <ProductCard 
            key={p.id}
            id={p.id}
            name={p.name}
            thumbnail_url={p.thumbnail_url}
            price_min={p.price_min}
          />
        ))}
      </main>

      {/* MINIMAL FOOTER INFO */}
      <footer className="pt-16 border-t border-border/50 flex flex-col items-center gap-6 opacity-40 grayscale">
        <div className="flex gap-6 md:gap-12">
            {["Pure Quality", "Direct Delivery", "Global Warranty"].map((text) => (
              <div key={text} className="flex flex-col items-center gap-2">
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">{text}</span>
                <div className="w-1 h-1 rounded-full bg-foreground" />
              </div>
            ))}
        </div>
      </footer>
    </div>
  );
}


//export default
async function ProductsPage__() {
  const products = await getProducts();

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-16 space-y-12 animate-fade-in">
      
      {/* ELEGANT HEADER */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex items-center gap-2 text-primary tracking-[0.4em] text-[10px] font-black uppercase italic">
          <Sparkles className="w-3 h-3" />
          Curated Collection
        </div>
        <h1 className="text-4xl md:text-5xl font-light tracking-tighter text-foreground">
          The <span className="font-black italic">Signature</span> Series
        </h1>
        <div className="h-1 w-20 bg-primary/20 rounded-full" />
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="group block relative"
          >
            {/* IMAGE CONTAINER */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F8F8] rounded-2xl transition-all duration-700 ease-out group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
              {p.thumbnail_url ? (
                <img
                  src={p.thumbnail_url}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                  <ShoppingBag className="w-12 h-12 stroke-[1]" />
                </div>
              )}

              {/* OVERLAY BUTTON (DESKTOP) */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                 <span className="bg-white text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 whitespace-nowrap rounded-full">
                   View Details <ArrowRight className="w-3 h-3" />
                 </span>
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div className="mt-6 space-y-2 text-center px-2">
              <h3 className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
                {p.name}
              </h3>
              
              <div className="flex flex-col items-center gap-1">
                {p.price_min ? (
                  <p className="text-lg font-black tracking-tighter text-foreground">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price_min)}
                  </p>
                ) : (
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
                    Contact for valuation
                  </p>
                )}
                
                {/* Dấu gạch trang trí nhỏ dưới giá */}
                <div className="w-0 group-hover:w-8 h-[1.5px] bg-primary/40 transition-all duration-500 mx-auto" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* FOOTER: Quality Assurance */}
      <div className="pt-20 flex flex-col items-center opacity-30 gap-4">
        <div className="flex gap-8">
            <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Pure Quality</span>
                <div className="w-1 h-1 rounded-full bg-foreground" />
            </div>
            <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Direct Delivery</span>
                <div className="w-1 h-1 rounded-full bg-foreground" />
            </div>
        </div>
      </div>
    </div>
  );
}







//export default
async function ProductsPage_() {
  const products = await getProducts();

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Danh sách sản phẩm
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="border rounded-lg overflow-hidden hover:shadow transition"
          >

            {/* IMAGE */}
            {p.thumbnail_url && (
              <img
                src={p.thumbnail_url}
                alt={p.name}
                className="w-full h-40 object-cover"
              />
            )}

            {/* INFO */}
            <div className="p-3 space-y-1">

              <p className="font-medium text-sm">
                {p.name}
              </p>

              {p.price_min && (
                <p className="text-sm text-gray-600">
                  {p.price_min.toLocaleString()} đ
                </p>
              )}

            </div>

          </Link>
        ))}

      </div>

    </div>
  );
}