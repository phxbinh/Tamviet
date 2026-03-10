"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import slugify from "slugify"
import { 
  PackagePlus, 
  ChevronLeft, 
  Terminal, 
  AlertTriangle, 
  Save, 
  Loader2,
  Fingerprint
} from "lucide-react"
import Link from "next/link"

type ProductType = {
  id: string
  code: string
  name: string
}

export default function CreateProductPage() {
  const router = useRouter()
  const [types, setTypes] = useState<ProductType[]>([])
  const [form, setForm] = useState({
    name: "",
    slug: "",
    product_type_id: "",
    short_description: "",
    description: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTypes() {
      try {
        const res = await fetch("/api/admin/product-types")
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to load product types")
        setTypes(data)
      } catch (err: any) {
        setError(err.message)
      }
    }
    fetchTypes()
  }, [])

  useEffect(() => {
    if (form.name) {
      setForm(prev => ({
        ...prev,
        slug: slugify(prev.name, { lower: true, strict: true })
      }))
    }
  }, [form.name])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create product")
      router.push(`/admin/products/${data.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in custom-scrollbar">
      {/* Nút quay lại & Header */}
      <Link 
        href="/admin/products" 
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ChevronLeft className="w-3 h-3" />
        Back to Fleet
      </Link>

      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-primary/10 border border-primary/20">
          <PackagePlus className="w-8 h-8 text-primary animate-breathe-slow" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Initialize New Asset
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Xác lập thông số tài sản chiến lược
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: THÔNG TIN CHÍNH */}
        <div className="lg:col-span-2 space-y-8">
          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 flex items-center gap-3 animate-shake">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{error}</p>
            </div>
          )}

          <section className="bg-card border border-border p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-primary" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em]">Core Parameters</h2>
            </div>

            <div className="space-y-4">
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">
                  Asset Designation (Name) *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border border-border px-4 py-3 text-sm font-bold tracking-tight focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                  placeholder="E.g. NEURAL LINK PROCESSOR X-1"
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-primary">
                  System Identifier (Slug) *
                </label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    required
                    className="w-full bg-muted/20 border border-border px-4 py-3 pl-10 text-xs font-mono tracking-tight focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border p-6 shadow-sm space-y-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4">Detailed Intel</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                  Short Briefing
                </label>
                <textarea
                  name="short_description"
                  value={form.short_description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-primary outline-none transition-all custom-scrollbar"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                  Technical Specifications (Description)
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-primary outline-none transition-all custom-scrollbar"
                />
              </div>
            </div>
          </section>
        </div>

        {/* CỘT PHẢI: CẤU HÌNH & HÀNH ĐỘNG */}
        <div className="space-y-6">
          <section className="bg-card border border-border p-6 shadow-sm sticky top-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 border-b border-border pb-4">
              Classification
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                  Asset Type *
                </label>
                <select
                  name="product_type_id"
                  value={form.product_type_id}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border border-border px-4 py-3 text-[10px] font-black uppercase tracking-widest focus:border-primary outline-none cursor-pointer hover:bg-muted/50 transition-all"
                >
                  <option value="">UNCATEGORIZED</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-6 border-t border-border">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-4 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-primary/20 group"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                  {loading ? "INITIALIZING..." : "Save Draft Asset"}
                </button>
                
                <p className="mt-4 text-[9px] text-center text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">
                  Bằng việc nhấn Save, tài sản sẽ được đưa vào hàng đợi kiểm duyệt hệ thống.
                </p>
              </div>
            </div>
          </section>
        </div>

      </form>
    </div>
  )
}
