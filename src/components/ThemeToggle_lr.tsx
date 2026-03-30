// src/components/ThemeToggle.tsx
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Plus } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  
  if (!mounted) return <div className="w-10 h-10" />; 

  const modes = [
    { id: 'system', icon: Monitor, label: 'OS', color: 'text-purple-500 dark:text-purple-400' },
    { id: 'dark', icon: Moon, label: 'Dark', color: 'text-blue-500 dark:text-blue-400' },
    { id: 'light', icon: Sun, label: 'Light', color: 'text-orange-500 dark:text-orange-400' },
  ];

  const currentMode = modes.find(m => m.id === theme) || modes[0];
  const CurrentIcon = currentMode.icon;

  return (
    <div className="relative flex items-center bg-transparent select-none">
      
      {/* NÚT TRIGGER */}
      <button
        type="button"
        aria-label="Đổi chế độ sáng tối"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center border outline-none transition-all duration-500 shadow-lg z-20 ${
          isOpen 
            ? "bg-neon-cyan border-neon-cyan text-black rotate-45 shadow-[0_0_20px_rgba(34,211,238,0.4)]" 
            : "bg-card/90 dark:bg-card/80 backdrop-blur-xl border-border/80 text-foreground hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
        }`}
      >
        {isOpen ? <Plus size={22} strokeWidth={2.5} /> : <CurrentIcon size={18} />}
      </button>

      {/* MENU XỔ NGANG (TRÁI → PHẢI) */}
      <div 
        className={`flex flex-row items-center gap-2 absolute right-full mr-3 top-1/2 -translate-y-1/2
          transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isOpen 
            ? "opacity-100 translate-x-0 scale-100 visible" 
            : "opacity-0 translate-x-2 scale-95 invisible pointer-events-none"
          }`}
      >
        {modes.map((mode, index) => (
          <button
            aria-label={mode.label}
            key={mode.id}
            type="button"
            onClick={() => {
              setTheme(mode.id);
              setIsOpen(false);
            }}
            style={{
              transitionDelay: isOpen ? `${index * 50}ms` : "0ms"
            }}
            className={`group relative flex items-center justify-center w-9 h-9 rounded-full 
              bg-card/80 dark:bg-card/90 backdrop-blur-lg border border-border/60 
              shadow-sm transition-all duration-300 hover:scale-110 active:scale-95
              ${theme === mode.id 
                ? "ring-2 ring-neon-cyan/50 border-neon-cyan" 
                : "hover:border-neon-cyan/50"}
            `}
          >
            <mode.icon size={16} className={mode.color} />
            
            {/* Tooltip */}
            <span className="absolute right-12 px-2 py-1 rounded-md bg-popover/90 backdrop-blur-md text-[10px] font-bold border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none">
              {mode.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}