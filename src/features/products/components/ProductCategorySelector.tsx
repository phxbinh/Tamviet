
/*
"use client";

import { useEffect, useState } from "react";

export default function ProductCategorySelector({ id }: { id: string }) {

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);


//src/app/api/admin/products/[id]/product-categories/route.ts

  async function loadCategories() {

    const res = await fetch(`/api/admin/products/${id}/product-categories`);
    const json = await res.json();

    setCategories(json.data);
  }

  function toggle(id: string) {

    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, selected: !c.selected } : c
      )
    );
  }

  async function save() {

    const selected = categories
      .filter((c) => c.selected)
      .map((c) => c.id);

    await fetch(`/api/admin/products/${id}/product-categories`, {
      method: "PUT",
      body: JSON.stringify({
        category_ids: selected
      })
    });

    alert("Saved");
  }

  return (
    <div className="space-y-2">

      <h3 className="font-semibold">Categories</h3>

      {categories.map((c) => (

        <label
          key={c.id}
          className="flex gap-2 items-center"
        >

          <input
            type="checkbox"
            checked={c.selected}
            onChange={() => toggle(c.id)}
          />

          {c.name}

        </label>

      ))}

      <button
        onClick={save}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Save Categories
      </button>

    </div>
  );
}
*/

/*
"use client";

import { useEffect, useState } from "react";

export default function ProductCategorySelector({ id }: { id: string }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await fetch(`/api/admin/products/${id}/product-categories`);
      const json = await res.json();
      setCategories(json.data);
    } finally {
      setLoading(false);
    }
  }

  function toggle(id: string) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, selected: !c.selected } : c
      )
    );
  }

  async function save() {
    setIsSaving(true);
    try {
      const selected = categories.filter((c) => c.selected).map((c) => c.id);
      await fetch(`/api/admin/products/${id}/product-categories`, {
        method: "PUT",
        body: JSON.stringify({ category_ids: selected }),
      });
      // Thay thế alert bằng một hiệu ứng nhẹ nhàng hoặc toast nếu bạn có
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) return <div className="h-20 w-full bg-border/20 animate-pulse rounded-xl" />;

  return (
    <div className="space-y-4 p-4 rounded-2xl border border-border bg-card shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold tracking-tight text-foreground/80">Categories</h3>
        <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
          {categories.filter(c => c.selected).length} selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => toggle(c.id)}
            className={`
              group relative flex items-center px-4 py-2 rounded-full border transition-all duration-300 active:scale-95
              ${c.selected 
                ? "bg-primary border-primary text-white shadow-[0_0_15px_-3px_rgba(var(--primary),0.4)]" 
                : "bg-background border-border text-foreground/60 hover:border-primary/50 hover:text-primary"}
            `}
          >
            <span className="text-sm font-medium">{c.name}</span>
            {c.selected && (
               <span className="ml-2 animate-fade-in">✓</span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={save}
        disabled={isSaving}
        className={`
          w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold uppercase tracking-wider text-sm transition-all duration-300
          ${isSaving 
            ? "bg-border text-foreground/40 cursor-not-allowed animate-breathe-slow" 
            : "bg-foreground text-background hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"}
        `}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
*/


"use client";

import { useEffect, useState, useMemo } from "react";

interface Category {
  id: string;
  name: string;
  selected: boolean;
}

export default function ProductCategorySelector({ id }: { id: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCategories();
  }, [id]);

  async function loadCategories() {
    try {
      const res = await fetch(`/api/admin/products/${id}/product-categories`);
      const json = await res.json();
      setCategories(json.data);
    } finally {
      setLoading(false);
    }
  }

  // Nhóm theo chữ cái đầu tiên để tạo sự ngăn nắp
  const groupedByAlpha = useMemo(() => {
    const filtered = categories.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.reduce((acc: Record<string, Category[]>, curr) => {
      const firstLetter = curr.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(curr);
      return acc;
    }, {});
  }, [categories, searchTerm]);

  const toggle = (catId: string) => {
    setCategories(prev => 
      prev.map(c => c.id === catId ? { ...c, selected: !c.selected } : c)
    );
  };

  async function save() {
    setIsSaving(true);
    try {
      const selectedIds = categories.filter(c => c.selected).map(c => c.id);
      await fetch(`/api/admin/products/${id}/product-categories`, {
        method: "PUT",
        body: JSON.stringify({ category_ids: selectedIds }),
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) return (
    <div className="p-8 space-y-6 animate-pulse bg-card rounded-2xl border border-border">
      <div className="h-4 w-40 bg-border/50 rounded" />
      <div className="flex gap-2">
        {[1, 2, 3].map(i => <div key={i} className="h-10 w-24 bg-border/30 rounded-full" />)}
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col gap-6 p-1 bg-card rounded-3xl border border-border overflow-hidden shadow-2xl shadow-primary/5 transition-all duration-500">
      
      {/* Header Panel */}
      <div className="p-6 pb-0 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase">
              Phân loại <span className="text-primary">.</span>
            </h3>
            <p className="text-[10px] font-bold text-foreground/30 tracking-[0.3em] uppercase">
              Product Category Assignment
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-primary/20 tabular-nums">
              {categories.filter(c => c.selected).length.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Search Bar "Mềm mại" */}
        <div className="relative group">
          <input 
            type="text"
            placeholder="Tìm tên danh mục..."
            className="w-full pl-5 pr-12 py-4 rounded-2xl bg-background border border-border focus:border-primary/50 text-sm font-medium transition-all duration-500 outline-none focus:ring-[8px] focus:ring-primary/5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
          </div>
        </div>
      </div>

      {/* Body: Danh sách cuộn */}
      <div className="px-6 py-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        <div className="space-y-10">
          {Object.entries(groupedByAlpha).length > 0 ? (
            Object.entries(groupedByAlpha).sort().map(([letter, items]) => (
              <div key={letter} className="relative animate-fade-in">
                {/* Letter Header */}
                <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md py-2 mb-4 flex items-center gap-4">
                  <span className="text-sm font-black text-primary">{letter}</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-border to-transparent" />
                </div>
                
                {/* Category Chips */}
                <div className="flex flex-wrap gap-2">
                  {items.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggle(cat.id)}
                      className={`
                        group relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 active:scale-95 border
                        ${cat.selected 
                          ? "bg-foreground border-foreground text-background shadow-xl" 
                          : "bg-background border-border text-foreground/40 hover:border-primary hover:text-primary"}
                      `}
                    >
                      {cat.name}
                      {cat.selected && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center animate-breathe-slow">
              <p className="text-sm font-bold text-foreground/20 uppercase tracking-[0.2em]">Không có dữ liệu</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-4 bg-background/50 backdrop-blur-xl border-t border-border flex items-center gap-4">
        <button
          onClick={save}
          disabled={isSaving}
          className={`
            relative flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all duration-500
            ${isSaving 
              ? "bg-border text-foreground/20 cursor-wait" 
              : "bg-primary text-white hover:shadow-[0_20px_40px_rgba(var(--primary),0.3)] hover:-translate-y-1 active:translate-y-0.5"}
          `}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2 animate-breathe-fast">
              Saving Status...
            </span>
          ) : (
            "Update Categories"
          )}
          
          {/* Hiệu ứng tia sáng chạy qua khi hover */}
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        </button>
      </div>
    </div>
  );
}












