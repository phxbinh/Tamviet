/*
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


*/

/*
'use client';

import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function CategoryItem({ cat, path }: any) {
  const [open, setOpen] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;

  // Kiểm tra xem item này có đang được chọn không (active)
  const isActive = path === cat.category_path;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center gap-1">
        <Link
          href={`/testSearchFilter/${cat.category_path}`}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border whitespace-nowrap ${
            isActive
              ? "bg-primary text-white border-primary shadow-sm"
              : "border-transparent text-foreground/60 hover:text-primary hover:bg-primary/5"
          }`}
        >
          {cat.name}
          
     
          {hasChildren && (
            <ChevronRight 
              className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} 
            />
          )}
        </Link>
      </div>


      {hasChildren && open && (
        <div 
          className="absolute left-0 top-full mt-1 lg:left-full lg:top-0 lg:ml-2 flex flex-col gap-1 bg-white border border-border rounded-lg shadow-xl p-2 min-w-[180px] z-[100] animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()} // Ngăn chặn nổi bọt sự kiện
        >
          {cat.children.map((child: any) => (
            <CategoryItem key={child.id || child.category_path} cat={child} path={path} />
          ))}
        </div>
      )}
    </div>
  );
}
*/


/*
'use client';

import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function CategoryItem({ cat, path }: any) {
  const [open, setOpen] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;
  const isActive = path === cat.category_path;

  return (
    <div className="relative flex flex-col items-start w-full group">
      <div className="flex items-stretch w-full overflow-hidden transition-all duration-300 border rounded-full border-border group-hover:border-primary/50">
        //PHẦN 1: TAG LINK (Click để vào category cha) 
        <Link
          href={`/testSearchFilter/${cat.category_path}`}
          className={`flex-1 flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-colors ${
            isActive
              ? "bg-primary text-white"
              : "bg-card text-foreground/50 hover:text-primary"
          }`}
        >
          {cat.category_depth > 0 && (
            <ChevronRight className="w-3 h-3 opacity-30" />
          )}
          <span className="truncate">{cat.name}</span>
        </Link>

        //PHẦN 2: ICON TOGGLE (Chỉ hiện khi có con) 
        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setOpen(!open);
            }}
            className={`px-2 flex items-center justify-center border-l border-border transition-colors hover:bg-primary/10 ${
              open ? "text-primary bg-primary/5" : "text-foreground/30"
            }`}
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      //DROPLIST CON
      {hasChildren && open && (
        <div className="flex flex-col w-full gap-1 mt-1 ml-4 border-l border-border/50 pl-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {cat.children.map((child: any) => (
            <CategoryItem key={child.id || child.category_path} cat={child} path={path} />
          ))}
        </div>
      )}
    </div>
  );
}

*/

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
          href={`/testSearchFilter/${cat.category_path}`}
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
              href={`/testSearchFilter/${child.category_path}`}
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



