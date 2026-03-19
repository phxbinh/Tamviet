"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function CategoryToolbar() {
  const router = useRouter();
  const params = useSearchParams();

  const updateParam = (key: string, value?: string) => {
    const newParams = new URLSearchParams(params.toString());

    if (!value) newParams.delete(key);
    else newParams.set(key, value);

    // 🔥 reset page khi filter
    newParams.delete("page");

    router.push(`?${newParams.toString()}`);
  };

  const toggleMulti = (key: string, val: string) => {
    const current = params.get(key)?.split(",") || [];

    let next;
    if (current.includes(val)) {
      next = current.filter((v) => v !== val);
    } else {
      next = [...current, val];
    }

    updateParam(key, next.join(","));
  };

  return (
    <div className="flex flex-col gap-4 mb-6 border p-4 rounded-lg">

      {/* SEARCH */}
      <input
        placeholder="Search..."
        defaultValue={params.get("search") || ""}
        onChange={(e) => updateParam("search", e.target.value)}
        className="border px-3 py-2 text-sm"
      />

      {/* PRICE */}
      <div className="flex gap-2">
        <input
          placeholder="Min"
          onChange={(e) => updateParam("min", e.target.value)}
          className="border px-2 py-1 text-sm w-20"
        />
        <input
          placeholder="Max"
          onChange={(e) => updateParam("max", e.target.value)}
          className="border px-2 py-1 text-sm w-20"
        />
      </div>

      {/* SORT */}
      <select
        defaultValue={params.get("sort") || "newest"}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="border px-2 py-2 text-sm"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price ↑</option>
        <option value="price_desc">Price ↓</option>
      </select>

      {/* COLOR */}
      <div>
        <p className="text-xs font-bold mb-1">Color</p>
        <div className="flex gap-2">
          {["red", "blue", "black"].map((c) => {
            const active = params.get("color")?.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleMulti("color", c)}
                className={`px-2 py-1 border text-xs ${
                  active ? "bg-black text-white" : ""
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* SIZE */}
      <div>
        <p className="text-xs font-bold mb-1">Size</p>
        <div className="flex gap-2">
          {["s", "m", "l"].map((s) => {
            const active = params.get("size")?.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleMulti("size", s)}
                className={`px-2 py-1 border text-xs ${
                  active ? "bg-black text-white" : ""
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}