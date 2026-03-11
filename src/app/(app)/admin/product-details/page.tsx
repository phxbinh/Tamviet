
//src/app/(app)/admin/product-details/page.tsx
/*
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import Link from "next/link";


async function getProducts() {
  const h = await headers();

  const host = h.get('host')!;
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/admin/products`, {
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


export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-0 space-y-6">

      <h1 className="text-2xl font-bold">
        Admin Products
      </h1>
      <br/>
      <Link
        href={`/admin/product-variants`}
        className="text-blue-600 hover:underline"
      >
        Goto Set Product-variants
      </Link>
      <br/>
      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Price Range</th>
              <th className="p-3">Variants</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product: any) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3 font-medium">
                  <Link
                    href={`/admin/product-details/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>

                <td className="p-3">
                  {product.slug}
                </td>

                <td className="p-3">
                  {product.total_stock}
                </td>

                <td className="p-3">
                  {product.min_price} – {product.max_price}
                </td>

                <td className="p-3">
                  {product.variant_count}
                </td>

                <td className="p-3">
                  {product.is_active ? "Active" : "Draft"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}
*/


import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from "next/link";
import { 
  PackageSearch, 
  ArrowUpRight, 
  Layers, 
  Activity, 
  Database, 
  ExternalLink,
  PlusCircle,
  LayoutDashboard
} from "lucide-react";

async function getProducts() {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/admin/products`, {
    cache: 'no-store',
    headers: {
      cookie: h.get('cookie') ?? '',
    },
  });

  if (res.status === 401) redirect('/login');
  if (res.status === 403) redirect('/403');
  if (!res.ok) throw new Error('Failed to fetch products');

  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8 animate-fade-in py-2">
      
      {/* STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="border-l-4 border-primary pl-6">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            Global Product Registry
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-1 italic">
            Hệ thống quản trị tài sản và danh mục sản phẩm tổng thể
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/admin/product-variants"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-muted/50 border border-border text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all"
          >
            <Layers className="w-4 h-4 text-primary" />
            Manage Variants
            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
          <button className="bg-primary text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </div>

      {/* PRODUCT MATRIX TABLE */}
      <div className="bg-card border border-border shadow-2xl overflow-hidden relative">
        <div className="bg-muted/30 px-6 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-6">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
               <Database className="w-3 h-3 text-primary" /> 
               Total Assets: {products.length}
             </span>
             <div className="h-4 w-[1px] bg-border" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
               <Activity className="w-3 h-3 text-green-500 animate-pulse" /> 
               System: Operational
             </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/10 border-b border-border text-muted-foreground">
                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em]">Designation (Name)</th>
                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em]">Slug Path</th>
                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em]">Reserves</th>
                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em]">Valuation Range</th>
                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em]">Clusters</th>
                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product: any) => (
                <tr 
                  key={product.id} 
                  className="group hover:bg-primary/[0.02] transition-all duration-300"
                >
                  <td className="p-5">
                    <Link
                      href={`/admin/product-details/${product.id}`}
                      className="flex flex-col gap-1 group/link"
                    >
                      <span className="text-sm font-black uppercase tracking-tight group-hover/link:text-primary transition-colors flex items-center gap-2">
                        {product.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-tighter">
                        ID: {product.id.split('-')[0]}
                      </span>
                    </Link>
                  </td>

                  <td className="p-5">
                    <span className="text-[10px] font-mono opacity-50 lowercase tracking-tighter">
                      /{product.slug}
                    </span>
                  </td>

                  <td className="p-5">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs">
                       <Box className="w-3 h-3 opacity-30" />
                       {product.total_stock?.toString().padStart(3, '0') || '000'}
                    </div>
                  </td>

                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black tracking-tighter">
                        {new Intl.NumberFormat('vi-VN').format(product.min_price || 0)} 
                        <span className="mx-1 opacity-30">→</span>
                        {new Intl.NumberFormat('vi-VN').format(product.max_price || 0)}
                      </span>
                      <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Currency: VND</span>
                    </div>
                  </td>

                  <td className="p-5">
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-muted/50 border border-border text-[10px] font-black">
                      <Layers className="w-3 h-3 opacity-50" />
                      {product.variant_count}
                    </div>
                  </td>

                  <td className="p-5 text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 border text-[9px] font-black uppercase tracking-widest ${
                      product.is_active 
                        ? 'bg-green-500/5 border-green-500/20 text-green-600' 
                        : 'bg-red-500/5 border-red-500/20 text-red-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                      {product.is_active ? "Active" : "Draft"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SYSTEM FOOTER */}
      <div className="flex items-center justify-between opacity-30 px-2 pt-4">
        <p className="text-[9px] font-black uppercase tracking-[0.4em]">Strategic Registry Interface v4.0</p>
        <PackageSearch className="w-4 h-4" />
      </div>
    </div>
  );
}