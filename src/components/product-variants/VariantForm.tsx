// src/components/product-variants/VariantForm.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Save, Loader2, Dna, Fingerprint, 
  Tag, Banknote, Box, CheckCircle2, AlertTriangle 
} from "lucide-react";

type Attribute = {
  id: string;
  code: string;
  name: string;
  values: { id: string; value: string }[];
};

export default function VariantForm({
  productId,
  variantId,
}: {
  productId: string;
  variantId?: string;
}) {
  const router = useRouter();
  const isEdit = !!variantId;

  // States
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ sku: "", title: "", price: "", stock: "0" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | null }>({ text: '', type: null });

  // Load Attributes & Variant Data
  useEffect(() => {
    async function initData() {
      try {
        // 1. Fetch Attributes của Product Type này
        const attrRes = await fetch(`/api/admin/attributes-by-product/${productId}`);
        const attrData = await attrRes.json();
        setAttributes(attrData);

        // 2. Nếu là Edit, fetch data của Variant
        if (isEdit) {
          const varRes = await fetch(`/api/admin/product-variants/${variantId}`);
          const varData = await varRes.json();
          
          setForm({
            sku: varData.sku || "",
            title: varData.title || "",
            price: String(varData.price || ""),
            stock: String(varData.stock || "0"),
          });

          // Map selected attributes
          const map: Record<string, string> = {};
          attrData.forEach((attr: Attribute) => {
            const found = attr.values.find((v) => varData.attribute_value_ids?.includes(v.id));
            if (found) map[attr.id] = found.id;
          });
          setSelected(map);
        }
      } catch (err) {
        setMessage({ text: "Lỗi đồng bộ dữ liệu hệ thống", type: 'error' });
      } finally {
        setFetching(false);
      }
    }
    initData();
  }, [productId, variantId, isEdit]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: null });

    const attribute_value_ids = Object.values(selected);
    if (attribute_value_ids.length !== attributes.length) {
      setMessage({ text: "DNA cấu hình chưa hoàn thiện (Thiếu thuộc tính)", type: 'error' });
      setLoading(false);
      return;
    }

    const payload = {
      product_id: productId,
      sku: form.sku,
      title: form.title,
      price: Number(form.price),
      stock: Number(form.stock),
      attribute_value_ids,
    };

    try {
      const url = isEdit ? `/api/admin/product-variants/${variantId}` : `/api/admin/product-variants`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({ text: isEdit ? "Cập nhật Protocol thành công!" : "Khởi tạo Variant thành công!", type: 'success' });
        setTimeout(() => {
          router.push(`/admin/product-variants/${productId}/variants`);
          router.refresh();
        }, 1000);
      } else {
        const err = await res.json();
        throw new Error(err.error || "Thao tác thất bại");
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return (
    <div className="p-20 flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Đang truy xuất Registry...</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* CỘT TRÁI: DNA ATTRIBUTES */}
      <div className="bg-card border border-border p-6 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Dna className="w-16 h-16" />
        </div>
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 border-l-4 border-primary pl-4 flex items-center gap-2">
          Cấu hình DNA Thuộc tính
        </h2>
        
        <div className="space-y-5">
          {attributes.map((attr) => (
            <div key={attr.id} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                {attr.name}
              </label>
              <select
                disabled={isEdit} // Thường SKU gắn liền với thuộc tính, hạn chế sửa nếu đã có data
                value={selected[attr.id] || ""}
                onChange={(e) => setSelected({...selected, [attr.id]: e.target.value})}
                className={`w-full bg-background border border-border px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] focus:border-primary outline-none transition-all ${isEdit ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/30 cursor-pointer'}`}
              >
                <option value="">-- CHỌN {attr.name.toUpperCase()} --</option>
                {attr.values.map((val) => (
                  <option key={val.id} value={val.id}>{val.value.toUpperCase()}</option>
                ))}
              </select>
            </div>
          ))}
          {isEdit && (
            <p className="text-[9px] font-bold text-amber-600 uppercase tracking-tighter italic">
              * DNA Thuộc tính được khóa sau khi khởi tạo để bảo toàn tính nhất quán SKU.
            </p>
          )}
        </div>
      </div>

      {/* CỘT PHẢI: COMMERCIAL SPECS */}
      <div className="bg-card border border-border p-6 shadow-2xl space-y-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 border-l-4 border-primary pl-4 flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-primary" /> Thông số thương mại
        </h2>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Tag className="w-3 h-3" /> SKU Identity
            </label>
            <input
              placeholder="VD: SKU-PRO-001"
              value={form.sku}
              onChange={(e) => setForm({...form, sku: e.target.value})}
              className="w-full bg-background border border-border px-4 py-3 text-[11px] font-mono font-bold tracking-widest focus:border-primary outline-none transition-all uppercase"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tên hiển thị Variant</label>
            <input
              placeholder="VD: Phiên bản đặc biệt - Đỏ"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="w-full bg-background border border-border px-4 py-3 text-[11px] font-black uppercase tracking-widest focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Banknote className="w-3 h-3" /> Giá bán
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({...form, price: e.target.value})}
                className="w-full bg-background border border-border px-4 py-3 text-[11px] font-mono font-bold focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Box className="w-3 h-3" /> Kho hàng
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({...form, stock: e.target.value})}
                className="w-full bg-background border border-border px-4 py-3 text-[11px] font-mono font-bold focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-primary text-white py-4 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-primary/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? "Update Registry" : "Deploy Variant"}
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
    </form>
  );
}
