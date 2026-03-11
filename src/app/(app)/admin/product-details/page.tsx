//src/app/(app)/admin/product-details/page.tsx
/*
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from "next/link";
import { 
  PackageSearch, 
  ArrowUpRight,
  Box, 
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

  const res = await fetch(`${protocol}://${host}/api/admin/products/detail-join`, {
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
*/

//src/app/(app)/admin/product-details/page.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from "next/link";
import ProductSearch from "./_components/ProductSearch";
import { 
  PackageSearch, 
  ArrowUpRight,
  Box, 
  Layers, 
  Activity, 
  Database, 
  ExternalLink,
  PlusCircle,
  LayoutDashboard,
  Filter,
  X
} from "lucide-react";

// 1. Fetch danh sách sản phẩm (có kèm params để API lọc)
async function getProducts(typeId?: string, status?: string, q?: string) {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  // Xây dựng URL với query params
  const url = new URL(`${protocol}://${host}/api/admin/products/detail-join`);
  if (typeId) url.searchParams.append('type', typeId);
  if (status) url.searchParams.append('status', status);
  if (q) url.searchParams.append('q', q);

  const res = await fetch(url.toString(), {
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

// 2. Fetch danh sách Product Types để làm bộ lọc
async function getProductTypes() {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/product-types`, {
    headers: { cookie: h.get('cookie') ?? '' },
  });
  return res.ok ? res.json() : [];
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; q?: string }>;
}) {
  // 1. Nhận tất cả giá trị lọc từ URL (bao gồm 'q' cho search)
  const { type: currentType, status: currentStatus, q: searchQuery } = await searchParams;
  
  // 2. Gọi dữ liệu song song với tham số tìm kiếm mới
  const [products, productTypes] = await Promise.all([
    getProducts(currentType, currentStatus, searchQuery),
    getProductTypes()
  ]);

  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'active':
        return {
          label: 'Active',
          container: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600',
          dot: 'bg-emerald-500 animate-pulse'
        };
      case 'draft':
        return {
          label: 'Draft',
          container: 'bg-amber-500/5 border-amber-500/20 text-amber-600',
          dot: 'bg-amber-500'
        };
      case 'archived':
        return {
          label: 'Archived',
          container: 'bg-slate-500/5 border-slate-500/20 text-slate-500',
          dot: 'bg-slate-400'
        };
      default:
        return {
          label: status || 'Unknown',
          container: 'bg-muted border-border text-muted-foreground',
          dot: 'bg-muted-foreground'
        };
    }
  };

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

      {/* STRATEGIC CONTROL BAR (SEARCH + FILTER) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 bg-card border border-border p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
        
        {/* Live Search Section */}
        <div className="flex-shrink-0">
          <ProductSearch />
        </div>

        <div className="hidden lg:block h-8 w-[1px] bg-border mx-2" />

        <div className="flex flex-col md:flex-row flex-grow items-start md:items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
            <Filter className="w-3 h-3" /> Matrix Filter:
          </div>

          {/* Type Filter Chips */}
          <div className="flex flex-wrap gap-2">
            <Link 
              href="/admin/product-details"
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter border transition-all ${
                !currentType ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-muted/30 border-border hover:border-primary/50'
              }`}
            >
              All Systems
            </Link>
            {productTypes.map((t: any) => (
              <Link
                key={t.id}
                href={`?type=${t.id}${currentStatus ? `&status=${currentStatus}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
                className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter border transition-all ${
                  currentType === t.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-muted/30 border-border hover:border-primary/50'
                }`}
              >
                {t.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block h-4 w-[1px] bg-border/50 mx-1" />

          {/* Status Filter Chips */}
          <div className="flex gap-2">
            {['active', 'draft', 'archived'].map((s) => (
              <Link
                key={s}
                href={`?status=${s}${currentType ? `&type=${currentType}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
                className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter border transition-all ${
                  currentStatus === s 
                    ? 'bg-foreground text-background border-foreground shadow-lg shadow-foreground/10' 
                    : 'bg-muted/30 border-border hover:border-foreground/50'
                }`}
              >
                {s}
              </Link>
            ))}
          </div>

          {(currentType || currentStatus || searchQuery) && (
            <Link 
              href="/admin/product-details" 
              className="ml-auto flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
            >
              <X className="w-3 h-3" /> Reset System
            </Link>
          )}
        </div>
      </div>

      {/* PRODUCT MATRIX TABLE */}
      <div className="bg-card border border-border shadow-2xl overflow-hidden relative">
        <div className="bg-muted/30 px-6 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-6">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
               <Database className="w-3 h-3 text-primary" /> 
               Registry Size: {products.length} Units
             </span>
             {searchQuery && (
               <>
                 <div className="h-4 w-[1px] bg-border" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary animate-pulse">
                   Query: "{searchQuery}"
                 </span>
               </>
             )}
             <div className="h-4 w-[1px] bg-border" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
               <Activity className="w-3 h-3 text-emerald-500 animate-pulse" /> 
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
              {products.length > 0 ? products.map((product: any) => {
                const statusStyle = getStatusConfig(product.status);
                
                return (
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
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-primary border border-primary/20 px-1 py-0.5 uppercase tracking-[0.1em] bg-primary/5">
                            {product.product_type_name || 'System.Generic'}
                          </span>
                          <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-tighter">
                            ID: {product.id.split('-')[0]}
                          </span>
                        </div>
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
                         {Number(product.total_stock).toString().padStart(3, '0')}
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
                      <div className={`inline-flex items-center gap-2 px-3 py-1 border text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${statusStyle.container}`}>
                        <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${statusStyle.dot}`} />
                        {statusStyle.label}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-[10px] font-black uppercase tracking-[0.5em] opacity-20 italic">
                    {searchQuery ? `No matches found for "${searchQuery}"` : "No Assets Found In Current Matrix"}
                  </td>
                </tr>
              )}
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









// Chạy được cho filter
//export default 
async function ProductsPage__({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  // Nhận các giá trị lọc từ URL
  const { type: currentType, status: currentStatus } = await searchParams;
  
  // Gọi dữ liệu song song
  const [products, productTypes] = await Promise.all([
    getProducts(currentType, currentStatus),
    getProductTypes()
  ]);

  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'active':
        return {
          label: 'Active',
          container: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600',
          dot: 'bg-emerald-500 animate-pulse'
        };
      case 'draft':
        return {
          label: 'Draft',
          container: 'bg-amber-500/5 border-amber-500/20 text-amber-600',
          dot: 'bg-amber-500'
        };
      case 'archived':
        return {
          label: 'Archived',
          container: 'bg-slate-500/5 border-slate-500/20 text-slate-500',
          dot: 'bg-slate-400'
        };
      default:
        return {
          label: status || 'Unknown',
          container: 'bg-muted border-border text-muted-foreground',
          dot: 'bg-muted-foreground'
        };
    }
  };

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

      {/* STRATEGIC FILTER BAR - NEW SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-card border border-border p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
        
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
          <Filter className="w-3 h-3" /> Matrix Filter:
        </div>

        {/* Type Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/admin/product-details"
            className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter border transition-all ${
              !currentType ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-muted/30 border-border hover:border-primary/50'
            }`}
          >
            All Systems
          </Link>
          {productTypes.map((t: any) => (
            <Link
              key={t.id}
              href={`?type=${t.id}${currentStatus ? `&status=${currentStatus}` : ''}`}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter border transition-all ${
                currentType === t.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-muted/30 border-border hover:border-primary/50'
              }`}
            >
              {t.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:block h-6 w-[1px] bg-border mx-2" />

        {/* Status Filter Chips */}
        <div className="flex gap-2">
          {['active', 'draft', 'archived'].map((s) => (
            <Link
              key={s}
              href={`?status=${s}${currentType ? `&type=${currentType}` : ''}`}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter border transition-all ${
                currentStatus === s 
                  ? 'bg-foreground text-background border-foreground shadow-lg shadow-foreground/10' 
                  : 'bg-muted/30 border-border hover:border-foreground/50'
              }`}
            >
              {s}
            </Link>
          ))}
        </div>

        {(currentType || currentStatus) && (
          <Link 
            href="/admin/product-details" 
            className="ml-auto flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
          >
            <X className="w-3 h-3" /> Reset Filter
          </Link>
        )}
      </div>

      {/* PRODUCT MATRIX TABLE */}
      <div className="bg-card border border-border shadow-2xl overflow-hidden relative">
        <div className="bg-muted/30 px-6 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-6">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
               <Database className="w-3 h-3 text-primary" /> 
               Registry Size: {products.length} Units
             </span>
             <div className="h-4 w-[1px] bg-border" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
               <Activity className="w-3 h-3 text-emerald-500 animate-pulse" /> 
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
              {products.length > 0 ? products.map((product: any) => {
                const statusStyle = getStatusConfig(product.status);
                
                return (
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
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-primary border border-primary/20 px-1 py-0.5 uppercase tracking-[0.1em] bg-primary/5">
                            {product.product_type_name || 'System.Generic'}
                          </span>
                          <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-tighter">
                            ID: {product.id.split('-')[0]}
                          </span>
                        </div>
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
                         {Number(product.total_stock).toString().padStart(3, '0')}
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
                      <div className={`inline-flex items-center gap-2 px-3 py-1 border text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${statusStyle.container}`}>
                        <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${statusStyle.dot}`} />
                        {statusStyle.label}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-[10px] font-black uppercase tracking-[0.5em] opacity-20 italic">
                    No Assets Found In Current Matrix
                  </td>
                </tr>
              )}
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













//export default
async function ProductsPage_() {
  const products = await getProducts();

  // Helper function để định nghĩa style cho từng trạng thái
  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'active':
        return {
          label: 'Active',
          container: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600',
          dot: 'bg-emerald-500 animate-pulse'
        };
      case 'draft':
        return {
          label: 'Draft',
          container: 'bg-amber-500/5 border-amber-500/20 text-amber-600',
          dot: 'bg-amber-500'
        };
      case 'archived':
        return {
          label: 'Archived',
          container: 'bg-slate-500/5 border-slate-500/20 text-slate-500',
          dot: 'bg-slate-400'
        };
      default:
        return {
          label: status || 'Unknown',
          container: 'bg-muted border-border text-muted-foreground',
          dot: 'bg-muted-foreground'
        };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in py-2">
      {/* ... Header Section giữ nguyên ... */}
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
              {products.map((product: any) => {
                const statusStyle = getStatusConfig(product.status);
                
                return (
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
                        
                        <div className="flex items-center gap-2">
                          {/* Label loại sản phẩm - Nhìn rất kỹ thuật và chuyên nghiệp */}
                          <span className="text-[8px] font-black text-primary border border-primary/20 px-1 py-0.5 uppercase tracking-[0.1em] bg-primary/5">
                            {product.product_type_name || 'System.Generic'}
                          </span>
                          <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-tighter">
                            ID: {product.id.split('-')[0]}
                          </span>
                        </div>
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
                         {/* Ép kiểu Number để padStart hoạt động chính xác */}
                         {Number(product.total_stock).toString().padStart(3, '0') || '000'}
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
                      <div className={`inline-flex items-center gap-2 px-3 py-1 border text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${statusStyle.container}`}>
                        <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${statusStyle.dot}`} />
                        {statusStyle.label}
                      </div>
                    </td>
                  </tr>
                );
              })}
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

