import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from "next/link";
import { 
  Package, 
  ArrowUpRight, 
  Box, 
  Activity, 
  ShieldCheck, 
  Search,
  ChevronRight
} from "lucide-react";

interface Product {
  id: string
  name: string
  slug: string
  status: "draft" | "active" | "archived"
  product_type: string
  created_at: string
}

async function getProducts(): Promise<Product[]> {

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
    <div className="space-y-8 animate-fade-in py-4 px-2">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-8">
        <div className="border-l-4 border-primary pl-6">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
            <Package className="w-8 h-8 text-primary animate-breathe-slow" />
            Master Product Index
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">
            Hệ thống quản lý biến thể tài sản cấp cao
          </p>
        </div>

        <div className="flex items-center gap-4 bg-card border border-border px-4 py-2 shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            placeholder="FILTER ASSETS..." 
            className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none w-32 md:w-48"
          />
        </div>
      </div>

      {/* STATS OVERVIEW (Optional - tăng chất lượng) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Units', value: products.length, icon: Box },
          { label: 'System Status', value: 'Operational', icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="bg-muted/20 border border-border p-4 flex items-center gap-4">
            <stat.icon className="w-5 h-5 text-primary opacity-50" />
            <div>
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-sm font-black tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE SECTION: Chắc chắn & Sắc sảo */}
      <div className="bg-card border border-border shadow-2xl overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground">
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em]">Designation (Name)</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em]">Operational Status</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em] text-right">Deployment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id} className="group hover:bg-primary/[0.02] transition-all duration-300">
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                        {p.name}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-tighter italic">
                        UID: {p.id.split('-')[0]}..{p.id.slice(-4)}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 border text-[9px] font-black uppercase tracking-widest ${
                      p.status === 'active' 
                        ? 'bg-green-500/5 border-green-500/20 text-green-600' 
                        : 'bg-muted border-border text-muted-foreground'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                      {p.status}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <Link
                      href={`/admin/product-variants/${p.id}/variants`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border text-[9px] font-black uppercase tracking-widest hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm active:translate-y-0.5 group/btn"
                    >
                      <span>Manage Variants</span>
                      <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between opacity-30 px-2">
        <p className="text-[9px] font-black uppercase tracking-[0.4em]">Strategic Registry v3.0</p>
        <ShieldCheck className="w-4 h-4" />
      </div>
    </div>
  );
}
