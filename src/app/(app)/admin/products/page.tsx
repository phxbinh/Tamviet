// src/app/(app)/admin/products/page.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from "next/link";
import { Package, Plus, ExternalLink, Activity, Database, AlertCircle } from 'lucide-react';

interface Product {
  id: string
  name: string
  slug: string
  status: "draft" | "active" | "archived"
  product_type_id: string | null
  product_type_name: string | null
  created_at: string
}

async function getProducts(): Promise<Product[]> {
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
  if (!res.ok) throw new Error('Failed to fetch assets');

  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8 animate-fade-in p-2 sm:p-0">
      {/* SECTION HEADER: Tham vọng & Quyết đoán */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-l-4 border-primary pl-6 py-2">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
            <Package className="w-8 h-8 text-primary animate-breathe-slow" />
            Core Assets
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1 opacity-70">
            Hệ thống quản lý tài sản chiến lược v1.0
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-primary text-white px-6 py-3 rounded-sm hover:opacity-90 transition-all font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 active:translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Initialize Asset
        </Link>
      </div>

      {/* TABLE CONTAINER: Chắc chắn & Minh bạch */}
      <div className="bg-card border border-border shadow-2xl shadow-black/5 relative overflow-hidden">
        {/* Status Bar */}
        <div className="bg-muted/20 border-b border-border px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Database className="w-3 h-3" />
              Mainframe: Connected
            </span>
            <span className="h-3 w-[1px] bg-border" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
              Total Units: {products.length}
            </span>
          </div>
          <Activity className="w-3 h-3 text-neon-cyan animate-pulse" />
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {/*<table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/10 text-muted-foreground border-b border-border">
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em]">Designation</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em]">Slug ID</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em]">Class</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em]">Op. Status</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-right">Timestamp</th>
              </tr>
            </thead>*/}


  <table className="w-full text-left border-collapse table-fixed min-w-[800px]"> {/* Thêm table-fixed để kiểm soát width chính xác */}
    <thead>
      <tr className="bg-muted/10 text-muted-foreground border-b border-border">
        {/* Cột chính: Chiếm nhiều diện tích nhất */}
        <th className="p-4 w-[35%] min-w-[200px] text-[10px] font-black uppercase tracking-[0.2em]">
          Designation
        </th>
        
        {/* Cột ID/Slug: Cần độ rộng vừa phải, dùng font mono */}
        <th className="p-4 w-[20%] min-w-[150px] text-[10px] font-black uppercase tracking-[0.2em]">
          Slug ID
        </th>
        
        <th className="p-4 w-[15%] min-w-[120px] text-[10px] font-black uppercase tracking-[0.2em]">
          Class
        </th>
        
        <th className="p-4 w-[15%] min-w-[120px] text-[10px] font-black uppercase tracking-[0.2em]">
          Op. Status
        </th>
        
        <th className="p-4 w-[15%] min-w-[120px] text-[10px] font-black uppercase tracking-[0.2em] text-right">
          Timestamp
        </th>
      </tr>
    </thead>

            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="group hover:bg-primary/[0.03] transition-all duration-300"
                >
                  <td className="p-4">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-tight"
                    >
                      {product.name}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </Link>
                  </td>

                  <td className="p-4 font-mono text-[11px] text-muted-foreground opacity-60">
                    /{product.slug}
                  </td>

                  <td className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-border/40 px-2 py-1 rounded-sm">
                      {product.product_type_name ?? "UNCATEGORIZED"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        product.status === "active" ? "bg-neon-cyan shadow-[0_0_8px_#22d3ee]" : 
                        product.status === "draft" ? "bg-yellow-500" : "bg-muted-foreground"
                      }`} />
                      <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${
                        product.status === "active" ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-right font-mono text-[10px] text-muted-foreground uppercase">
                    {new Date(product.created_at).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
              <AlertCircle className="w-10 h-10 text-muted-foreground opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50">
                No tactical assets found in current sector
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER CAPTION */}
      <div className="flex justify-center opacity-30">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em]">
          Strategic Command Interface // 2026
        </p>
      </div>
    </div>
  );
}
