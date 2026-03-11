"use client"

import { useEffect, useState } from "react"
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Database, 
  Activity,
  Terminal,
  Loader2
} from "lucide-react"

type ProductType = {
  id: string
  code: string
  name: string
  created_at: string
}

export default function ProductTypesPage() {
  const [data, setData] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  async function loadData() {
    setLoading(true)
    const res = await fetch("/api/admin/product-types")
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setActionLoading(true)
    const res = await fetch("/api/admin/product-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, name }),
    })
    if (!res.ok) { setActionLoading(false); return alert("Error") }
    setCode(""); setName(""); loadData(); setActionLoading(false)
  }

  async function handleUpdate(id: string) {
    setActionLoading(true)
    const res = await fetch(`/api/admin/product-types/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, name }),
    })
    if (!res.ok) { setActionLoading(false); return alert("Error") }
    setEditingId(null); setCode(""); setName(""); loadData(); setActionLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Confirm system deletion?")) return
    const res = await fetch(`/api/admin/product-types/${id}`, { method: "DELETE" })
    loadData()
  }

  return (
    <div className="space-y-8 animate-fade-in custom-scrollbar">
      {/* HEADER SECTION */}
      <div className="border-l-4 border-primary pl-6 py-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
          <Layers className="w-8 h-8 text-primary animate-breathe-slow" />
          Classification Registry
        </h1>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">
          Quản lý danh mục cấu trúc hệ thống
        </p>
      </div>

      {/* FORM SECTION - COMMAND INPUT */}
      <section className="bg-card border border-border p-1 shadow-2xl">
        <div className="bg-muted/30 px-4 py-2 border-b border-border flex items-center gap-2">
          <Terminal className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {editingId ? "Update Parameters" : "Initialize New Class"}
          </span>
        </div>
        
        <form
          onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId) } : handleCreate}
          className="p-4 flex flex-col md:flex-row gap-3"
        >
          <div className="flex-1 relative group">
            <input
              placeholder="SYSTEM_CODE (vd: SHIRT)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-background border border-border px-4 py-3 text-[11px] font-mono font-bold uppercase tracking-widest focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <div className="flex-1">
            <input
              placeholder="DISPLAY_NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-border px-4 py-3 text-[11px] font-black uppercase tracking-widest focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <div className="flex gap-2">
            <button 
              disabled={actionLoading}
              className="bg-primary text-white px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : editingId ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {editingId ? "Apply" : "Register"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setCode(""); setName("") }}
                className="border border-border bg-background px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </form>
      </section>

      {/* TABLE SECTION */}
      <div className="bg-card border border-border shadow-sm overflow-hidden relative">
        <div className="bg-muted/20 border-b border-border px-6 py-3 flex items-center justify-between">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <Database className="w-3 h-3 text-primary" />
            Registry Database: {data.length} Units
          </span>
          <Activity className="w-3 h-3 text-neon-cyan animate-pulse" />
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Syncing Registry...</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/10 text-muted-foreground border-b border-border">
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em]">Code Designation</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em]">Operational Name</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((item) => (
                  <tr key={item.id} className="group hover:bg-primary/[0.03] transition-all duration-300">
                    <td className="p-5">
                      <span className="font-mono text-xs font-bold text-primary tracking-widest bg-primary/5 px-2 py-1 border border-primary/10">
                        {item.code.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="text-sm font-black uppercase tracking-tight text-foreground">
                        {item.name}
                      </span>
                    </td>
                    {/* Thay thế phần <td className="p-5 text-right space-x-2"> cũ bằng đoạn này */}
                    <td className="p-5">
                      <div className="flex items-center justify-end gap-3">
                        {/* NÚT EDIT - CHIẾN THUẬT SẮC SẢO */}
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setCode(item.code);
                            setName(item.name);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 active:translate-y-0.5 shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Unit</span>
                        </button>
                    
                        {/* NÚT DELETE - CẢNH BÁO NGUY HIỂM */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/20 bg-red-500/5 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Decommission</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FOOTER CAPTION */}
      <p className="text-[9px] text-muted-foreground text-center font-bold uppercase tracking-[0.5em] opacity-40">
        End of Data Registry // Strategic Command
      </p>
    </div>
  )
}
