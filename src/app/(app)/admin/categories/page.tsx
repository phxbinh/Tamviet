/*
import Link from "next/link";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';


export interface Category {
  id: string;
  parent_id: string | null;

  name: string;
  slug: string;

  is_active: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

async function getCategories(): Promise<Category[]> {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/admin/categories`, {
    cache: 'no-store',
    headers: {
      cookie: h.get('cookie') ?? '',
    },
  });

  if (res.status === 401) redirect('/login');
  if (res.status === 403) redirect('/403');
  if (!res.ok) throw new Error('Failed to fetch categories');

  const json: CategoriesResponse = await res.json();

  return json.data; // 👈 quan trọng
}



export default async function CategoriesPage() {

  const data  = await getCategories();

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>

        <Link
          href="/admin/categories/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          New Category
        </Link>
      </div>

      <table className="w-full border">

        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>

          {data.map((c: Category) => (
            <tr key={c.id} className="border-t">

              <td>{c.name}</td>
              <td>{c.slug}</td>
              <td>{c.is_active ? "Active" : "Inactive"}</td>

              <td>
                <Link
                  href={`/admin/categories/${c.id}`}
                  className="text-blue-600"
                >
                  Edit
                </Link>
              </td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}
*/



import Link from "next/link";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Plus, Edit3, Layers, Circle, ChevronRight } from "lucide-react";
import { CategoryRow } from './_compnents/CategoryRow';
//src/app/(app)/admin/categories/_compnents/CategoryRow.tsx

export interface Category {
  id: string;
  parent_id: string | null;

  name: string;
  slug: string;

  is_active: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

async function getCategories(): Promise<Category[]> {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/admin/categories`, {
    cache: 'no-store',
    headers: {
      cookie: h.get('cookie') ?? '',
    },
  });

  if (res.status === 401) redirect('/login');
  if (res.status === 403) redirect('/403');
  if (!res.ok) throw new Error('Failed to fetch categories');

  const json: CategoriesResponse = await res.json();

  return json.data; // 👈 quan trọng
}

export default async function CategoriesPage() {
  const data = await getCategories();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 animate-fade-in">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg">
                <Layers className="w-5 h-5 text-primary" />
             </div>
             <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase italic">
                Inventory Categories <span className="text-primary">.</span>
             </h1>
          </div>
          <p className="text-[10px] font-bold text-foreground/30 tracking-[0.3em] uppercase ml-12">
            Quản lý cấu trúc phân loại hệ thống ({data.length})
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="group flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-500 hover:shadow-[0_15px_30px_rgba(var(--primary),0.2)] active:scale-95"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          New Category
        </Link>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Tên danh mục</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Đường dẫn (Slug)</th>
                <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Trạng thái</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50">
              {data.length > 0 ? data.map((c) => (
              <tr key={c.id} className="group hover:bg-primary/[0.02] transition-colors duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:scale-150 transition-transform" />
                       <span className="text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors italic">
                         {c.name}
                       </span>
                    </div>
                  </td>
                  
                  <td className="px-8 py-6">
                    <span className="text-xs font-mono text-foreground/30 bg-muted/50 px-3 py-1 rounded-lg">
                      /{c.slug}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                       <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-tighter ${
                          c.is_active 
                          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600" 
                          : "bg-orange-500/5 border-orange-500/20 text-orange-600"
                       }`}>
                          <Circle className={`w-1.5 h-1.5 fill-current ${c.is_active ? 'animate-pulse' : ''}`} />
                          {c.is_active ? "Active" : "Inactive"}
                       </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex justify-end">
                       <Link
                          href={`/admin/categories/${c.id}`}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:bg-foreground hover:text-background transition-all duration-300 group/btn shadow-sm"
                       >
                          Edit 
                          <Edit3 className="w-3 h-3 group-hover/btn:rotate-12 transition-transform" />
                       </Link>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-sm font-bold text-foreground/20 uppercase tracking-[0.3em] animate-breathe-slow">
                      Chưa có danh mục nào được khởi tạo
                    </p>
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* Footer Table */}
        <div className="p-6 bg-muted/20 border-t border-border flex justify-between items-center">
           <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
             Total: {data.length} units
           </span>
           <div className="flex gap-1">
              <div className="w-8 h-1 bg-primary rounded-full" />
              <div className="w-2 h-1 bg-primary/20 rounded-full" />
              <div className="w-1 h-1 bg-primary/10 rounded-full" />
           </div>
        </div>
      </div>
    </div>
  );
}


















