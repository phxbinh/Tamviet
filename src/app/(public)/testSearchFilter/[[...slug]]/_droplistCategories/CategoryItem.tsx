'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function CategoryItem({ cat, path }: any) {
  const [open, setOpen] = useState(false);

  const hasChildren = cat.children && cat.children.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center gap-1">
        <Link
          href={`/testSearchFilter/${cat.category_path}`}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border whitespace-nowrap ${
            path === cat.category_path
              ? "bg-primary text-white border-primary"
              : "border-transparent text-foreground/40 hover:text-primary hover:bg-primary/5"
          }`}
        >
          {cat.category_depth > 0 && (
            <ChevronRight className="w-3 h-3 opacity-30" />
          )}
          {cat.name}
        </Link>

        {/* Toggle button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setOpen((prev) => !prev);
            }}
            className="p-1"
          >
            <ChevronRight
              className={`w-3 h-3 transition-transform ${
                open ? 'rotate-90' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* CHILDREN */}
      {hasChildren && open && (
        <div className="absolute left-full top-0 ml-2 bg-background border rounded-md shadow-lg p-2 min-w-[150px] z-50">
          {cat.children.map((child: any) => (
            <CategoryItem key={child.id} cat={child} path={path} />
          ))}
        </div>
      )}
    </div>
  );
}