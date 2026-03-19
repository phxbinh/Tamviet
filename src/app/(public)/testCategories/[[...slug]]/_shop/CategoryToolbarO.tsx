// src/components/shop/CategoryToolbar.tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  category_path: string;
  category_depth: number;
}

interface Props {
  categories: Category[];
  currentPath?: string;
  onCategoryClick?: (path: string) => void;
}

export function CategoryToolbar({
  categories,
  currentPath,
  onCategoryClick,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-card/40 backdrop-blur-3xl p-2 rounded-[2rem] border border-border/40 shadow-2xl shadow-black/5 overflow-x-auto no-scrollbar">
        
        {/* ALL */}
        <Link
          href="/testCategories"
          onClick={(e) => {
            if (!onCategoryClick) return;
            e.preventDefault();
            onCategoryClick("");
          }}
          className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${
            !currentPath
              ? "bg-foreground text-background border-foreground shadow-lg"
              : "border-transparent text-foreground/40 hover:text-foreground hover:bg-foreground/5"
          }`}
        >
          All Series
        </Link>

        {/* CATEGORY LIST */}
        {categories.map((cat) => {
          const href = `/testCategories/${cat.category_path}`;
          const isActive = currentPath === cat.category_path;

          return (
            <Link
              key={cat.id}
              href={href}
              onClick={(e) => {
                if (!onCategoryClick) return;
                e.preventDefault();
                onCategoryClick(cat.category_path);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border whitespace-nowrap ${
                isActive
                  ? "bg-primary text-white border-primary shadow-[0_10px_20px_rgba(var(--primary),0.3)]"
                  : "border-transparent text-foreground/40 hover:text-primary hover:bg-primary/5"
              }`}
            >
              {cat.category_depth > 0 && (
                <ChevronRight className="w-3 h-3 opacity-30" />
              )}
              {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}