"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Save, 
  Trash2, 
  Hash, 
  Database, 
  Activity, 
  Loader2, 
  CheckCircle2,
  Terminal
} from "lucide-react";

type AttributeValue = {
  id: string;
  value: string;
  sort_order: number;
};

export default function AttributeValuesClient({
  attributeId,
}: {
  attributeId: string;
}) {
  const [values, setValues] = useState<AttributeValue[]>([]);
  const [newValue, setNewValue] = useState("");
  const [newSortOrder, setNewSortOrder] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  async function fetchValues() {
    setLoading(true);
    const res = await fetch(
      `/api/admin/attribute-values?attributeId=${attributeId}`
    );
    const data = await res.json();
    setValues(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchValues();
  }, [attributeId]);

  async function handleCreate() {
    if (!newValue.trim()) return;
    setIsCreating(true);
    const res = await fetch("/api/admin/attribute-values", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attribute_id: attributeId,
        value: newValue,
        sort_order: newSortOrder,
      }),
    });

    if (res.ok) {
      setNewValue("");
      setNewSortOrder(0);
      await fetchValues();
    }
    setIsCreating(false);
  }

  async function handleUpdate(id: string, value: string, sort: number) {
    await fetch(`/api/admin/attribute-values/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value, sort_order: sort }),
    });
    // Optional: Hiển thị toast "Synced" ở đây
    fetchValues();
  }

  async function handleDelete(id: string) {
    if (!confirm("Decommission this value?")) return;
    await fetch(`/api/admin/attribute-values/${id}`, {
      method: "DELETE",
    });
    fetchValues();
  }

  if (loading && values.length === 0) return (
    <div className="p-20 flex flex-col items-center gap-4 animate-fade-in">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Accessing Sub-layers...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in custom-scrollbar">
      {/* HEADER SECTION */}
      <div className="border-l-4 border-primary pl-6 py-2">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-3">
          <Database className="w-6 h-6 text-primary" />
          Value Parameters
        </h1>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">
          Cấu hình chi tiết các phân lớp dữ liệu
        </p>
      </div>

      {/* CREATE FORM: Sắc sảo & Chắc chắn */}
      <section className="bg-card border border-border p-1 shadow-2xl overflow-hidden">
        <div className="bg-muted/30 px-4 py-2 border-b border-border flex items-center gap-2">
          <Terminal className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Initialize New Entry
          </span>
        </div>
        
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-[3] relative">
            <input
              className="w-full bg-background border border-border px-4 py-2.5 text-[11px] font-black uppercase tracking-widest focus:border-primary outline-none transition-all"
              placeholder="ENTER VALUE NAME..."
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
              <Hash className="w-3 h-3" />
            </div>
            <input
              type="number"
              className="w-full bg-background border border-border pl-8 pr-4 py-2.5 text-[11px] font-mono font-bold focus:border-primary outline-none transition-all"
              value={newSortOrder}
              onChange={(e) => setNewSortOrder(Number(e.target.value))}
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="bg-primary text-white px-8 py-2.5 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
            Register
          </button>
        </div>
      </section>

      {/* LIST TABLE: Nổi bật chất lượng */}
      <div className="bg-card border border-border shadow-sm overflow-hidden">
        <div className="bg-muted/20 border-b border-border px-6 py-3 flex items-center justify-between">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <Activity className="w-3 h-3 text-neon-cyan animate-pulse" />
            Sub-layer Entries: {values.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/10 text-muted-foreground border-b border-border">
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em]">Operational Value</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em] w-32">Priority</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-[0.3em] text-right">Synchronization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {values.map((v) => (
                <Row
                  key={v.id}
                  item={v}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
              {values.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
                    No sub-parameters defined for this sector
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({
  item,
  onUpdate,
  onDelete,
}: {
  item: AttributeValue;
  onUpdate: (id: string, value: string, sort: number) => void;
  onDelete: (id: string) => void;
}) {
  const [value, setValue] = useState(item.value);
  const [sort, setSort] = useState(item.sort_order);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleLocalUpdate = async () => {
    setIsSyncing(true);
    await onUpdate(item.id, value, sort);
    setIsSyncing(false);
  };

  return (
    <tr className="group hover:bg-primary/[0.02] transition-colors duration-300">
      <td className="p-4">
        <input
          className="w-full bg-transparent border-b border-transparent group-hover:border-border px-2 py-1.5 text-sm font-black uppercase tracking-tight focus:border-primary outline-none transition-all"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </td>
      <td className="p-4">
        <div className="flex items-center bg-muted/30 px-2 border border-transparent group-hover:border-border transition-all">
          <Hash className="w-3 h-3 text-muted-foreground opacity-30" />
          <input
            type="number"
            className="w-full bg-transparent px-2 py-1.5 text-xs font-mono font-bold outline-none"
            value={sort}
            onChange={(e) => setSort(Number(e.target.value))}
          />
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleLocalUpdate}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm active:translate-y-0.5"
          >
            {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            {isSyncing ? "Syncing" : "Apply"}
          </button>
          
          <button
            onClick={() => onDelete(item.id)}
            className="inline-flex items-center p-2 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
