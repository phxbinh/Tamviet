"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Database, 
  ExternalLink, 
  ListTree, 
  Activity,
  Check,
  Loader2
} from "lucide-react"

type Attribute = {
  id: string
  code: string
  name: string
  type: string
  created_at: string
}

const ATTRIBUTE_TYPES = [
  "text",
  "color",
  "number",
  "size",
  "material",
]

export default function AttributesPage() {
  const [data, setData] = useState<Attribute[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [type, setType] = useState("text")
  const [editingId, setEditingId] = useState<string | null>(null)

  async function loadData() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/attributes")
      const json = await res.json()
      setData(json)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  async function handleAction(e: React.FormEvent) {
    e.preventDefault()
    setActionLoading(true)
    const url = editingId ? `/api/admin/attributes/${editingId}` : "/api/admin/attributes"
    const method = editingId ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, name, type }),
    })

    if (!res.ok) {
      const err = await res.json()
      alert(err.error)
      setActionLoading(false)
      return
    }

    resetForm()
    loadData()
    setActionLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Terminate this attribute system?")) return
    await fetch(`/api/admin/attributes/${id}`, { method: "DELETE" })
    loadData()
  }

  function resetForm() {
    setEditingId(null); setCode(""); setName(""); setType("text")
  }

  return (
    <div className="space-y-8 animate-fade-in custom-scrollbar">
      {/* HEADER: Sự tham vọng */}
      <div className="border-l-4 border-primary pl-6 py-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary animate-breathe-slow" />
          System Attributes
        </h1>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">
          Cấu hình thông số kỹ thuật cốt lõi
        </p>
      </div>

      {/* FORM: Sự chắc chắn */}
      <section className="bg-card border border-border p-1 shadow-2xl relative overflow-hidden">
        <div className="bg-muted/30 px-4 py-2.5 border-b border-border flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {editingId ? "Modify Attribute Specification" : "Initialize New Attribute"}
          </span>
        </div>

        <form onSubmit={handleAction} className="p-5 flex flex-col lg:flex-row gap-4">
          <input
            placeholder="CODE (VD: SIZE_UK)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-background border border-border px-4 py-3 text-[11px] font-mono font-bold uppercase tracking-widest focus:border-primary outline-none transition-all"
            required
          />
          <input
            placeholder="DISPLAY NAME"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-background border border-border px-4 py-3 text-[11px] font-black uppercase tracking-widest focus:border-primary outline-none transition-all"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 bg-background border border-border px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] focus:border-primary outline-none cursor-pointer"
          >
            {ATTRIBUTE_TYPES.map((t) => (
              <option key={t} value={t}>{t.toUpperCase()}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button 
              type="submit"
              disabled={actionLoading}
              className="flex-1 lg:flex-none bg-primary text-white px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : editingId ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {editingId ? "Sync" : "Register"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-border bg-background px-4 py-3 hover:bg-muted transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </section>

      {/* TABLE: Sự sắc sảo & Chất lượng */}
      <div className="bg-card border border-border shadow-sm overflow-hidden">
        <div className="bg-muted/20 border-b border-border px-6 py-3 flex items-center justify-between">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <Database className="w-3 h-3 text-primary" />
            Active Protocols: {data.length}
          </span>
          <Activity className="w-3 h-3 text-neon-cyan animate-pulse" />
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Accessing Data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/10 text-muted-foreground border-b border-border">
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em]">Code</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em]">Designation</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em]">Data Type</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em] text-right">Operational Actions</th>
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
                    <td className="p-5 text-sm font-black uppercase tracking-tight text-foreground">
                      {item.name}
                    </td>
                    <td className="p-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted/50 border border-border rounded-sm">
                        <div className="w-1 h-1 rounded-full bg-neon-cyan shadow-[0_0_5px_#22d3ee]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{item.type}</span>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap sm:flex-nowrap">
                        <Link
                          href={`/admin/attributes/${item.id}/values`}
                          className="inline-flex items-center gap-2 px-3 py-2 border border-border text-[9px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all bg-card shadow-sm"
                        >
                          <ListTree className="w-3 h-3" />
                          Values
                        </Link>
                        
                        <button
                          onClick={() => {
                            setEditingId(item.id); setCode(item.code); setName(item.name); setType(item.type)
                          }}
                          className="inline-flex items-center gap-2 px-3 py-2 border border-border text-[9px] font-black uppercase tracking-widest hover:bg-muted transition-all shadow-sm"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"
                        >
                          <Trash2 className="w-3 h-3" />
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

      <p className="text-[9px] text-muted-foreground text-center font-bold uppercase tracking-[0.5em] opacity-30 py-4">
        Strategic Command // Data Architecture Interface
      </p>
    </div>
  )
}
