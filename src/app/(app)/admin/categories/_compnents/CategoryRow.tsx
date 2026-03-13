"use client";

import { useState } from "react";
import { Edit3, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";

export function CategoryRow({ category }: { category: any }) {
  const [isActive, setIsActive] = useState(category.is_active);
  const [isUpdating, setIsUpdating] = useState(false);

  async function toggleStatus() {
    setIsUpdating(true);
    const nextStatus = !isActive;
    
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: nextStatus }),
      });
      if (res.ok) setIsActive(nextStatus);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <tr className="group hover:bg-primary/[0.02] transition-colors duration-300 border-b border-border/50">
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:scale-150 transition-transform" />
          <span className="text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors italic">
            {category.name}
          </span>
        </div>
      </td>

      <td className="px-8 py-6">
        <span className="text-xs font-mono text-foreground/30 bg-muted/50 px-3 py-1 rounded-lg">
          /{category.slug}
        </span>
      </td>

      <td className="px-8 py-6">
        <div className="flex justify-center">
          <button
            onClick={toggleStatus}
            disabled={isUpdating}
            className={`
              flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-tighter transition-all duration-500
              ${isActive 
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                : "bg-orange-500/5 border-orange-500/20 text-orange-600"}
              ${isUpdating ? "opacity-40 cursor-wait" : "hover:scale-105 active:scale-95"}
            `}
          >
            {isUpdating ? (
              <Loader2 className="w-2 h-2 animate-spin" />
            ) : (
              <div className={`w-1.5 h-1.5 rounded-full fill-current ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`} />
            )}
            {isActive ? "Active" : "Inactive"}
          </button>
        </div>
      </td>

      <td className="px-8 py-6">
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/categories/${category.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:bg-foreground hover:text-background transition-all duration-300 group/btn shadow-sm"
          >
            Edit <Edit3 className="w-3 h-3 transition-transform group-hover/btn:rotate-12" />
          </Link>
        </div>
      </td>
    </tr>
  );
}
