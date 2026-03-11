"use client"

import { useEffect, useState } from "react"
import { 
  Link2, 
  Layers, 
  CheckSquare, 
  Square, 
  Save, 
  Loader2, 
  AlertCircle, 
  Info,
  Network
} from "lucide-react"

type ProductType = {
  id: string
  code: string
  name: string
}

type Attribute = {
  id: string
  code: string
  name: string
}

export default function ProductTypeAttributeManager() {
  const [types, setTypes] = useState<ProductType[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [selectedTypeCode, setSelectedTypeCode] = useState("")
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | null }>({ text: '', type: null })

  useEffect(() => {
    async function fetchData() {
      const [typesRes, attrRes] = await Promise.all([
        fetch("/api/admin/product-types"),
        fetch("/api/admin/attributes"),
      ])
      const typesData = await typesRes.json()
      const attrData = await attrRes.json()
      setTypes(typesData)
      setAttributes(attrData)
    }
    fetchData()
  }, [])

  const handleCheckboxChange = (code: string) => {
    setSelectedAttributes(prev =>
      prev.includes(code) ? prev.filter(a => a !== code) : [...prev, code]
    )
  }

  const handleSubmit = async () => {
    if (!selectedTypeCode) {
      setMessage({ text: "Please select a target product type", type: 'error' })
      return
    }
    if (selectedAttributes.length === 0) {
      setMessage({ text: "Select at least one attribute to map", type: 'error' })
      return
    }

    setLoading(true)
    setMessage({ text: '', type: null })

    try {
      const res = await fetch("/api/admin/product-type-attributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_type_code: selectedTypeCode,
          attribute_codes: selectedAttributes
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to synchronize")
      setMessage({ text: `Protocol updated: ${data.inserted} attribute(s) linked successfully`, type: 'success' })
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in space-y-8 custom-scrollbar">
      
      {/* HEADER: Sự kết nối chiến lược */}
      <div className="border-l-4 border-primary pl-6 py-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3 text-foreground">
          <Network className="w-8 h-8 text-primary animate-breathe-slow" />
          Attribute Mapping
        </h1>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">
          Thiết lập ma trận thuộc tính cho từng chủng loại tài sản
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: SELECTOR PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-card border border-border p-5 shadow-sm">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-4">
              <Layers className="w-3 h-3" /> Target Product Type
            </label>
            <select
              value={selectedTypeCode}
              onChange={(e) => setSelectedTypeCode(e.target.value)}
              className="w-full bg-background border border-border px-4 py-3 text-[11px] font-black uppercase tracking-widest focus:border-primary outline-none cursor-pointer hover:bg-muted/50 transition-all"
            >
              <option value="">-- SELECT CLASS --</option>
              {types.map(type => (
                <option key={type.id} value={type.code}>{type.name.toUpperCase()}</option>
              ))}
            </select>
            <div className="mt-4 p-4 bg-muted/20 border border-border rounded-sm">
              <p className="text-[9px] leading-relaxed text-muted-foreground uppercase font-bold tracking-tight">
                Chọn loại sản phẩm chính để bắt đầu gán các thuộc tính tương ứng từ thư viện hệ thống.
              </p>
            </div>
          </section>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-white py-4 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-primary/20 group"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />}
            {loading ? "SYNCING..." : "Save Mapping"}
          </button>

          {message.text && (
            <div className={`p-4 border-l-4 animate-shake ${
              message.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-600' : 'bg-red-500/10 border-red-500 text-red-600'
            }`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' ? <CheckSquare className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <p className="text-[10px] font-black uppercase tracking-widest">{message.text}</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: ATTRIBUTES MATRIX */}
        <div className="lg:col-span-8">
          <section className="bg-card border border-border shadow-2xl relative overflow-hidden">
            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Link2 className="w-4 h-4 text-primary" /> Available Attributes Library
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20">
                {selectedAttributes.length} SELECTED
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {attributes.map(attr => {
                const isChecked = selectedAttributes.includes(attr.code);
                return (
                  <label
                    key={attr.id}
                    className={`flex items-center gap-3 p-4 border transition-all cursor-pointer group ${
                      isChecked 
                        ? 'border-primary bg-primary/[0.03] shadow-inner shadow-primary/5' 
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(attr.code)}
                      />
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-primary animate-pulse" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground/30 group-hover:text-muted-foreground/60" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[11px] font-black uppercase tracking-tight transition-colors ${
                        isChecked ? 'text-primary' : 'text-foreground'
                      }`}>
                        {attr.name}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground opacity-60">
                        CODE: {attr.code.toUpperCase()}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* FOOTER CAPTION */}
      <div className="flex items-center justify-center gap-4 opacity-30 pt-4">
        <div className="h-[1px] w-20 bg-muted-foreground" />
        <p className="text-[9px] font-bold uppercase tracking-[0.5em]">System Architecture Interface</p>
        <div className="h-[1px] w-20 bg-muted-foreground" />
      </div>
    </div>
  )
}
