// UI page for admin
"use client";

import { useEffect, useState } from "react";

export default function CrossSellManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [sourceId, setSourceId] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

/*
  // load all categories
  useEffect(() => {
    fetch("/api/admin/categories")
      .then(res => res.json())
      .then(setCategories);
  }, []);

  // load cross-sell khi chọn source
  useEffect(() => {
    if (!sourceId) return;

    fetch(`/api/admin/category-cross-sell?sourceId=${sourceId}`)
      .then(res => res.json())
      .then(data => {
        setSelected(data.map((d: any) => d.id));
      });
  }, [sourceId]);
*/

useEffect(() => {
  fetch("/api/admin/categories")
    .then(res => {
      if (!res.ok) throw new Error("Failed categories");
      return res.json();
    })
    .then(data => {
      const list = Array.isArray(data) ? data : data.data || [];
      setCategories(list);
    })
    .catch(console.error);
}, []);

useEffect(() => {
  if (!sourceId) return;

  fetch(`/api/admin/category-cross-sell?sourceId=${sourceId}`)
    .then(res => res.json())
    .then(data => {
      const list = Array.isArray(data) ? data : data.data || [];
      setSelected(list.map((d: any) => d.id));
    })
    .catch(console.error);
}, [sourceId]);





  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const save = async () => {
    await fetch("/api/admin/category-cross-sell", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceCategoryId: sourceId,
        targetCategoryIds: selected,
      }),
    });

    alert("Saved!");
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Cross-sell Manager</h2>

      {/* Select source */}
      <select
        value={sourceId}
        onChange={e => setSourceId(e.target.value)}
        className="border p-2"
      >
        <option value="">Chọn category</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Target list */}
      <div className="grid grid-cols-2 gap-2">
        {categories.
        .filter(c => c.id !== sourceId) // Ngăn chặn việc chọn chính target
        .map(c => (
          <label key={c.id} className="flex gap-2">
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              onChange={() => toggle(c.id)}
            />
            {c.name}
          </label>
        ))}
      </div>

      <button
        onClick={save}
        className="bg-black text-white px-4 py-2"
      >
        Save
      </button>
    </div>
  );
}