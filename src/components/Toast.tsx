"use client";

import { useToastStore } from "@/store/useToastStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Toast() {
  const { message, type, isVisible, hideToast } = useToastStore();
  const [mounted, setMounted] = useState(false);

  // Tránh lỗi Hydration trong Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isVisible) return null;

  const configs = {
    success: {
      icon: CheckCircle2,
      color: "text-neon-cyan",
      border: "border-neon-cyan/50",
      bg: "bg-neon-cyan/10",
      shadow: "shadow-[0_0_20px_rgba(34,211,238,0.2)]",
    },
    error: {
      icon: AlertCircle,
      color: "text-red-500",
      border: "border-red-500/50",
      bg: "bg-red-500/10",
      shadow: "shadow-[0_0_20px_rgba(239,68,68,0.2)]",
    },
    info: {
      icon: Info,
      color: "text-neon-purple",
      border: "border-neon-purple/50",
      bg: "bg-neon-purple/10",
      shadow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="fixed top-24 right-5 z-[999] animate-in slide-in-from-right-full fade-in duration-500">
      <div className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl bg-card/80 backdrop-blur-xl border ${config.border} ${config.shadow} min-w-[300px] max-w-sm`}>
        
        {/* Lớp nền phát sáng nhẹ */}
        <div className={`absolute inset-0 -z-10 rounded-2xl ${config.bg}`} />

        <div className={`${config.color}`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground tracking-tight leading-snug">
            {message}
          </p>
        </div>

        <button 
          onClick={hideToast}
          className="p-1 rounded-lg hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-all"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
