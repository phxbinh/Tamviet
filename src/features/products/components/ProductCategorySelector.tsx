"use client";

import { useEffect, useState } from "react";

export default function ProductCategorySelector({ id }: { id: string }) {

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {

    const res = await fetch(`/api/products/${id}/product-categories`);
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

    await fetch(`/api/products/${id}/product-categories`, {
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