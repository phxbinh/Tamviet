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
      {/* SEARCH INPUT */}
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

      {/* FILTER BUTTONS */}
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
