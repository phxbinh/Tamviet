// src/components/admin/ProductSearch.tsx
'use client';

import { Search, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(searchParams.get('q') || '');

  // Logic Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }
      
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    }, 200); // 200ms debounce

    return () => clearTimeout(timer);
  }, [term, router, searchParams]);

  return (
    <div className="relative group w-full md:w-72">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        {isPending ? (
          <Loader2 className="w-3 h-3 text-primary animate-spin" />
        ) : (
          <Search className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </div>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="SEARCH REGISTRY..."
        className="w-full bg-muted/20 border border-border px-9 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:opacity-30"
      />
    </div>
  );
}
