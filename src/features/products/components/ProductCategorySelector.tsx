
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













