
// src/app/(app)/admin/products/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { 
  ChevronLeft, 
  Save, 
  Settings2, 
  History, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Loader2, 
  AlertTriangle 
} from "lucide-react"

/*
interface Product {
  id: string
  name: string
  slug: string
  product_type: string
  short_description: string | null
  description: string | null
  status: "draft" | "active" | "archived"
}
*/
interface Product {
  id: string
  name: string
  slug: string
  product_type_id: string
  product_type_name: string
  short_description: string | null
  description: string | null
  status: "draft" | "active" | "archived"
}






type ProductType = {
  id: string
  code: string
  name: string
}


export default function ProductDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [types, setTypes] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)


  // Fetch Product
  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`)

        if (!res.ok) throw new Error("Failed to fetch product")

        const data = await res.json()
        setProduct(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Fetch Product Types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("/api/admin/product-types")

        const data = await res.json()

        if (!res.ok)
          throw new Error(data.error || "Failed to load product types")

        setTypes(data)
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchTypes()
  }, [])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!product) return
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!product) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      if (!res.ok) throw new Error("Synchronization failed")
      const updated = await res.json()
      setProduct(updated)
      // Thay thế alert bằng hiệu ứng nhẹ nhàng hơn hoặc thông báo hệ thống
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">Decrypting Asset Data...</p>
    </div>
  )

  if (!product) return (
    <div className="p-20 text-center animate-shake">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-black uppercase tracking-widest">Asset Not Found</h2>
      <Link href="/admin/products" className="text-primary underline text-xs mt-4 block uppercase font-bold tracking-widest">Return to Fleet</Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 animate-fade-in custom-scrollbar">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-border pb-8">
        <div className="space-y-2">
          <Link href="/admin/products" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all">
            <ChevronLeft className="w-3 h-3" /> Back to Assets
          </Link>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
            <Settings2 className="w-8 h-8 text-primary animate-breathe-slow" />
            Asset Configuration
          </h1>
          <div className="flex items-center gap-4 pt-1">
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 font-bold border border-primary/20 uppercase tracking-widest">
              ID: {product.id.slice(0, 8)}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <Activity className="w-3 h-3 text-neon-cyan" /> System Active
            </span>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 md:flex-none bg-primary text-white px-8 py-3 rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-90 active:translate-y-0.5 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Syncing..." : "Apply Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: PRIMARY INTEL */}
        <div className="lg:col-span-2 space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 text-red-500 text-[10px] font-black uppercase tracking-widest animate-shake flex items-center gap-3">
              <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}

          <section className="bg-card border border-border p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Cpu className="w-20 h-20" />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 border-l-4 border-primary pl-4">Identification Parameters</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asset Designation</label>
                  <input
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    className="w-full bg-background border border-border px-4 py-3 text-sm font-bold tracking-tight focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">System Slug (ReadOnly)</label>
                  <input
                    name="slug"
                    value={product.slug}
                    onChange={handleChange}
                    className="w-full bg-muted/20 border border-border px-4 py-3 text-xs font-mono text-muted-foreground outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Classification</label>
                {/*<select
                  name="product_type"
                  value={product.product_type || ""}
                  onChange={handleChange}
                  className="w-full bg-background border border-border px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] focus:border-primary outline-none cursor-pointer"
                > 
                  <option value="">{product.product_type}</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.code}>{type.name.toUpperCase()}</option>
                  ))}
                </select>*/}

<select
  name="product_type_id"
  value={product.product_type_id || ""}
  onChange={handleChange}
  className="w-full bg-background border border-border px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] focus:border-primary outline-none cursor-pointer"
>
{/*
  <option value="" disabled>
    {product.product_type_name}
  </option>*/}

  {types.map((type) => (
    <option key={type.id} value={type.id}>
      {type.name.toUpperCase()}
    </option>
  ))}
</select>


              </div>
            </div>
          </section>

          <section className="bg-card border border-border p-6 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 border-l-4 border-primary pl-4">Tactical Descriptions</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Short Intelligence Brief</label>
                <textarea
                  name="short_description"
                  value={product.short_description ?? ""}
                  onChange={handleChange}
                  className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-primary outline-none min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Main Specifications</label>
                <textarea
                  name="description"
                  value={product.description ?? ""}
                  rows={8}
                  onChange={handleChange}
                  className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-primary outline-none custom-scrollbar"
                />
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: OPERATIONAL CONTROLS */}
        <div className="space-y-6">
          <section className="bg-card border border-border p-6 shadow-lg sticky top-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 border-b border-border pb-4">Operational Status</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current State</label>
                <select
                  name="status"
                  value={product.status}
                  onChange={handleChange}
                  className={`w-full border px-4 py-4 text-[10px] font-black uppercase tracking-[0.3em] outline-none cursor-pointer transition-all ${
                    product.status === 'active' ? 'bg-neon-cyan/5 border-neon-cyan text-neon-cyan' : 
                    product.status === 'draft' ? 'bg-yellow-500/5 border-yellow-500/50 text-yellow-600' : 
                    'bg-muted/20 border-border text-muted-foreground'
                  }`}
                >
                  <option value="draft">DRAFT / STANDBY</option>
                  <option value="active">ACTIVE / DEPLOYED</option>
                  <option value="archived">ARCHIVED / OFFLINE</option>
                </select>
              </div>

              <div className="p-4 bg-muted/20 border border-border space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3 text-primary" /> Authority Check
                </div>
                <p className="text-[9px] leading-relaxed text-muted-foreground uppercase font-medium">
                  Mọi thay đổi sẽ được ghi nhật ký vào hệ thống trung tâm. Hãy đảm bảo tính chính xác của dữ liệu trước khi Sync.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-3 text-muted-foreground opacity-50">
                <History className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Modified: 2 minutes ago</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
