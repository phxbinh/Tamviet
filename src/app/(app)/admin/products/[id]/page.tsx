
// src/app/(app)/admin/products/[id]/page.tsx
import { headers } from "next/headers";
import Link from "next/link";
import { 
  ChevronLeft, 
  Package, 
  Settings2, 
  Layers, 
  Image as ImageIcon, 
  Activity,
  Fingerprint,
  Box,
  Tag
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  description?: string;
  short_description?: string;
}

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

interface Image {
  id: string;
  url: string;
  is_thumbnail: boolean;
}

interface ProductFullResponse {
  product: Product;
  attributes: Attribute[];
  variants: Variant[];
  images: Image[];
}

/*
async function getProductFull(id: string): Promise<ProductFullResponse> {
  const host = (await headers()).get("host");

  const res = await fetch(
    `http://${host}/api/admin/products/${id}/full`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}
*/



async function getProductFull(id: string): Promise<ProductFullResponse> {
  const host = (await headers()).get("host");
  const res = await fetch(`http://${host}/api/admin/products/${id}/full`, { 
    cache: "no-store" 
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProductFull(id);
  const { product, attributes, variants, images } = data;
  const attributeNames = attributes.map((a) => a.name);

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 py-8 px-6 animate-fade-in custom-scrollbar">
      
      {/* HEADER NAVIGATION */}
      <div className="flex flex-col gap-4 border-b border-border pb-8">
        <Link
          href="/admin/products"
          className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all"
        >
          <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Asset Registry
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="border-l-4 border-primary pl-6 py-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground leading-none">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-1 border border-border">
                UUID: {product.id.split("-")[0]}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border ${
                product.status === 'active' 
                  ? 'border-green-500/20 bg-green-500/5 text-green-600' 
                  : 'border-amber-500/20 bg-amber-500/5 text-amber-600'
              }`}>
                ● {product.status || 'Draft'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: SPECS & ASSETS */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* DESCRIPTION PANEL */}
          <section className="bg-card border border-border p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Fingerprint className="w-12 h-12" />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 border-l-4 border-primary pl-4 flex items-center gap-2">
              <Activity className="w-3 h-3 text-primary" /> Technical Abstract
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Global Path</p>
                <p className="text-xs font-mono font-bold">/{product.slug}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Core Narrative</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {product.short_description || "Registry entry contains no descriptive metadata."}
                </p>
              </div>
            </div>
          </section>

          {/* ATTRIBUTES PANEL */}
          <section className="bg-card border border-border p-6 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 border-l-4 border-primary pl-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary" /> DNA Clusters
            </h2>
            <div className="space-y-6">
              {attributes.map((attr) => (
                <div key={attr.id} className="space-y-3">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{attr.name}</p>
                  <div className="flex gap-2 flex-wrap">
                    {attr.values.map((v) => (
                      <span key={v.id} className="px-3 py-1.5 text-[10px] font-bold bg-muted border border-border uppercase tracking-tight">
                        {v.value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* IMAGES PANEL */}
          <section className="bg-card border border-border p-6 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 border-l-4 border-primary pl-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" /> Static Assets
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {images.map((img) => (
                <div key={img.id} className={`aspect-square relative group border ${img.is_thumbnail ? 'border-primary' : 'border-border'}`}>
                  <img src={img.url} alt="" className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500" />
                  {img.is_thumbnail && (
                    <div className="absolute inset-0 border-2 border-primary/50 pointer-events-none" />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: VARIANTS MATRIX */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-card border border-border shadow-2xl relative overflow-hidden">
            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-primary">
                <Layers className="w-4 h-4" /> Variant Matrix Output
              </span>
              <span className="text-[9px] font-mono font-bold opacity-40">INSTANCES: {variants.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/10 border-b border-border">
                    {attributeNames.map((name) => (
                      <th key={name} className="p-5 text-[9px] font-black uppercase tracking-widest text-primary italic border-r border-border/50">
                        {name}
                      </th>
                    ))}
                    <th className="p-5 text-[9px] font-black uppercase tracking-widest">Identity (SKU)</th>
                    <th className="p-5 text-[9px] font-black uppercase tracking-widest">Valuation</th>
                    <th className="p-5 text-[9px] font-black uppercase tracking-widest text-right">Reserves</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {variants.map((v) => (
                    <tr key={v.id} className="group hover:bg-primary/[0.02] transition-colors">
                      {attributeNames.map((attr) => (
                        <td key={attr} className="p-5 text-[11px] font-black uppercase tracking-tight text-muted-foreground border-r border-border/50">
                          {v.attributes[attr] ?? "—"}
                        </td>
                      ))}
                      <td className="p-5">
                        <span className="font-mono text-[11px] font-bold tracking-widest bg-primary/5 px-2 py-1 border border-primary/10 text-primary">
                          {v.sku}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-1 font-black text-xs">
                          <Tag className="w-3 h-3 opacity-30 text-primary" />
                          {v.price.toLocaleString('vi-VN')}
                          <span className="text-[9px] opacity-30 ml-1">VND</span>
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="h-1 w-12 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${v.stock < 10 ? 'bg-amber-500' : 'bg-primary'}`} 
                              style={{ width: `${Math.min(v.stock, 100)}%` }} 
                            />
                          </div>
                          <span className={`text-xs font-mono font-bold ${v.stock < 5 ? 'text-amber-500 animate-pulse' : ''}`}>
                            {v.stock.toString().padStart(3, '0')}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FOOTER SYSTEM INFO */}
          <div className="flex items-center justify-between opacity-30 pt-10">
            <p className="text-[9px] font-black uppercase tracking-[0.5em]">Asset Management Protocol v4.0.1</p>
            <Box className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
