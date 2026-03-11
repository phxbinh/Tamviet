// src/components/product-variants/VariantForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Save, 
  Loader2, 
  Tag, 
  Banknote, 
  Box, 
  ArrowLeft,
  Fingerprint,
  RefreshCcw
} from "lucide-react";

export default function VariantForm({
  productId,
  variantId,
}: {
  productId: string;
  variantId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!variantId);
  const [form, setForm] = useState({
    sku: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    if (!variantId) return;
    setFetching(true);
    fetch(`/api/admin/product-variants/${variantId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          sku: data.sku || "",
          price: data.price,
          stock: data.stock,
        });
      })
      .finally(() => setFetching(false));
  }, [variantId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload: any = {
      sku: form.sku,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (!variantId) {
      payload.product_id = productId;
      payload.attribute_value_ids = []; 
    }

    const url = variantId
      ? `/api/admin/product-variants/${variantId}`
      : `/api/admin/product-variants`;

    const res = await fetch(url, {
      method: variantId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push(`/admin/product-variants/${productId}/variants`);
      router.refresh();
    } else {
      alert("Hệ thống: Thao tác thất bại.");
      setLoading(false);
    }
  }

  if (fetching) return (
    <div className="flex items-center gap-3 py-12 text-muted-foreground animate-pulse">
      <RefreshCcw className="w-4 h-4 animate-spin" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em]">Retrieving Parameters...</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl animate-fade-in">
      {/* SECTION: IDENTIFIER */}
      <div className="bg-card border border-border p-6 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Fingerprint className="w-12 h-12" />
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Tag className="w-3 h-3" /> SKU Identity
            </label>
            <input
              placeholder="ENTER SKU..."
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="w-full bg-background border border-border px-4 py-3 text-xs font-mono font-bold tracking-widest focus:border-primary outline-none transition-all uppercase"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Banknote className="w-3 h-3" /> Listing Price
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-background border border-border pl-4 pr-12 py-3 text-xs font-mono font-bold focus:border-primary outline-none transition-all"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30 tracking-tighter">VND</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Box className="w-3 h-3" /> Inventory Stock
              </label>
              <input
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full bg-background border border-border px-4 py-3 text-xs font-mono font-bold focus:border-primary outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-8 py-3.5 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {variantId ? "Execute Update" : "Deploy Variant"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
        >
          Abort Mission
        </button>
      </div>
    </form>
  );
}
