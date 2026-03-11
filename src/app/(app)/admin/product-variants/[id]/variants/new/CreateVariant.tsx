
//sec/app/(app)/admin/product-variants/[id]/variants/new/CreateVariant.tsx
"use client";

import { useState } from "react";

type Attribute = {
  id: string;
  code: string;
  name: string;
  type: string;
  values: { id: string; value: string }[];
};

export default function VariantManager({
  productId,
  attributes,
}: {
  productId: string;
  attributes: Attribute[];
}) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [sku, setSku] = useState("");          // ← Thêm state cho SKU
  const [title, setTitle] = useState("");      // ← Thêm state cho Title
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleSelect(attributeId: string, valueId: string) {
    setSelected((prev) => ({
      ...prev,
      [attributeId]: valueId,
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    setMessage("");

    const attribute_value_ids = Object.values(selected);

    if (attribute_value_ids.length !== attributes.length) {
      setMessage("Bạn phải chọn đầy đủ thuộc tính");
      setLoading(false);
      return;
    }

    if (!sku.trim() || !title.trim()) {
      setMessage("SKU và Title không được để trống");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/admin/product-variants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        sku,                // ← Thêm sku
        title,              // ← Thêm title
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        attribute_value_ids,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Lỗi khi tạo variant");
    } else {
      setMessage("Variant đã tạo thành công!");
      setSelected({});
      setSku("");           // Reset
      setTitle("");         // Reset
      setPrice("");
      setStock("0");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">

      {/* Attributes selectors – giữ nguyên */}
      <div className="border p-4 rounded space-y-4">
        <h2 className="font-semibold">Thuộc tính</h2>
        <pre className="text-sm p-4 rounded overflow-auto">
          {JSON.stringify(attributes, null, 2)}
        </pre>

        {attributes.map((attr) => (
          <div key={attr.id}>
            <label className="block mb-2 font-medium">{attr.name}</label>
            <select
              value={selected[attr.id] || ""}
              onChange={(e) => handleSelect(attr.id, e.target.value)}
              className="border px-3 py-2 w-full rounded"
            >
              <option value="">Chọn {attr.name}</option>
              {attr.values.map((val) => (
                <option key={val.id} value={val.id}>
                  {val.value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Pricing + SKU + Title */}
      <div className="border p-4 rounded space-y-4">
        <h2 className="font-semibold">Thông tin variant</h2>

        {/* Thêm SKU */}
        <div>
          <label className="block mb-1 font-medium">SKU</label>
          <input
            type="text"
            placeholder="Ví dụ: SHIRT-RED-M-001"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>

        {/* Thêm Title */}
        <div>
          <label className="block mb-1 font-medium">Title (Tên variant)</label>
          <input
            type="text"
            placeholder="Ví dụ: Áo thun đỏ size M"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>

        {/* Giá và Stock */}
        <div>
          <label className="block mb-1 font-medium">Giá</label>
          <input
            type="number"
            placeholder="Giá bán"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border px-3 py-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tồn kho</label>
          <input
            type="number"
            placeholder="Số lượng tồn"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border px-3 py-2 w-full rounded"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Đang tạo..." : "Tạo Variant"}
        </button>

        {message && (
          <p className={`text-sm mt-2 ${message.includes("thành công") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
