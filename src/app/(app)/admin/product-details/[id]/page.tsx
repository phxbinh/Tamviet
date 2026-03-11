//src/app/(app)/admin/product-details/[id]/page.tsx
/*
import React from "react";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';



async function getProductFullDetails(id: string) {
  const h = await headers();

  const host = h.get('host')!;
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/admin/products/${id}/details`, {
    cache: 'no-store',
    headers: {
      cookie: h.get('cookie') ?? '',
    },
  });

  if (res.status === 401) redirect('/login');
  if (res.status === 403) redirect('/403');
  if (!res.ok) throw new Error('Failed to fetch users');

  return res.json()

}


export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getProductFullDetails(id);

  return (

    <div className="p-6 space-y-8">
      <><pre>{JSON.stringify(data, null, 2)}</pre></>
      <h1 className="text-2xl font-bold">
        Product Detail Debug
      </h1>

   
      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Product Info</h2>
        <pre className="text-sm p-4 rounded overflow-auto">
          {JSON.stringify(data.product, null, 2)}
        </pre>
      </section>

 
      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Summary</h2>
        <pre className="text-sm p-4 rounded overflow-auto">
          {JSON.stringify(data.summary, null, 2)}
        </pre>
      </section>


      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Attributes</h2>
        <pre className="text-sm p-4 rounded overflow-auto">
          {JSON.stringify(data.attributes, null, 2)}
        </pre>
      </section>

     
      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Variants</h2>
        <pre className="text-sm p-4 rounded overflow-auto">
          {JSON.stringify(data.variants, null, 2)}
        </pre>
      </section>

    
      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Images</h2>
        <pre className="text-sm p-4 rounded overflow-auto">
          {JSON.stringify(data.images, null, 2)}
        </pre>
      </section>

    </div>
  );
}
*/


import React from "react";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from "next/link";
import { 
  Package, 
  ChevronLeft, 
  BarChart3, 
  Box, 
  Tag, 
  Layers, 
  Image as ImageIcon,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Archive
} from "lucide-react";

async function getProductFullDetails(id: string) {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  // Chú ý: URL API khớp với cấu trúc route bạn đã cung cấp: /api/admin/products/[id]/details
  const res = await fetch(`${protocol}://${host}/api/admin/products/${id}/details`, {
    cache: 'no-store',
    headers: {
      cookie: h.get('cookie') ?? '',
    },
  });

  if (res.status === 401) redirect('/login');
  if (res.status === 403) redirect('/403');
  if (!res.ok) return null;

  return res.json();
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProductFullDetails(id);

  if (!data) return <div className="p-20 text-center font-black uppercase tracking-widest text-red-500">Critical Error: Data Retrieval Failed</div>;

  const { product, summary, variants, attributes, images } = data;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 py-8 px-4 sm:px-6 animate-fade-in custom-scrollbar">
      
      {/* HEADER: Strategic Overview */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
        <div className="space-y-3">
          <Link 
            href="/admin/product-variants" 
            className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all"
          >
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
            Back to Registry
          </Link>
          <div className="border-l-4 border-primary pl-6 py-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground leading-none">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-[10px] bg-primary text-white px-2 py-0.5 font-bold uppercase tracking-widest">
                ID: {product.id.split('-')[0]}
              </span>
              <span className={`text-[10px] px-2 py-0.5 font-bold border uppercase tracking-widest ${
                product.status ? 'border-green-500 text-green-500 bg-green-500/5' : 'border-red-500 text-red-500 bg-red-500/5'
              }`}>
                {product.status ? 'Status: Active' : 'Status: Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="bg-foreground text-background px-6 py-3 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-90 transition-all active:scale-95">
            <Zap className="w-4 h-4 fill-current" /> Fast Edit
          </button>
        </div>
      </div>

      {/* STATS GRID: Summary Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Inventory', value: summary.total_stock, icon: Box, color: 'text-primary' },
          { label: 'Variant Clusters', value: summary.variant_count, icon: Layers, color: 'text-blue-500' },
          { label: 'Min Valuation', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(summary.min_price), icon: DollarSign, color: 'text-green-500' },
          { label: 'Max Valuation', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(summary.max_price), icon: BarChart3, color: 'text-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 shadow-sm group hover:border-primary transition-all relative overflow-hidden">
             <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
               <stat.icon className="w-16 h-16" />
             </div>
             <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">{stat.label}</p>
             <p className={`text-xl font-black tracking-tight ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Gallery & Info */}
        <div className="lg:col-span-4 space-y-8">
          {/* IMAGE GALLERY */}
          <section className="bg-card border border-border overflow-hidden">
            <div className="bg-muted/30 px-5 py-3 border-b border-border flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <ImageIcon className="w-3 h-3 text-primary" /> Visual Assets
              </span>
              <span className="text-[9px] font-mono opacity-50">{images.length} Files</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {images.length > 0 ? images.map((img: any) => (
                <div key={img.id} className="aspect-square bg-muted relative group overflow-hidden border border-border">
                  <img src={img.url} alt="Product" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                </div>
              )) : (
                <div className="col-span-2 py-10 text-center text-[10px] font-bold uppercase opacity-20 italic">No assets linked</div>
              )}
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="bg-card border border-border p-6 space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border-b border-border pb-3">
               <Archive className="w-4 h-4 text-primary" /> Asset Specification
             </h3>
             <p className="text-xs text-muted-foreground leading-relaxed font-medium">
               {product.description || "No detailed description available in the system registry."}
             </p>
          </section>
        </div>

        {/* RIGHT COLUMN: Variants Matrix Table */}
        <div className="lg:col-span-8">
          <section className="bg-card border border-border shadow-2xl relative overflow-hidden">
            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Variant Matrix Deployment
              </span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-primary" />
                <div className="w-1 h-1 bg-primary/50" />
                <div className="w-1 h-1 bg-primary/20" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/10 border-b border-border">
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">SKU / ID</th>
                    {attributes.map((attr: any) => (
                      <th key={attr.id} className="p-4 text-[9px] font-black uppercase tracking-widest text-primary italic">
                        {attr.name}
                      </th>
                    ))}
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">Valuation</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-right">Inventory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {variants.map((v: any) => (
                    <tr key={v.id} className="group hover:bg-primary/[0.03] transition-all">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-mono font-black tracking-widest text-foreground group-hover:text-primary transition-colors">
                            {v.sku}
                          </span>
                          <span className="text-[9px] opacity-40 font-mono tracking-tighter">
                            UID: {v.id.slice(0,8)}
                          </span>
                        </div>
                      </td>
                      {attributes.map((attr: any) => {
                        const attrValue = v.attributes.find((a: any) => a.attribute_name === attr.name);
                        return (
                          <td key={attr.id} className="p-4 text-[10px] font-black uppercase tracking-tight text-muted-foreground">
                            {attrValue ? attrValue.attribute_value : "—"}
                          </td>
                        );
                      })}
                      <td className="p-4">
                        <span className="text-xs font-black tracking-tight">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.price)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`text-xs font-mono font-bold px-2 py-1 border ${
                          v.stock < 5 ? 'border-red-500/50 bg-red-500/10 text-red-500 animate-pulse' : 'border-border'
                        }`}>
                          {v.stock.toString().padStart(2, '0')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* FOOTER: System Integrity */}
      <div className="flex items-center justify-between opacity-30 pt-10">
        <p className="text-[9px] font-black uppercase tracking-[0.5em]">Global Asset Management Protocol v4.0</p>
        <div className="h-[1px] flex-grow mx-8 bg-muted-foreground opacity-20" />
        <p className="text-[9px] font-black uppercase tracking-[0.5em]">Synchronized: {new Date(product.updated_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}









