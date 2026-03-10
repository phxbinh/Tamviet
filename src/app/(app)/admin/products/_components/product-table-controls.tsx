/*
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { useTransition } from "react";

export function ProductTableControls() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 border border-border">
 
      <div className="relative w-full md:w-96 group">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isPending ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
        <input
          type="text"
          placeholder="SEARCH ASSET DESIGNATION..."
          className="w-full bg-muted/20 border border-border p-3 pl-10 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/30"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("q")?.toString()}
        />
      </div>

     
      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <Filter className="w-3 h-3 text-muted-foreground mr-2 shrink-0" />
        {["all", "active", "draft", "archived"].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-4 py-2 text-[9px] font-black uppercase tracking-tighter border transition-all whitespace-nowrap ${
              (searchParams.get("status") || "all") === status
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-transparent text-muted-foreground border-border hover:border-primary"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
*/


/* Co useDebounce use-debounce 
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce"; // Import thư viện

export function ProductTableControls() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  // Debounce hàm search: Chỉ chạy sau khi người dùng ngừng gõ 300ms
  const debouncedSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    
    // Sử dụng startTransition để Next.js giữ UI hiện tại 
    // cho đến khi dữ liệu mới sẵn sàng, tránh cảm giác lag
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, 300);

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 border border-border">
     
      <div className="relative w-full md:w-96 group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {isPending ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          )}
        </div>
        <input
          type="text"
          placeholder="SEARCH ASSET DESIGNATION..."
          className="w-full bg-muted/20 border border-border p-3 pl-10 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/30"
          onChange={(e) => debouncedSearch(e.target.value)}
          defaultValue={searchParams.get("q")?.toString()}
        />
      </div>

     
      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mr-2 flex items-center gap-1 shrink-0">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {["all", "active", "draft", "archived"].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-4 py-2 text-[9px] font-black uppercase tracking-tighter border transition-all whitespace-nowrap ${
              (searchParams.get("status") || "all") === status
                ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
*/


"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Loader2, X } from "lucide-react"; // Thêm icon X
import { useTransition, useRef, useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

export function ProductTableControls() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Dùng ref để điều khiển giá trị input trực tiếp khi Clear
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasQuery, setHasQuery] = useState(!!searchParams.get("q"));

  // Cập nhật trạng thái nút X khi URL thay đổi (ví dụ: người dùng nhấn Back)
  useEffect(() => {
    setHasQuery(!!searchParams.get("q"));
    if (inputRef.current) {
      inputRef.current.value = searchParams.get("q") || "";
    }
  }, [searchParams]);

  const debouncedSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, 300);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setHasQuery(false);
      debouncedSearch(""); // Gọi hàm search với chuỗi rỗng để cập nhật URL
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 border border-border">
      {/* SEARCH INPUT CONTAINER */}
      <div className="relative w-full md:w-96 group">
        {/* ICON TRÁI: Search hoặc Loading */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          {isPending ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="SEARCH ASSET DESIGNATION..."
          className="w-full bg-muted/20 border border-border p-3 pl-10 pr-10 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/30"
          onChange={(e) => {
            setHasQuery(!!e.target.value);
            debouncedSearch(e.target.value);
          }}
          defaultValue={searchParams.get("q")?.toString()}
        />

        {/* NÚT CLEAR (X): Chỉ hiện khi có chữ */}
        {hasQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted/50 rounded-full transition-colors group/clear"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground group-hover/clear:text-primary" />
          </button>
        )}
      </div>

      {/* FILTER BUTTONS (Giữ nguyên phần cũ của bạn) */}
      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mr-2 flex items-center gap-1 shrink-0">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {["all", "active", "draft", "archived"].map((status) => (
          <button
            key={status}
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              if (status !== "all") params.set("status", status);
              else params.delete("status");
              startTransition(() => replace(`${pathname}?${params.toString()}`, { scroll: false }));
            }}
            className={`px-4 py-2 text-[9px] font-black uppercase tracking-tighter border transition-all whitespace-nowrap ${
              (searchParams.get("status") || "all") === status
                ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}









