// src/app/(app)/admin/categories/[id]/page.tsx

/*
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<Category>({
    id: "",
    name: "",
    slug: "",
    parent_id: null,
    display_order: 0,
    is_active: true,
  });

  // =========================
  // Load category
  // =========================
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/categories/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        alert("Failed to load category");
        return;
      }

      const json = await res.json();

      setForm(json.data);
      setLoading(false);
    }

    load();
  }, [id]);

  // =========================
  // Update field
  // =========================
  function updateField(field: keyof Category, value: any) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // =========================
  // Save
  // =========================
  async function save() {
    setSaving(true);

    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      alert("Update failed");
      return;
    }

    alert("Updated successfully");
    router.refresh();
  }

  // =========================
  // Delete
  // =========================
  async function remove() {
    if (!confirm("Delete this category?")) return;

    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    router.push("/admin/categories");
  }

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-10 space-y-6">

      <h1 className="text-2xl font-bold">
        Edit Category
      </h1>

 
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Name
        </label>

        <input
          className="w-full border rounded p-2"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>

 
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Slug
        </label>

        <input
          className="w-full border rounded p-2"
          value={form.slug}
          onChange={(e) => updateField("slug", e.target.value)}
        />
      </div>

   
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Parent ID
        </label>

        <input
          className="w-full border rounded p-2"
          value={form.parent_id ?? ""}
          onChange={(e) =>
            updateField("parent_id", e.target.value || null)
          }
        />
      </div>


      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Display order
        </label>

        <input
          type="number"
          className="w-full border rounded p-2"
          value={form.display_order}
          onChange={(e) =>
            updateField("display_order", Number(e.target.value))
          }
        />
      </div>


      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) =>
            updateField("is_active", e.target.checked)
          }
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
          onClick={() => router.push("/admin/categories")}
          className="px-6 py-2 border rounded"
        >
          Back
        </button>

      </div>

    </div>
  );
}
*/



"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import slugify from "slugify"; // 👈 Thêm thư viện
import { ArrowLeft, Save, Trash2, Hash, Layers, LayoutGrid, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Trạng thái để kiểm soát việc auto-slug
  const [isSlugManual, setIsSlugManual] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    slug: "",
    parent_id: null,
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/categories/${id}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        setForm(json.data);
      } catch (err) {
        console.error("Failed to load");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // ==========================================
  // Logic Slugify thông minh
  // ==========================================
  function handleNameChange(newName: string) {
    setForm(prev => {
      const updated = { ...prev, name: newName };
      
      // Chỉ tự động đổi slug nếu Admin chưa can thiệp thủ công vào ô Slug
      if (!isSlugManual) {
        updated.slug = slugify(newName, {
          lower: true,
          strict: true,
          locale: "vi",
        });
      }
      return updated;
    });
  }

  function handleSlugChange(newSlug: string) {
    setIsSlugManual(true); // Đánh dấu là đã can thiệp thủ công
    setForm(prev => ({ ...prev, slug: newSlug }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) router.refresh();
  }

  async function remove() {
    if (!confirm("Xác nhận xóa danh mục này?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/categories");
  }

  if (loading) return <div className="p-12 animate-pulse bg-border/20 rounded-[2.5rem] max-w-2xl mx-auto mt-20 h-96" />;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 animate-fade-in">
      <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
        <Link href="/admin/categories" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-all">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </Link>
        <button onClick={remove} className="p-2 text-foreground/10 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-card border border-border rounded-[2.5rem] shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="p-8 md:p-12 pb-6 space-y-2">
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase italic flex items-center gap-3">
            Update Category <span className="text-primary">.</span>
          </h1>
          <p className="text-[10px] font-bold text-foreground/30 tracking-[0.3em] uppercase italic">
            Ref: {form.id.slice(0, 8)}...
          </p>
        </div>

        <div className="p-8 md:p-12 pt-0 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            {/* NAME INPUT */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                <Layers className="w-3 h-3 text-primary" /> Tên danh mục
              </label>
              <input
                className="w-full bg-background border border-border px-5 py-4 rounded-2xl text-sm font-bold focus:ring-8 focus:ring-primary/5 focus:border-primary/40 outline-none transition-all duration-300"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            {/* SLUG INPUT */}
            <div className="space-y-2 relative group">
              <label className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40">
                <div className="flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Đường dẫn (Slug)
                </div>
                {/* Badge trạng thái slug */}
                {!isSlugManual ? (
                  <span className="flex items-center gap-1 text-[8px] text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full animate-pulse">
                    <Sparkles className="w-2 h-2" /> Auto-generating
                  </span>
                ) : (
                  <button 
                    onClick={() => setIsSlugManual(false)}
                    className="text-[8px] text-orange-500 hover:underline"
                  >
                    Reset to auto
                  </button>
                )}
              </label>
              <input
                className={`w-full bg-background border px-5 py-4 rounded-2xl text-sm font-mono focus:ring-8 focus:ring-primary/5 outline-none transition-all duration-300 ${
                  isSlugManual ? "border-orange-500/30 text-orange-600" : "border-border text-primary italic"
                }`}
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
              />
            </div>
          </div>

          {/* ... Các trường Parent ID, Display Order, Active Switch giữ nguyên như bản trước ... */}
                   {/* Parent & Order Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                <LayoutGrid className="w-3 h-3" /> Danh mục cha
              </label>
              <input
                placeholder="UUID hoặc null"
                className="w-full bg-background border border-border px-5 py-4 rounded-2xl text-[11px] font-mono focus:ring-8 focus:ring-primary/5 focus:border-primary/40 outline-none transition-all"
                value={form.parent_id ?? ""}
                onChange={(e) => updateField("parent_id", e.target.value || null)}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                Display Order
              </label>
              <input
                type="number"
                className="w-full bg-background border border-border px-5 py-4 rounded-2xl text-sm font-black focus:ring-8 focus:ring-primary/5 focus:border-primary/40 outline-none transition-all tabular-nums"
                value={form.display_order}
                onChange={(e) => updateField("display_order", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Active Switch */}
          <div 
            onClick={() => updateField("is_active", !form.is_active)}
            className="flex items-center justify-between p-6 rounded-3xl border border-border bg-background/50 cursor-pointer hover:border-primary/20 transition-all group"
          >
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-widest">Trạng thái hoạt động</p>
              <p className="text-[10px] text-foreground/30 font-medium">Hiện/Ẩn danh mục này trên giao diện người dùng</p>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-500 ${form.is_active ? 'bg-primary' : 'bg-foreground/10'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-500 ${form.is_active ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
          <div className="pt-8 border-t border-border/50">
            <button
              onClick={save}
              disabled={saving}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all duration-500
                ${saving 
                  ? "bg-border text-foreground/20 cursor-not-allowed" 
                  : "bg-foreground text-background hover:bg-primary hover:text-white hover:shadow-[0_20px_40px_rgba(var(--primary),0.25)] active:scale-[0.98]"}`}
            >
              {saving ? "Updating..." : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}







