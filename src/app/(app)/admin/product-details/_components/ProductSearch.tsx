'use client';

import { Search, Loader2, XCircle } from "lucide-react";
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
    }, 200);

    return () => clearTimeout(timer);
  }, [term, router, searchParams]);

  // Hàm xóa nhanh nội dung
  const handleClear = () => {
    setTerm('');
  };

  return (
    <div className="relative group w-full md:w-72">
      {/* Icon Search / Loading bên trái */}
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
        className="w-full bg-muted/20 border border-border px-9 pr-10 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:opacity-30"
      />

      {/* Nút Xóa bên phải - Chỉ hiện khi có nội dung */}
      {term && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-3 flex items-center group/clear"
          title="Clear search"
        >
          <XCircle className="w-3.5 h-3.5 text-muted-foreground/40 group-hover/clear:text-rose-500 transition-colors" />
        </button>
      )}
    </div>
  );
}
