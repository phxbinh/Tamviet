
// src/app/(app)/admin/product-variants/[id]/variants/page.tsx
import React from "react";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from "next/link";
import DeleteButton from "@/components/product-variants/DeleteButton";
import { 
  Box, 
  Plus, 
  Edit3, 
  Database, 
  ChevronLeft, 
  Layers, 
  Activity,
  ArrowUpRight
} from "lucide-react";

async function getVariants(id: string) {
  const h = await headers();

  const host = h.get('host')!;
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https';

    const res = await fetch(
      `${protocol}://${host}/api/admin/product-variants?productId=${id}`,
      {
        cache: "no-store",
        headers: {
          cookie: h.get("cookie") ?? "",
        },
      }
    );

    if (res.status === 401) redirect('/login');
    if (res.status === 403) redirect('/403');
    if (!res.ok) throw new Error('Failed to fetch users');
  
  return res.json()
}

export default async function VariantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const variants = await getVariants(id);

  return (
    <div className="space-y-8 animate-fade-in custom-scrollbar">
      
      {/* HEADER: Sự tham vọng & Kết nối */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-2 border-l-4 border-primary pl-6">
          <Link 
            href="/admin/product-variants" 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all mb-2"
          >
            <ChevronLeft className="w-3 h-3" /> Back to Fleet
          </Link>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3 text-foreground">
            <Layers className="w-8 h-8 text-primary animate-breathe-slow" />
            Variant Inventory
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
            Quản lý chi tiết mã định danh SKU và thông số vận hành
          </p>
        </div>

        <Link
          href={`/admin/product-variants/${id}/variants/new`}
          className="bg-primary text-white px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          Deploy New Variant
        </Link>
      </div>

      {/* LIST TABLE: Sự chắc chắn & Nổi bật chất lượng */}
      <div className="bg-card border border-border shadow-2xl overflow-hidden relative">
        <div className="bg-muted/30 px-6 py-3 border-b border-border flex items-center justify-between">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <Database className="w-3 h-3 text-primary" />
            Stock Keeping Units: {variants.length} Registered
          </span>
          <Activity className="w-3 h-3 text-neon-cyan animate-pulse" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/10 text-muted-foreground border-b border-border">
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em]">Identity (SKU)</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em]">Valuation</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em]">Reserves</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em] text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {variants.map((v: any) => (
                <tr key={v.id} className="group hover:bg-primary/[0.02] transition-all duration-300">
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs font-bold text-primary tracking-widest bg-primary/5 px-2 py-1 border border-primary/10 w-fit group-hover:bg-primary group-hover:text-white transition-all">
                        {v.sku.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-tight">
                        {v.title || "No Title Defined"}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-sm font-black tracking-tight text-foreground">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.price)}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`h-1.5 w-12 bg-muted rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full transition-all ${v.stock > 10 ? 'bg-neon-cyan' : 'bg-red-500'}`} 
                          style={{ width: `${Math.min(v.stock, 100)}%` }}
                        />
                      </div>
                      <span className={`text-xs font-mono font-bold ${v.stock <= 5 ? 'text-red-500 animate-pulse' : 'text-foreground'}`}>
                        {v.stock.toString().padStart(2, '0')}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/product-variants/${id}/variants/${v.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border text-[9px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all shadow-sm active:translate-y-0.5"
                      >
                        <Edit3 className="w-3 h-3" />
                        Modify
                      </Link>

                      {/* DeleteButton cần được bọc lớp CSS chắc chắn bên trong component của nó */}
                      <DeleteButton variantId={v.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {variants.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Box className="w-12 h-12" />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em]">No variants deployed in this sector</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER: Quality Assurance */}
      <div className="flex items-center justify-between opacity-30 px-2 pt-4">
        <p className="text-[9px] font-black uppercase tracking-[0.4em]">Asset Registry Control // Secure Interface</p>
        <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-neon-cyan" />
        </div>
      </div>
    </div>
  );
}
