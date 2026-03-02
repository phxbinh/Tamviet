// src/components/ThemeToggle.tsx
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, ChevronUp, Plus } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const modes = [
    { id: 'system', icon: Monitor, label: 'OS', color: 'text-purple-400' },
    { id: 'dark', icon: Moon, label: 'Dark', color: 'text-blue-400' },
    { id: 'light', icon: Sun, label: 'Light', color: 'text-orange-400' },
  ];

  const CurrentIcon = modes.find(m => m.id === theme)?.icon || Monitor;

  return (
    <div className="relative flex flex-col items-center">
      {/* MENU CỘT - Thu nhỏ kích thước và khoảng cách */}
      <div 
        className={`flex flex-col gap-2 mb-3 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isOpen 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-4 scale-75 pointer-events-none"
        }`}
      >
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              setTheme(mode.id);
              setIsOpen(false);
            }}
            className={`group relative flex items-center justify-center w-9 h-9 rounded-full bg-card/90 backdrop-blur-md border border-border shadow-sm hover:border-neon-cyan transition-all ${
              theme === mode.id ? "bg-accent border-neon-cyan/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]" : ""
            }`}
          >
            <mode.icon size={16} className={mode.color} />
            
            {/* Tooltip nhỏ gọn bên trái */}
            <span className="absolute right-12 px-2 py-0.5 rounded-md bg-popover text-[10px] font-medium border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              {mode.label}
            </span>
          </button>
        ))}
      </div>

      {/* NÚT TRIGGER CHÍNH - Thu nhỏ từ 14 xuống 10 (w-10 h-10) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 shadow-lg ${
          isOpen 
            ? "bg-neon-cyan border-neon-cyan text-black rotate-45 shadow-[0_0_15px_rgba(34,211,238,0.5)]" 
            : "bg-card/80 backdrop-blur-md border-border text-foreground hover:border-neon-cyan/50"
        }`}
      >
        {/* Dùng icon Plus xoay 45 độ sẽ thành dấu X khi mở, nhìn rất hiện đại */}
        {isOpen ? <Plus size={20} /> : <CurrentIcon size={18} />}
      </button>
    </div>
  );
}






