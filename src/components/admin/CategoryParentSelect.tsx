
// src/components/admin/CategoryParentSelect.tsx

/*
"use client";

interface Category {
  id: string
  name: string
  parent_id: string | null
}

interface Props {
  categories: Category[]
  value: string | null
  onChange: (id: string | null) => void
  currentId: string
}

function buildTree(
  categories: Category[],
  parent: string | null = null,
  level = 0
): any[] {

  return categories
    .filter(c => c.parent_id === parent)
    .flatMap(c => [
      { ...c, level },
      ...buildTree(categories, c.id, level + 1)
    ])
}

export default function CategoryParentSelect({
  categories,
  value,
  onChange,
  currentId
}: Props) {

  const tree = buildTree(categories)

  return (
    <select
      className="w-full border rounded p-2"
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value || null)
      }
    >

      <option value="">No parent</option>

      {tree.map(c => {

        if (c.id === currentId) return null

        return (
          <option key={c.id} value={c.id}>
            {"— ".repeat(c.level)} {c.name}
          </option>
        )
      })}

    </select>
  )
}
*/




"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, FolderTree, Check, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

interface Props {
  categories: Category[];
  value: string | null;
  onChange: (id: string | null) => void;
  currentId: string;
}

function buildTree(
  categories: Category[],
  parent: string | null = null,
  level = 0
): any[] {
  return categories
    .filter((c) => c.parent_id === parent)
    .flatMap((c) => [
      { ...c, level },
      ...buildTree(categories, c.id, level + 1),
    ]);
}

export default function CategoryParentSelect({
  categories,
  value,
  onChange,
  currentId,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tree = buildTree(categories);

  // Tìm tên của category đang được chọn để hiển thị trên label
  const selectedCategory = tree.find((c) => c.id === value);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full bg-background border px-6 py-4 rounded-2xl cursor-pointer transition-all duration-500
          ${isOpen 
            ? "border-primary/40 ring-[12px] ring-primary/5 shadow-xl shadow-primary/5" 
            : "border-border hover:border-primary/30 hover:bg-primary/[0.01]"}
        `}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <FolderTree className={`w-4 h-4 transition-colors ${value ? 'text-primary' : 'text-foreground/20'}`} />
          <span className={`text-sm font-bold truncate ${!value ? 'text-foreground/30 italic' : 'text-foreground'}`}>
            {selectedCategory ? selectedCategory.name : "Root (No parent)"}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-foreground/20 transition-transform duration-500 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[100] mt-3 w-full max-h-[320px] bg-card border border-border rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-2 overflow-y-auto max-h-[320px] custom-scrollbar">
            
            {/* Option: No Parent */}
            <div
              onClick={() => { onChange(null); setIsOpen(false); }}
              className={`
                flex items-center justify-between px-5 py-3.5 rounded-xl cursor-pointer transition-all group
                ${value === null ? "bg-primary/10 text-primary" : "hover:bg-muted/50 text-foreground/40"}
              `}
            >
              <span className="text-[10px] font-black uppercase tracking-widest italic">None (Set as Root)</span>
              {value === null && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
            </div>

            <div className="h-[1px] bg-border/50 my-2 mx-4" />

            {/* Tree Options */}
            {tree.map((c) => {
              if (c.id === currentId) return null;

              const isSelected = c.id === value;

              return (
                <div
                  key={c.id}
                  onClick={() => { onChange(c.id); setIsOpen(false); }}
                  className={`
                    flex items-center justify-between px-5 py-3.5 rounded-xl cursor-pointer transition-all mb-1 group
                    ${isSelected ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-primary/[0.03] text-foreground/60"}
                  `}
                  style={{ marginLeft: `${c.level * 12}px` }}
                >
                  <div className="flex items-center gap-2">
                    {c.level > 0 && (
                      <div className={`w-2 h-[1px] ${isSelected ? 'bg-white/40' : 'bg-border/60'}`} />
                    )}
                    <span className={`text-sm font-bold ${isSelected ? 'italic' : ''}`}>
                      {c.name}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--primary-rgb), 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}







