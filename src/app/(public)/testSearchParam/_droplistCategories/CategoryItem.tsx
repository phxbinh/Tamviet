'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function CategoryItem({ cat, path }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const hasChildren = cat.children && cat.children.length > 0;
  const isActive =
    path === cat.category_path ||
    path.startsWith(cat.category_path + '/');

  // ✅ click outside để đóng
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative flex flex-col">
      {/* MAIN */}
      <div
        className={`flex items-stretch overflow-hidden rounded-full border transition-all duration-300 ${
          isActive
            ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.1)]'
            : 'border-border/60 bg-card/50'
        }`}
      >
        {/* CATEGORY LINK */}
        <Link
          href={`/testSearchFilter/${cat.category_path}`} prefetch={true}
          className={`px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
            isActive
              ? 'text-primary'
              : 'text-foreground/60 hover:text-primary'
          }`}
        >
          {cat.name}
        </Link>

        {/* TOGGLE */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setOpen((prev) => !prev);
            }}
            className={`px-2 flex items-center border-l border-border/40 transition-colors ${
              open
                ? 'bg-primary/10 text-primary'
                : 'text-foreground/40 hover:bg-primary/20'
            }`}
          >
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-300 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      {hasChildren && (
        <div
          className={`
            absolute left-0 top-full mt-2 min-w-[200px]
            bg-card/95 backdrop-blur-xl border border-border/60
            rounded-2xl p-2 shadow-2xl z-50
            flex flex-col gap-1
            transition-all duration-200
            ${open
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 pointer-events-none'}
          `}
        >
          {cat.children.map((child: any) => (
            <Link
              key={child.id}
              href={`/testSearchFilter/${child.category_path}`} prefetch={true}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                path === child.category_path
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-foreground/60 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

