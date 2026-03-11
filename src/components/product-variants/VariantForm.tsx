// src/components/product-variants/VariantForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VariantForm({
  productId,
  variantId,
}: {
  productId: string;
  variantId?: string;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    sku: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    if (!variantId) return;

    fetch(`/api/admin/product-variants/${variantId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          sku: data.sku || "",
          price: data.price,
          stock: data.stock,
        });
      });
  }, [variantId]);

async function handleSubmit(e: any) {
  e.preventDefault();

  const payload: any = {
    sku: form.sku,
    price: Number(form.price),
    stock: Number(form.stock),
  };

  // chỉ gửi product_id khi create
  if (!variantId) {
    payload.product_id = productId;
    payload.attribute_value_ids = []; // create bắt buộc có
  }

  const url = variantId
    ? `/api/admin/product-variants/${variantId}`
    : `/api/admin/product-variants`;

  const method = variantId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
    if (res.ok) {
      router.push(`/admin/product-variants/${productId}/variants`);
      router.refresh();
    } else {
      alert("Save failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        placeholder="SKU"
        value={form.sku}
        onChange={(e) =>
          setForm({ ...form, sku: e.target.value })
        }
        className="border p-2 w-full"
      />

      <input
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
        className="border p-2 w-full"
      />

      <input
        placeholder="Stock"
        type="number"
        value={form.stock}
        onChange={(e) =>
          setForm({ ...form, stock: e.target.value })
        }
        className="border p-2 w-full"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {variantId ? "Update" : "Create"}
      </button>
    </form>
  );
}