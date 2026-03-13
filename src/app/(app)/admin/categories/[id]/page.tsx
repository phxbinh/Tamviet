// wait finish (SẼ XOÁ ĐI CHỈ ĐỂ TẠM)
// src/app/(app)/admin/products/page.tsx
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

      {/* Name */}
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

      {/* Slug */}
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

      {/* Parent */}
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

      {/* Display order */}
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

      {/* Active */}
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

      {/* Buttons */}
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