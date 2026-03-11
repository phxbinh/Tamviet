// src/app/(app)/admin/products/_components/CopySkusButton.tsx
"use client";

import { useState } from "react";
import { ClipboardCopy, Check, Terminal } from "lucide-react";

export default function CopySkusButton({ skus }: { skus: string[] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (skus.length === 0) return;
    
    // Gộp các SKU lại, cách nhau bởi dấu phẩy hoặc dòng mới tùy nhu cầu
    const textToCopy = skus.join(", ");
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy protocol:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        relative overflow-hidden flex items-center gap-2 px-4 py-2 
        text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300
        border shadow-sm active:scale-95
        ${copied 
          ? "bg-green-500 border-green-500 text-white" 
          : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
        }
      `}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          <span>Skus Copied</span>
        </>
      ) : (
        <>
          <ClipboardCopy className="w-3 h-3" />
          <span>Copy All SKUs</span>
        </>
      )}
      
      {/* Hiệu ứng tia sáng khi hoàn tất */}
      {copied && (
        <div className="absolute inset-0 bg-white/20 animate-ping pointer-events-none" />
      )}
    </button>
  );
}
