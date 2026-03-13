// src/app/(app)/admin/categories/[id]/page.tsx

/*
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import CategoryParentSelect from "@/components/admin/CategoryParentSelect"
import { slugify } from "@/lib/utils/slugify"

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
}

export default function Page() {

  const { id } = useParams()
  const router = useRouter()

  const [form,setForm] = useState<Category | null>(null)
  const [categories,setCategories] = useState([])

  const [saving,setSaving] = useState(false)

  useEffect(()=>{

    async function load(){

      const cat = await fetch(`/api/admin/categories/${id}`)
      const catJson = await cat.json()

      const tree = await fetch(`/api/admin/categories/tree`)
      const treeJson = await tree.json()

      setForm(catJson.data)
      setCategories(treeJson.data)
    }

    load()

  },[id])

  if(!form) return <div className="p-10">Loading...</div>

  function update(field:string,value:any){

    setForm(prev=>({
      ...prev!,
      [field]:value
    }))
  }

  async function save(){

    setSaving(true)

    const res = await fetch(`/api/admin/categories/${id}`,{
      method:"PATCH",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(form)
    })

    setSaving(false)

    if(!res.ok){
      alert("Update failed")
      return
    }

    router.refresh()
  }

  async function remove(){

    if(!confirm("Delete category?")) return

    await fetch(`/api/admin/categories/${id}`,{
      method:"DELETE"
    })

    router.push("/admin/categories")
  }

  return (

<div className="max-w-2xl mx-auto p-10 space-y-6">

<h1 className="text-2xl font-bold">
Edit Category
</h1>



<div className="space-y-2">

<label className="font-semibold text-sm">
Name
</label>

<input
className="w-full border rounded p-2"
value={form.name}
onChange={(e)=>{
  const name = e.target.value
  update("name",name)
  update("slug",slugify(name))
}}
/>

</div>




<div className="space-y-2">

<label className="font-semibold text-sm">
Slug
</label>

<input
className="w-full border rounded p-2"
value={form.slug}
onChange={(e)=>update("slug",e.target.value)}
/>

</div>




<div className="space-y-2">

<label className="font-semibold text-sm">
Parent category
</label>

<CategoryParentSelect
categories={categories}
value={form.parent_id}
currentId={form.id}
onChange={(v)=>update("parent_id",v)}
/>

</div>




<div className="space-y-2">

<label className="font-semibold text-sm">
Display order
</label>

<input
type="number"
className="w-full border rounded p-2"
value={form.display_order}
onChange={(e)=>update("display_order",Number(e.target.value))}
/>

</div>




<div className="flex items-center gap-2">

<input
type="checkbox"
checked={form.is_active}
onChange={(e)=>update("is_active",e.target.checked)}
/>

<span>Active</span>

</div>


<div className="flex gap-4 pt-6">

<button
onClick={save}
disabled={saving}
className="px-6 py-2 bg-black text-white rounded"
>
{saving ? "Saving..." : "Save"}
</button>

<button
onClick={remove}
className="px-6 py-2 bg-red-600 text-white rounded"
>
Delete
</button>

<button
onClick={()=>router.push("/admin/categories")}
className="px-6 py-2 border rounded"
>
Back
</button>

</div>

</div>
  )
}
*/



"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import slugify from "slugify"; // Sử dụng thư viện slugify chuẩn
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Hash, 
  Layers, 
  Sparkles, 
  RotateCcw,
  ListOrdered,
  Activity,
  ChevronRight
} from "lucide-react";
import CategoryParentSelect from "@/components/admin/CategoryParentSelect";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
}

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<Category | null>(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSlugManual, setIsSlugManual] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [catRes, treeRes] = await Promise.all([
          fetch(`/api/admin/categories/${id}`),
          fetch(`/api/admin/categories/tree`)
        ]);

        const catJson = await catRes.json();
        const treeJson = await treeRes.json();

        setForm(catJson.data);
        setCategories(treeJson.data);
      } catch (err) {
        console.error("Load failed", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function update(field: string, value: any) {
    setForm(prev => ({
      ...prev!,
      [field]: value
    }));
  }

  // Logic Slugify thông minh
  const handleNameChange = (name: string) => {
    update("name", name);
    if (!isSlugManual) {
      update("slug", slugify(name, { lower: true, strict: true, locale: "vi" }));
    }
  };

  const handleSlugChange = (slug: string) => {
    setIsSlugManual(true);
    update("slug", slug);
  };

  const resetSlug = () => {
    setIsSlugManual(false);
    if (form) {
      update("slug", slugify(form.name, { lower: true, strict: true, locale: "vi" }));
    }
  };

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setSaving(false);
    if (res.ok) router.refresh();
    else alert("Update failed");
  }

  async function remove() {
    if (!confirm("Xác nhận xóa danh mục này?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    router.push("/admin/categories");
  }

  if (loading || !form) return (
    <div className="max-w-3xl mx-auto p-20 space-y-8 animate-pulse">
      <div className="h-4 w-32 bg-border/40 rounded-full" />
      <div className="h-96 bg-border/20 rounded-[3rem]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-10 animate-fade-in">
      {/* Navigation Header */}
      <div className="max-w-3xl mx-auto mb-10 flex items-center justify-between">
        <Link 
          href="/admin/categories" 
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/40 hover:text-primary transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
          Categories List
        </Link>
        
        <button 
          onClick={remove}
          className="p-3 text-foreground/10 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all duration-300"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-card border border-border rounded-[3rem] shadow-2xl shadow-primary/5 overflow-hidden">
        {/* Header Title */}
        <div className="p-8 md:p-14 pb-0 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase italic">
              Update Category <span className="text-primary">.</span>
            </h1>
          </div>
          <p className="text-[10px] font-bold text-foreground/20 tracking-[0.4em] uppercase ml-5">
            System Identity: {form.id.slice(0, 18)}...
          </p>
        </div>

        <div className="p-8 md:p-14 space-y-10">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name Input */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-foreground/50">
                <Layers className="w-3.5 h-3.5" /> Category Name
              </label>
              <input
                className="w-full bg-background border border-border px-6 py-4 rounded-2xl text-sm font-bold focus:ring-[12px] focus:ring-primary/5 focus:border-primary/40 outline-none transition-all duration-500"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            {/* Slug Input */}
            <div className="space-y-3">
              <label className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-foreground/50">
                <span className="flex items-center gap-2"><Hash className="w-3.5 h-3.5" /> Slug</span>
                {isSlugManual ? (
                  <button onClick={resetSlug} className="flex items-center gap-1 text-[9px] text-orange-500 hover:text-primary transition-colors">
                    <RotateCcw className="w-2.5 h-2.5" /> Auto Sync
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-[8px] text-primary bg-primary/10 px-2 py-0.5 rounded-full animate-pulse">
                    <Sparkles className="w-2 h-2" /> Live
                  </span>
                )}
              </label>
              <input
                className={`w-full bg-background border px-6 py-4 rounded-2xl text-sm font-mono transition-all duration-500 outline-none focus:ring-[12px] focus:ring-primary/5
                  ${isSlugManual ? "border-orange-500/40 text-orange-600" : "border-border text-primary italic focus:border-primary/40"}
                `}
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
              />
            </div>
          </div>

          {/* Hierarchy & Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-foreground/50">
                <ChevronRight className="w-3.5 h-3.5" /> Parent Category
              </label>
              <div className="relative group">
                <CategoryParentSelect
                  categories={categories}
                  value={form.parent_id}
                  currentId={form.id}
                  onChange={(v) => update("parent_id", v)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-foreground/50">
                <ListOrdered className="w-3.5 h-3.5" /> Order
              </label>
              <input
                type="number"
                className="w-full bg-background border border-border px-6 py-4 rounded-2xl text-sm font-black focus:ring-[12px] focus:ring-primary/5 focus:border-primary/40 outline-none transition-all duration-500 tabular-nums"
                value={form.display_order}
                onChange={(e) => update("display_order", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Status Switch Card */}
          {/*<div 
            onClick={() => update("is_active", !form.is_active)}
            className={`flex items-center justify-between p-8 rounded-[2rem] border transition-all duration-500 cursor-pointer group
              ${form.is_active ? 'bg-primary/[0.03] border-primary/20 shadow-xl shadow-primary/[0.02]' : 'bg-muted/10 border-border'}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl transition-colors duration-500 ${form.is_active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-foreground/10 text-foreground/30'}`}>
                <Activity className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[12px] font-black uppercase tracking-widest">Active Status</p>
                <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-tighter italic">
                  {form.is_active ? "Currently visible to customers" : "Hidden from main storefront"}
                </p>
              </div>
            </div>
            
            <div className={`w-14 h-7 rounded-full p-1.5 transition-colors duration-500 ${form.is_active ? 'bg-primary' : 'bg-foreground/10'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${form.is_active ? 'translate-x-7 shadow-lg scale-110' : 'translate-x-0'}`} />
            </div>
          </div>*/}
{/* Status Switch Card */}
<div 
  onClick={() => update("is_active", !form.is_active)}
  className={`flex items-center justify-between p-8 rounded-[2rem] border transition-all duration-500 cursor-pointer group
    ${form.is_active ? 'bg-primary/[0.03] border-primary/20 shadow-xl shadow-primary/[0.02]' : 'bg-muted/10 border-border'}
  `}
>
  <div className="flex items-center gap-4">
    <div className={`p-3 rounded-2xl transition-colors duration-500 ${form.is_active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-foreground/10 text-foreground/30'}`}>
      <Activity className="w-5 h-5" />
    </div>
    <div className="space-y-1">
      <p className="text-[12px] font-black uppercase tracking-widest text-foreground">Active Status</p>
      <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-tighter italic">
        {form.is_active ? "Currently visible to customers" : "Hidden from main storefront"}
      </p>
    </div>
  </div>
  
  {/* Switch Control - Đã Fix lỗi tràn */}
  <div className={`relative w-14 h-7 rounded-full p-1 transition-colors duration-500 flex items-center ${form.is_active ? 'bg-primary' : 'bg-foreground/10'}`}>
    <div 
      className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
        ${form.is_active ? 'translate-x-5' : 'translate-x-0'}
      `} 
    />
  </div>
</div>


          {/* Action Button */}
          <div className="pt-6">
            <button
              onClick={save}
              disabled={saving}
              className={`
                relative w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-700 overflow-hidden
                ${saving 
                  ? "bg-border text-foreground/20 cursor-wait" 
                  : "bg-foreground text-background hover:bg-primary hover:text-white hover:shadow-[0_25px_50px_rgba(var(--primary),0.3)] hover:-translate-y-2 active:translate-y-0.5"}
              `}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {saving ? (
                  <div className="h-4 w-4 border-2 border-foreground/20 border-t-foreground animate-spin rounded-full" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Commit Update
                  </>
                )}
              </div>
              {/* Shimmer Effect */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}








