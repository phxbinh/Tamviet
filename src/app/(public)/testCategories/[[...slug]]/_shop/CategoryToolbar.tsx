
// src/app/(public)/testCategories/[[...slug]]/_shop/CategoryToolbar.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";

interface Category {
  id: string;
  name: string;
  category_path: string;
  category_depth: number;
}

interface Props {
  categories: Category[];
  currentPath?: string; // path hiện tại
}


export function CategoryToolbar({ categories, currentPath }: Props) {
  const router = useRouter();

  // tránh prefetch spam
  const prefetched = useRef(new Set<string>());

  const handlePrefetch = (href: string) => {
    if (prefetched.current.has(href)) return;
    prefetched.current.add(href);

    router.prefetch(href);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-card/40 backdrop-blur-3xl p-2 rounded-[2rem] border border-border/40 shadow-2xl shadow-black/5 overflow-x-auto no-scrollbar">
        
        
        <Link
          href="/testCategories"
          prefetch={true}
          onMouseEnter={() => handlePrefetch("/testCategories")}
          onTouchStart={() => handlePrefetch("/testCategories")}
          className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${
            !currentPath
              ? "bg-foreground text-background border-foreground shadow-lg"
              : "border-transparent text-foreground/40 hover:text-foreground hover:bg-foreground/5"
          }`}
        >
          All Series
        </Link>

        
        {categories.map((cat) => {
          const href = `/testCategories/${cat.category_path}`;
          const isActive = currentPath === cat.category_path;

          return (
            <Link
              key={cat.id}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                // 👉 navigation client-side
                router.push(`${href}`);
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










