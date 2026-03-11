
// src/app/(app)/admin/product-variants/[id]/variants/new/CreateVariant.tsx
"use client";

import { useState } from "react";
import { 
  Dna, 
  Settings2, 
  Tag, 
  Banknote, 
  Box, 
  Plus, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Fingerprint
} from "lucide-react";

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
  const [sku, setSku] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | null }>({ text: '', type: null });

  function handleSelect(attributeId: string, valueId: string) {
    setSelected((prev) => ({ ...prev, [attributeId]: valueId }));
  }

  async function handleSubmit() {
    setLoading(true);
    setMessage({ text: '', type: null });

    const attribute_value_ids = Object.values(selected);

    if (attribute_value_ids.length !== attributes.length) {
      setMessage({ text: "Vui lòng cấu hình đầy đủ DNA thuộc tính", type: 'error' });
      setLoading(false);
      return;
    }

    if (!sku.trim() || !title.trim()) {
      setMessage({ text: "SKU và Title là định danh bắt buộc", type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/product-variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          sku,
          title,
          price: Number(price) || 0,
          stock: Number(stock) || 0,
          attribute_value_ids,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Lỗi hệ thống khi tạo variant");
      }

      setMessage({ text: "Khởi tạo Variant thành công!", type: 'success' });
      setSelected({});
      setSku("");
      setTitle("");
      setPrice("");
      setStock("0");
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      
      {/* SECTION 1: DNA ATTRIBUTES */}
      <div className="space-y-6">
        <div className="bg-card border border-border p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Dna className="w-16 h-16" />
          </div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 border-l-4 border-primary pl-4 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" />
            DNA Configuration
          </h2>
          
          <div className="space-y-5">
            {attributes.map((attr) => (
              <div key={attr.id} className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  {attr.name}
                </label>
                <select
                  value={selected[attr.id] || ""}
                  onChange={(e) => handleSelect(attr.id, e.target.value)}
                  className="w-full bg-background border border-border px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] focus:border-primary outline-none cursor-pointer transition-all hover:bg-muted/30"
                >
                  <option value="">-- CHỌN {attr.name.toUpperCase()} --</option>
                  {attr.values.map((val) => (
                    <option key={val.id} value={val.id}>
                      {val.value.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: OPERATIONAL SPECS */}
      <div className="space-y-6">
        <div className="bg-card border border-border p-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 border-l-4 border-primary pl-4 flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-primary" />
            Operational Specs
          </h2>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Tag className="w-3 h-3" /> SKU Identity
                </label>
                <input
                  placeholder="VD: SHIRT-RED-M-001"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-3 text-[11px] font-mono font-bold tracking-widest focus:border-primary outline-none transition-all uppercase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Variant Title
                </label>
                <input
                  placeholder="Áo thun đỏ size M"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-3 text-[11px] font-black uppercase tracking-widest focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Banknote className="w-3 h-3" /> Giá Niêm Yết
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-3 text-[11px] font-mono font-bold focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Box className="w-3 h-3" /> Tồn Kho
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-3 text-[11px] font-mono font-bold focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-white py-4 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-primary/20 active:translate-y-0.5 mt-4"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {loading ? "INITIALIZING..." : "Deploy Variant"}
            </button>

            {message.text && (
              <div className={`p-4 border-l-4 animate-shake flex items-center gap-3 ${
                message.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-600' : 'bg-red-500/10 border-red-500 text-red-600'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <p className="text-[10px] font-black uppercase tracking-widest">{message.text}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
