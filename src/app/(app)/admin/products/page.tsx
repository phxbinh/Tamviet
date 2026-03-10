// src/app/(app)/admin/products/page.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Package, Plus, ExternalLink, Activity } from 'lucide-react';
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


/*
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

*/




/*
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-0 space-y-6">

      <h1 className="text-2xl font-bold">
        Admin Products
      </h1>

      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
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
                    href={`/admin/products-full/${product.id}/variants`}
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




export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER: Thể hiện sự quyết đoán */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-primary pl-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Inventory Assets
          </h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
            Quản lý danh mục sản phẩm chiến lược
          </p>
        </div>
        
        <button className="bg-primary text-white px-6 py-2.5 rounded-sm hover:opacity-90 transition-all font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Add New Asset
        </button>
      </div>

      {/* TABLE CONTAINER: Thể hiện sự chắc chắn */}
      <div className="bg-card border border-border shadow-sm overflow-hidden relative">
        {/* Thanh trạng thái nhỏ trên cùng table */}
        <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3 text-neon-cyan animate-breathe-fast" />
            Live Database Connection
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">Total: {products.length} Units</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground border-b border-border">
                <th className="p-4 text-left font-black uppercase tracking-widest text-[11px]">Product Name</th>
                <th className="p-4 text-left font-black uppercase tracking-widest text-[11px]">System Slug</th>
                <th className="p-4 text-center font-black uppercase tracking-widest text-[11px]">Stock</th>
                <th className="p-4 text-left font-black uppercase tracking-widest text-[11px]">Price Valuation</th>
                <th className="p-4 text-center font-black uppercase tracking-widest text-[11px]">Variants</th>
                <th className="p-4 text-right font-black uppercase tracking-widest text-[11px]">Operational Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {products.map((product: any) => (
                <tr
                  key={product.id}
                  className="group hover:bg-primary/[0.02] transition-colors duration-200"
                >
                  <td className="p-4">
                    <Link
                      href={`/admin/products-full/${product.id}/variants`}
                      className="font-bold text-foreground group-hover:text-primary flex items-center gap-2 transition-colors uppercase tracking-tight"
                    >
                      {product.name}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </td>

                  <td className="p-4 font-mono text-xs text-muted-foreground">
                    /{product.slug}
                  </td>

                  <td className="p-4 text-center font-bold">
                    <span className={product.total_stock <= 5 ? "text-red-500 animate-pulse" : ""}>
                      {product.total_stock}
                    </span>
                  </td>

                  <td className="p-4 font-bold tracking-tighter text-primary">
                    ${product.min_price} <span className="text-muted-foreground font-normal mx-1">–</span> ${product.max_price}
                  </td>

                  <td className="p-4 text-center">
                    <span className="bg-border/50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {product.variant_count}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? "bg-neon-cyan shadow-[0_0_8px_#22d3ee]" : "bg-muted-foreground"}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${product.is_active ? "text-foreground" : "text-muted-foreground italic"}`}>
                        {product.is_active ? "Active" : "Draft"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* FOOTER NOTE */}
      <p className="text-[10px] text-muted-foreground text-center font-medium uppercase tracking-[0.3em] opacity-50">
        End of encrypted inventory list
      </p>
    </div>
  );
}






