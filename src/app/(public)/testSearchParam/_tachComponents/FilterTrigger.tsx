
'use client';

import {
  SlidersHorizontal,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

type FilterTriggerProps = {
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
};

export function FilterTrigger({
  isExpanded,
  setIsExpanded
}: FilterTriggerProps) {
  return (
    <div className="relative w-full z-[10]">
      <div className="bg-card/40 backdrop-blur-3xl p-1 border border-border/40 shadow-xl relative z-[110]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 ${
            isExpanded ? "bg-primary text-white" : "bg-foreground/5 text-foreground/60"
          }`}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className={`w-4 h-4 ${isExpanded ? 'rotate-180' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Filters & Categories
            </span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}




